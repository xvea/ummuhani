"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hitung mundur dalam detik. Memanggil `onDone` saat mencapai 0.
 * Ubah `resetKey` untuk mengulang hitungan (misalnya saat layar disentuh).
 */
export function useCountdown(seconds: number, onDone: () => void, resetKey: string | number = 0) {
  const [tick, setTick] = useState({ key: resetKey, elapsed: 0 });
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    let elapsed = 0;
    const id = setInterval(() => {
      elapsed += 1;
      setTick({ key: resetKey, elapsed });
      if (elapsed >= seconds) {
        clearInterval(id);
        doneRef.current();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [seconds, resetKey]);

  const elapsed = tick.key === resetKey ? tick.elapsed : 0;
  return Math.max(0, seconds - elapsed);
}
