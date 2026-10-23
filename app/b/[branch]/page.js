import Link from "next/link";
import { TYPES, branchLabel } from "@/lib/config";
import Crumbs from "@/components/Crumbs";

export default function BranchPage({ params }) {
  const { branch } = params;
  return (
    <>
      <Crumbs items={[{ label: "Home", href: "/" }, { label: branch }]} />
      <div className="panel">
        <div className="phead">{branchLabel(branch)}</div>
        <div className="tiles">
          {TYPES.map((t) => (
            <Link key={t.key} href={`/b/${branch}/${t.key}`} className="tile" style={{ "--c": t.color }}>
              <b>{t.label}</b>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
