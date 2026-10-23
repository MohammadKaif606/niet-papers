"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { TYPES, BRANCHES } from "@/lib/config";
import FileRow from "@/components/FileRow";

export default function Dashboard() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    supabase.from("papers").select("*").order("created_at", { ascending: false })
      .then(({ data, error }) => (error ? setErr(error.message) : setRows(data)));
  }, []);

  const count = (k) => (rows || []).filter((r) => r.type === k).length;
  const b0 = BRANCHES[0].key;

  return (
    <>
      <div className="cards">
        <div className="stat"><b>{rows ? rows.length : "-"}</b><span style={{ background: "#0f4c9a" }}>Total Files</span></div>
        {TYPES.map((t) => (
          <Link key={t.key} href={`/b/${b0}/${t.key}`} className="stat">
            <b>{rows ? count(t.key) : "-"}</b>
            <span style={{ background: t.color }}>{t.label}</span>
          </Link>
        ))}
      </div>

      <div className="panel">
        <div className="phead">Branch</div>
        <div className="tiles">
          {BRANCHES.map((b) => (
            <Link key={b.key} href={`/b/${b.key}`} className="tile"><b>{b.label}</b></Link>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="phead">Latest Uploads</div>
        {err && <p className="pad err">{err}</p>}
        {rows && rows.length === 0 && <p className="pad muted">No files yet.</p>}
        {(rows || []).slice(0, 8).map((r) => <FileRow key={r.id} r={r} />)}
      </div>
    </>
  );
}
