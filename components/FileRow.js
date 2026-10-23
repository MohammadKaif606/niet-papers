"use client";
import { FileText, Download, Eye } from "lucide-react";
import { fileUrl } from "@/lib/supabase";
import { saveOne } from "@/lib/download";
import { subjectLabel } from "@/lib/config";

export default function FileRow({ r, extra }) {
  const url = fileUrl(r.file_path);
  const img = r.file_type === "image";
  return (
    <div className="row">
      {img ? (
        <a href={url} target="_blank" rel="noreferrer">
          <img src={url} alt={r.title} className="thumb" loading="lazy" />
        </a>
      ) : (
        <div className="pdfico"><FileText size={22} /></div>
      )}
      <div className="rowtxt">
        <b>{r.title}</b>
        <span>
          {r.branch || "ME"} | Sem {r.semester} | {subjectLabel(r.branch || "ME", r.semester, r.subject)}
          {r.year ? ` | ${r.year}` : ""} | {new Date(r.created_at).toLocaleDateString("en-IN")}
        </span>
      </div>
      <div className="acts">
        <a className="ib" href={url} target="_blank" rel="noreferrer" title="Open"><Eye size={18} /></a>
        <button className="ib" onClick={() => saveOne(r)} title="Download"><Download size={18} /></button>
        {extra}
      </div>
    </div>
  );
}
