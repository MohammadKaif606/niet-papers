export const TYPES = [
  { key: "pyq", label: "Previous Year Papers", color: "#8b1a1a" },
  { key: "sessional", label: "Sessional Papers", color: "#a67c2e" },
  { key: "notes", label: "Notes", color: "#3a6ea5" },
  { key: "important", label: "Important Topics", color: "#4a4a8f" },
  { key: "highest_unit", label: "Highest Scoring Units", color: "#0a7a4b" },
  { key: "solution", label: "Solutions", color: "#6b4f2a" },
];
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
export const typeLabel = (k) => TYPES.find((t) => t.key === k)?.label || k;

// Naye branch yahan jodo
export const BRANCHES = [{ key: "ME", label: "Mechanical Engineering (ME)" }];
export const branchLabel = (k) => BRANCHES.find((b) => b.key === k)?.label || k;

// Subjects: SUBJECTS[branch][semester] = [{ code, name }]
export const SUBJECTS = {
  ME: {
    3: [
      { code: "CME0301", name: "Engineering Mechanics & Strength of Materials" },
      { code: "CME0302", name: "Material Science" },
      { code: "CME0303", name: "Manufacturing Science & Technology" },
      { code: "CME0304", name: "Thermodynamics and Heat Transfer" },
      { code: "CNC0302", name: "Environmental Science" },
      { code: "CASL0301", name: "Technical Communication" },
    ],
  },
};
export const subjectName = (branch, sem, code) =>
  SUBJECTS[branch]?.[Number(sem)]?.find((s) => s.code === code)?.name || "";
export const subjectLabel = (branch, sem, code) => {
  const n = subjectName(branch, sem, code);
  return n ? `${code} - ${n}` : code;
};
