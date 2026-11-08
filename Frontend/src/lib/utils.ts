/** Menggabungkan beberapa class Tailwind dan mengabaikan nilai kosong. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
