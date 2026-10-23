import { fileUrl } from "./supabase";

const ext = (p) => (p.split(".").pop() || "file").toLowerCase();
const clean = (s) => s.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "_");
export const niceName = (r) => `${clean(r.title)}.${ext(r.file_path)}`;

export async function saveOne(r) {
  try {
    const res = await fetch(fileUrl(r.file_path));
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = niceName(r);
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  } catch {
    window.open(fileUrl(r.file_path), "_blank");
  }
}

export async function saveAll(rows, zipName) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const used = {};
  for (const r of rows) {
    const blob = await (await fetch(fileUrl(r.file_path))).blob();
    let n = niceName(r);
    used[n] = (used[n] || 0) + 1;
    if (used[n] > 1) n = `${used[n]}_${n}`;
    zip.file(n, blob);
  }
  const out = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(out);
  a.download = `${clean(zipName) || "papers"}.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}
