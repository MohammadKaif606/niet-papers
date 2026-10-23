import Link from "next/link";

export default function Crumbs({ items }) {
  return (
    <div className="crumbs">
      {items.map((c, i) => (
        <span key={i}>
          {c.href ? <Link href={c.href}>{c.label}</Link> : <b>{c.label}</b>}
          {i < items.length - 1 ? " / " : ""}
        </span>
      ))}
    </div>
  );
}
