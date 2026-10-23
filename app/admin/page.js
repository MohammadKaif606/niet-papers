"use client";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabase";
import { TYPES, SEMESTERS, BRANCHES, SUBJECTS } from "@/lib/config";
import FileRow from "@/components/FileRow";

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Admin() {
  const [user, setUser] = useState(undefined);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ branch: BRANCHES[0].key, semester: 3, subject: "", type: "sessional", year: "", title: "" });
  const [files, setFiles] = useState([]);

  const load = () =>
    supabase.from("papers").select("*").order("created_at", { ascending: false }).limit(30)
      .then(({ data }) => setRows(data || []));

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null));
    return () => sub.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (user) load(); }, [user]);

  const login = async (e) => {
    e.preventDefault();
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) setMsg(error.message);
  };

  const upload = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!files.length) return setMsg("Select at least one file.");
    if (!f.subject) return setMsg("Select subject.");
    setBusy(true);
    try {
      for (let i = 0; i < files.length; i++) {
        setMsg(`Uploading ${i + 1} of ${files.length}...`);
        let file = files[i];
        const isImg = file.type.startsWith("image/");
        if (isImg) {
          file = await imageCompression(file, { maxSizeMB: 0.4, maxWidthOrHeight: 1800, useWebWorker: true });
        }
        const ext = (files[i].name.split(".").pop() || "bin").toLowerCase();
        const path = `${f.branch}/${f.type}/sem${f.semester}/${slug(f.subject)}/${Date.now()}-${i}.${ext}`;
        const up = await supabase.storage.from("papers").upload(path, file, { contentType: files[i].type });
        if (up.error) throw up.error;
        const title = files.length > 1 ? `${f.title} - page ${i + 1}` : f.title;
        const ins = await supabase.from("papers").insert({
          branch: f.branch, semester: Number(f.semester), subject: f.subject.trim(), type: f.type,
          year: f.year.trim() || null, title, file_path: path, file_type: isImg ? "image" : "pdf",
        });
        if (ins.error) throw ins.error;
      }
      setMsg("Uploaded.");
      setFiles([]);
      form.reset();
      load();
    } catch (err) {
      setMsg("Upload failed: " + err.message);
    } finally {
      setBusy(false);
    }
  };

  const del = async (r) => {
    if (!confirm(`Delete "${r.title}"?`)) return;
    await supabase.storage.from("papers").remove([r.file_path]);
    await supabase.from("papers").delete().eq("id", r.id);
    load();
  };

  if (user === undefined) return <p className="muted">Loading...</p>;

  if (!user)
    return (
      <div className="panel">
        <div className="phead">Admin login</div>
        <form className="form pad" onSubmit={login}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} required />
          <button className="btn">Log in</button>
          {msg && <p className="err">{msg}</p>}
        </form>
      </div>
    );

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value, ...(k === "semester" || k === "branch" ? { subject: "" } : {}) });
  const list = SUBJECTS[f.branch]?.[Number(f.semester)] || [];

  return (
    <>
      <div className="panel">
        <div className="phead">
          Upload files
          <button className="link" onClick={() => supabase.auth.signOut()}>Log out</button>
        </div>
        <form className="form pad" onSubmit={upload}>
          <div className="two">
            <select value={f.branch} onChange={set("branch")}>
              {BRANCHES.map((b) => <option key={b.key} value={b.key}>{b.label}</option>)}
            </select>
            <select value={f.semester} onChange={set("semester")}>
              {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <select value={f.type} onChange={set("type")}>
            {TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
          {list.length ? (
            <select value={f.subject} onChange={set("subject")} required>
              <option value="">Select subject</option>
              {list.map((s) => <option key={s.code} value={s.code}>{s.code} - {s.name}</option>)}
            </select>
          ) : (
            <input placeholder="Subject code (syllabus abhi add nahi hua)" value={f.subject} onChange={set("subject")} required />
          )}
          <div className="two">
            <input placeholder="Folder name (e.g. Sessional 1 or 2025)" value={f.year} onChange={set("year")} />
            <input placeholder="Title" value={f.title} onChange={set("title")} required />
          </div>
          <input type="file" multiple accept="image/*,application/pdf" onChange={(e) => setFiles([...e.target.files])} />
          <p className="muted small">Photos are compressed automatically. Many photos with one title become "page 1, page 2...".</p>
          <button className="btn" disabled={busy}>{busy ? "Uploading..." : "Upload"}</button>
          {msg && <p className={msg.startsWith("Upload failed") ? "err" : "muted"}>{msg}</p>}
        </form>
      </div>
      <div className="panel">
        <div className="phead">Recent uploads</div>
        {rows.map((r) => (
          <FileRow key={r.id} r={r} extra={
            <button className="ib del" onClick={() => del(r)} title="Delete"><Trash2 size={18} /></button>
          } />
        ))}
      </div>
    </>
  );
}
