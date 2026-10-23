import Link from "next/link";
import { SEMESTERS, SUBJECTS, typeLabel } from "@/lib/config";
import Crumbs from "@/components/Crumbs";

export default function SemPage({ params }) {
  const { branch, type } = params;
  return (
    <>
      <Crumbs items={[{ label: "Home", href: "/" }, { label: branch, href: `/b/${branch}` }, { label: typeLabel(type) }]} />
      <div className="panel">
        <div className="phead">{typeLabel(type)} - Select semester</div>
        <div className="tiles">
          {SEMESTERS.map((s) => {
            const n = SUBJECTS[branch]?.[s]?.length || 0;
            return (
              <Link key={s} href={`/b/${branch}/${type}/${s}`} className="tile">
                <span><b>Semester {s}</b><small>{n ? `${n} subjects` : "Syllabus coming soon"}</small></span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
