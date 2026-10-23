"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { subjectLabel, typeLabel } from "@/lib/config";
import { saveAll } from "@/lib/download";
import Crumbs from "@/components/Crumbs";
import FileRow from "@/components/FileRow";

export default function FilesPage({ params }) {
  const { branch, type } = params;
  const sem = Number(params.sem);
  const subject = decodeURIComponent(params.subject);
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("papers").select("*").eq("branch", branch).eq("type", type)
      .eq("semester", sem).eq("subject", subject)
      .order("year", { ascending: false }).order("created_at", { ascending: true })
      .then(({ data, error }) => (error ? setErr(error.message) : setRows(data)));
  }, [branch, type, sem, subject]);

  const groups = [];
  (rows || []).forEach((r) => {
    const g = r.year || "Other";
    let x = groups.find((y) => y.g === g);
    if (!x) groups.push((x = { g, items: [] }));
    x.items.push(r);
  });

  const downloadAll = async () => {
    setBusy(true);
    try { await saveAll(rows, `${subject}_${typeLabel(type)}`); } finally { setBusy(false); }
  };

  return (
    <>
      <Crumbs items={[
        { label: "Home", href: "/" },
        { label: branch, href: `/b/${branch}` },
        { label: typeLabel(type), href: `/b/${branch}/${type}` },
        { label: `Sem ${sem}`, href: `/b/${branch}/${type}/${sem}` },
        { label: subject },
      ]} />
      <div className="panel">
        <div className="phead">{subjectLabel(branch, sem, subject)}</div>
        <div className="bar">
          <button className="btn" disabled={!rows?.length || busy} onClick={downloadAll}>
            {busy ? "Preparing zip..." : `Download all (${rows?.length || 0})`}
          </button>
        </div>
        {err && <p className="pad err">{err}</p>}
        {rows === null && !err && <p className="pad muted">Loading...</p>}
        {rows && rows.length === 0 && <p className="pad muted">Abhi kuch upload nahi hua.</p>}
        {groups.map((x) => (
          <div key={x.g}>
            <div className="group">{x.g}</div>
            {x.items.map((r) => <FileRow key={r.id} r={r} />)}
          </div>
        ))}
      </div>
    </>
  );
}
