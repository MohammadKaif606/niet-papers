"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { BRANCHES } from "@/lib/config";

export default function Shell({ children }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <>
      <header className="top">
        <Link href="/" className="brand">NIET Papers</Link>
        <span className="who">B.Tech</span>
      </header>
      <nav className="navbar">
        <Link href="/" className={path === "/" ? "on" : ""}>Dashboard</Link>
        <div className="dd" ref={ref}>
          <button className={path.startsWith("/b") ? "on" : ""} onClick={() => setOpen(!open)}>
            Branches <ChevronDown size={16} />
          </button>
          {open && (
            <div className="ddmenu">
              {BRANCHES.map((b) => (
                <Link key={b.key} href={`/b/${b.key}`}>{b.label}</Link>
              ))}
            </div>
          )}
        </div>
        <Link href="/admin" className={path.startsWith("/admin") ? "on" : ""}>Admin</Link>
      </nav>
      <div className="wrap"><main>{children}</main></div>
    </>
  );
}
