-- CreateTable
CREATE TABLE `User` (
    `login` VARCHAR(50) NOT NULL,
    `password` VARCHAR(250) NOT NULL,
    `grupuser` VARCHAR(50) NOT NULL,
    `namalengkap` VARCHAR(50) NOT NULL,
    `poli` VARCHAR(50) NULL,
    `token` VARCHAR(255) NULL,

    PRIMARY KEY (`login`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Poli` (
    `kode_poli` VARCHAR(20) NOT NULL,
    `poli` VARCHAR(100) NOT NULL,
    `aktifonline` TINYINT NOT NULL,
    `deskripsi` VARCHAR(150) NULL,

    PRIMARY KEY (`kode_poli`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pasien` (
    `norm` VARCHAR(50) NOT NULL,
    `nama` VARCHAR(200) NOT NULL,
    `alamat` VARCHAR(200) NULL,
    `telp` VARCHAR(30) NULL,
    `tgllahir` DATE NULL,

    PRIMARY KEY (`norm`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dokter` (
    `kodedokter` VARCHAR(50) NOT NULL,
    `namadokter` VARCHAR(40) NOT NULL,
    `spesialisasi` VARCHAR(30) NULL,
    `aktif` TINYINT NOT NULL,

    PRIMARY KEY (`kodedokter`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pendaftaran` (
    `noindex` INTEGER NOT NULL AUTO_INCREMENT,
    `tiketreg` VARCHAR(50) NOT NULL,
    `noantripoli` INTEGER NOT NULL,
    `tanggalberobat` DATE NOT NULL,
    `norm` VARCHAR(50) NULL,
    `poli` VARCHAR(20) NULL,
    `dokter` VARCHAR(50) NULL,
    `jamdatang` VARCHAR(50) NULL,
    `jenisantrian` VARCHAR(50) NULL,
    `status_pendaftaran` VARCHAR(30) NOT NULL,

    INDEX `Pendaftaran_tanggalberobat_poli_noantripoli_idx`(`tanggalberobat`, `poli`, `noantripoli`),
    INDEX `Pendaftaran_tanggalberobat_poli_status_pendaftaran_idx`(`tanggalberobat`, `poli`, `status_pendaftaran`),
    INDEX `Pendaftaran_norm_idx`(`norm`),
    INDEX `Pendaftaran_dokter_idx`(`dokter`),
    UNIQUE INDEX `Pendaftaran_tiketreg_tanggalberobat_key`(`tiketreg`, `tanggalberobat`),
    PRIMARY KEY (`noindex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task_Antrian` (
    `kodebooking` VARCHAR(50) NOT NULL,
    `tanggal` DATE NOT NULL,
    `task1` DATETIME(3) NULL,
    `task2` DATETIME(3) NULL,
    `task3` DATETIME(3) NULL,
    `task4` DATETIME(3) NULL,
    `task5` DATETIME(3) NULL,
    `task6` DATETIME(3) NULL,
    `task7` DATETIME(3) NULL,

    PRIMARY KEY (`kodebooking`, `tanggal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_norm_fkey` FOREIGN KEY (`norm`) REFERENCES `Pasien`(`norm`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_poli_fkey` FOREIGN KEY (`poli`) REFERENCES `Poli`(`kode_poli`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_dokter_fkey` FOREIGN KEY (`dokter`) REFERENCES `Dokter`(`kodedokter`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Task_Antrian` ADD CONSTRAINT `Task_Antrian_kodebooking_tanggal_fkey` FOREIGN KEY (`kodebooking`, `tanggal`) REFERENCES `Pendaftaran`(`tiketreg`, `tanggalberobat`) ON DELETE CASCADE ON UPDATE CASCADE;
