"use client";

import { useEffect, useState } from "react";

/**
 * Waktu sekarang yang diperbarui setiap `intervalMs`.
 * Bernilai null sampai komponen tampil di browser, supaya jam server dan browser tidak bentrok.
 */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
