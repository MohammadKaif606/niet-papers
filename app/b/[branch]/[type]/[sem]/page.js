"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SUBJECTS, typeLabel } from "@/lib/config";
import Crumbs from "@/components/Crumbs";

export default function SubjectsPage({ params }) {
  const { branch, type } = params;
  const sem = Number(params.sem);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    supabase.from("papers").select("subject").eq("branch", branch).eq("type", type).eq("semester", sem)
      .then(({ data }) => {
        const c = {};
        (data || []).forEach((r) => (c[r.subject] = (c[r.subject] || 0) + 1));
        setCounts(c);
      });
  }, [branch, type, sem]);

  const list = [...(SUBJECTS[branch]?.[sem] || [])];
  Object.keys(counts).forEach((code) => {
    if (!list.find((s) => s.code === code)) list.push({ code, name: "" });
  });

  return (
    <>
      <Crumbs items={[
        { label: "Home", href: "/" },
        { label: branch, href: `/b/${branch}` },
        { label: typeLabel(type), href: `/b/${branch}/${type}` },
        { label: `Sem ${sem}` },
      ]} />
      <div className="panel">
        <div className="phead">{typeLabel(type)} - Semester {sem} - Select subject</div>
        {list.length === 0 && <p className="pad muted">Is semester ka syllabus abhi add nahi hua.</p>}
        <div className="tiles">
          {list.map((s) => (
            <Link key={s.code} href={`/b/${branch}/${type}/${sem}/${encodeURIComponent(s.code)}`} className="tile">
              <span><b>{s.code}</b>{s.name}<small style={{ display: "block" }}>{counts[s.code] || 0} files</small></span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
