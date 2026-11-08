-- Database objects for RS Ummu Hani queue backend (MySQL 8.x).
-- Apply only to the development database first and compare column names with the real SIMRS schema.

CREATE OR REPLACE VIEW vw_rekap_antrian_harian AS
SELECT
  p.noindex,
  p.tiketreg,
  p.noantripoli,
  p.tanggalberobat,
  p.norm,
  p.poli AS poli,
  po.poli AS nama_poli,
  p.dokter,
  p.jamdatang,
  p.jenisantrian,
  p.status_pendaftaran,
  t.task1,
  t.task2,
  t.task3,
  t.task4,
  t.task5,
  t.task6,
  t.task7,
  TIMESTAMPDIFF(SECOND, t.task1, t.task3) AS durasi_tunggu_detik,
  TIMESTAMPDIFF(SECOND, t.task3, t.task5) AS durasi_pelayanan_detik
FROM Pendaftaran AS p
LEFT JOIN Poli AS po ON po.kode_poli = p.poli
LEFT JOIN Task_Antrian AS t
  ON t.kodebooking = p.tiketreg
 AND t.tanggal = p.tanggalberobat;

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_reset_antrean_harian$$
CREATE PROCEDURE sp_reset_antrean_harian()
BEGIN
  -- Preserve Pendaftaran history. Numbering is date-scoped by the backend, so
  -- the first registration for a poli on a new date naturally gets noantripoli=1.
  -- This routine exposes the next number per poli for operational verification;
  -- it intentionally does not delete or renumber historical registrations.
  SELECT
    po.kode_poli,
    po.poli,
    CURRENT_DATE() AS tanggal_operasional,
    COALESCE(MAX(p.noantripoli), 0) + 1 AS nomor_berikutnya
  FROM Poli AS po
  LEFT JOIN Pendaftaran AS p
    ON p.poli = po.kode_poli
   AND p.tanggalberobat = CURRENT_DATE()
  GROUP BY po.kode_poli, po.poli
  ORDER BY po.kode_poli;
END$$

DROP TRIGGER IF EXISTS trg_log_status_pendaftaran$$
CREATE TRIGGER trg_log_status_pendaftaran
AFTER UPDATE ON Pendaftaran
FOR EACH ROW
BEGIN
  IF NOT (OLD.status_pendaftaran <=> NEW.status_pendaftaran) THEN
    IF LOWER(NEW.status_pendaftaran) IN ('diverifikasi', 'verified') THEN
      UPDATE Task_Antrian
         SET task2 = COALESCE(task2, CURRENT_TIMESTAMP)
       WHERE kodebooking = NEW.tiketreg AND tanggal = NEW.tanggalberobat;
    ELSEIF LOWER(NEW.status_pendaftaran) IN ('called', 'dipanggil') THEN
      UPDATE Task_Antrian
         SET task3 = COALESCE(task3, CURRENT_TIMESTAMP)
       WHERE kodebooking = NEW.tiketreg AND tanggal = NEW.tanggalberobat;
    ELSEIF LOWER(NEW.status_pendaftaran) IN ('serving', 'sedang dilayani') THEN
      UPDATE Task_Antrian
         SET task4 = COALESCE(task4, CURRENT_TIMESTAMP)
       WHERE kodebooking = NEW.tiketreg AND tanggal = NEW.tanggalberobat;
    ELSEIF LOWER(NEW.status_pendaftaran) IN ('done', 'selesai') THEN
      UPDATE Task_Antrian
         SET task5 = COALESCE(task5, CURRENT_TIMESTAMP)
       WHERE kodebooking = NEW.tiketreg AND tanggal = NEW.tanggalberobat;
    END IF;
  END IF;
END$$

DROP EVENT IF EXISTS ev_reset_antrean_harian$$
CREATE EVENT ev_reset_antrean_harian
ON SCHEDULE EVERY 1 DAY
STARTS (CURRENT_DATE + INTERVAL 1 DAY)
DO CALL sp_reset_antrean_harian()$$

DELIMITER ;
