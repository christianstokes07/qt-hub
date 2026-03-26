"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import scholarshipData from "@/data/scholarships.json";
import Navbar from "@/components/Navbar";
import { useUser, useAuth } from "@clerk/nextjs";
import { getAuthenticatedSupabase } from "@/lib/supabase";

const POPPINS = { fontFamily: "'Poppins', sans-serif", fontWeight: 700 };
const DM      = { fontFamily: "'DM Sans', sans-serif" };

const MAJORS = [
  "All Majors",
  "Accounting", "Accounting and Finance", "Art / Art Studies", "Biochemistry",
  "Biology", "Business Administration", "Chemical Engineering", "Chemistry",
  "Computer Engineering", "Computer Science", "Computer and Information Sciences",
  "Criminal Justice", "Cyber/Computer Forensics", "Digital Arts", "Early Childhood Education",
  "Economics", "Education", "Elementary Education", "Engineering", "Finance", "History",
  "Hotel / Hospitality Management", "Human Resources Management", "Information Science",
  "International Relations", "Journalism", "Broadcast Journalism", "Kinesiology and Exercise Science",
  "Legal Studies / Paralegal", "Management Information Systems", "Marine Biology", "Marketing",
  "Mathematics", "MBA / Business", "Music", "Music Management", "Music Technology", "Nursing",
  "Organizational Communication", "Physical Education", "Physics", "Political Science",
  "Psychology", "Public Administration", "Public Relations", "Social Work", "Sociology",
  "Sport and Fitness Management",
];

const YEARS = ["All Years", "Sophomore", "Junior"];
const GPAS  = ["All GPAs", "3.5+", "3.0–3.49", "2.75–2.99", "2.5–2.74", "Below 2.5"];

const GPA_MIN: Record<string, number> = {
  "3.5+": 3.5, "3.0–3.49": 3.0, "2.75–2.99": 2.75, "2.5–2.74": 2.5, "Below 2.5": 0,
};

type Scholarship = {
  id: number;
  name: string;
  organization: string;
  amount: string;
  deadline: string;
  major: string[];
  year: string[];
  gpa: string;
  description: string;
  link: string;
};

function SaveButton({ itemId, title, companyOrOrg, link, deadline }: {
  itemId: string;
  title: string;
  companyOrOrg: string;
  link: string;
  deadline?: string;
}) {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    const check = async () => {
      const supabase = await getAuthenticatedSupabase(() => getToken({ template: "supabase" }));
      const { data } = await supabase.from("favorites").select("id")
        .eq("user_id", user.id).eq("item_id", itemId).eq("item_type", "scholarship")
        .maybeSingle();
      setSaved(!!data);
    };
    check();
  }, [isSignedIn, user, itemId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSignedIn || !user) { alert("Please sign in to save favorites."); return; }
    setLoading(true);
    const supabase = await getAuthenticatedSupabase(() => getToken({ template: "supabase" }));
    if (saved) {
      await supabase.from("favorites").delete()
        .eq("user_id", user.id).eq("item_id", itemId).eq("item_type", "scholarship");
      setSaved(false);
    } else {
      await supabase.from("favorites").insert({
        user_id: user.id, item_id: itemId, item_type: "scholarship",
        title, company_or_org: companyOrOrg, link, deadline: deadline || "Rolling",
      });
      setSaved(true);
    }
    setLoading(false);
  };

  return (
    <button onClick={toggle} disabled={loading}
      className={`p-1.5 rounded-full transition-all duration-200 ${saved ? "text-pink-500" : "text-gray-300 hover:text-pink-400"}`}
      title={saved ? "Remove from saved" : "Save"}
    >
      <svg className="w-5 h-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}

export default function ScholarshipsPage() {
  const [search, setSearch] = useState("");
  const [major, setMajor]   = useState("All Majors");
  const [year, setYear]     = useState("All Years");
  const [gpa, setGpa]       = useState("All GPAs");

  const filtered = (scholarshipData as Scholarship[]).filter((s) => {
    const majorMatch = major === "All Majors" || s.major.includes("All Majors") || s.major.includes(major);
    const yearMatch = year === "All Years" || s.year.includes(year);
    const gpaMatch = gpa === "All GPAs" || (() => {
      if (s.gpa === "None stated") return true;
      const userMin = GPA_MIN[gpa] ?? 0;
      const reqGpa = parseFloat(s.gpa);
      return isNaN(reqGpa) || userMin >= reqGpa;
    })();
    const searchMatch = search === "" || s.name.toLowerCase().includes(search.toLowerCase()) || s.organization.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    return majorMatch && yearMatch && gpaMatch && searchMatch;
  });

  const isDeadlineSoon = (deadline: string) => {
    if (deadline === "Rolling") return false;
    const parts = deadline.match(/(\w+ \d+, \d+)/);
    if (!parts) return false;
    const d = new Date(parts[1]);
    const diff = d.getTime() - Date.now();
    return diff > 0 && diff < 1000 * 60 * 60 * 24 * 30;
  };

  const hasFilters = major !== "All Majors" || year !== "All Years" || gpa !== "All GPAs" || search !== "";
  const clearAll = () => { setMajor("All Majors"); setYear("All Years"); setGpa("All GPAs"); setSearch(""); };

  return (
    <main className="min-h-screen bg-gray-50" style={DM}>
      <Navbar active="scholarships" />

      <section className="bg-white border-b border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-2" style={POPPINS}>Scholarships</h1>
          <p className="text-gray-500">Curated scholarships for Hampton University sophomores and juniors — filtered by your major.</p>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100 py-5 px-6 sticky top-[69px] z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search scholarships, organizations..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 hover:border-pink-300 transition-colors" />
          </div>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Major</label>
            <select value={major} onChange={(e) => setMajor(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer hover:border-pink-300 transition-colors">
              {MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Class Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer hover:border-pink-300 transition-colors">
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Min GPA</label>
            <select value={gpa} onChange={(e) => setGpa(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer hover:border-pink-300 transition-colors">
              {GPAS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-3 pb-0.5">
            <span className="text-sm text-gray-400 whitespace-nowrap">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            {hasFilters && (
              <button onClick={clearAll} className="text-sm text-pink-500 hover:text-pink-700 font-medium transition-colors whitespace-nowrap">Clear ✕</button>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-gray-700 mb-2">No scholarships found</p>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search term.</p>
            <button onClick={clearAll} className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-6 py-3 rounded-full transition-colors">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <p className="text-pink-500 font-semibold text-sm leading-tight">{s.organization}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      {isDeadlineSoon(s.deadline) && (
                        <span className="text-xs bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">Closing Soon</span>
                      )}
                      <SaveButton itemId={String(s.id)} title={s.name} companyOrOrg={s.organization} link={s.link} deadline={s.deadline} />
                    </div>
                  </div>
                  <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug" style={POPPINS}>{s.name}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{s.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 font-semibold">💰 {s.amount}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">📅 {s.deadline}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {s.gpa && s.gpa !== "None stated" && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100 font-medium">GPA {s.gpa}+</span>
                    )}
                    {s.year.map((y) => <span key={y} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{y}</span>)}
                    <span className="text-xs bg-pink-50 text-pink-600 px-2.5 py-1 rounded-full border border-pink-100 font-medium">
                      {s.major.includes("All Majors") ? "All Majors" : s.major[0]}
                    </span>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <a href={s.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 rounded-xl transition-colors duration-200">Apply Now →</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-gray-100 py-8 pl-9 pr-7 bg-white mt-8">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <Link href="/"><Image src="/QTlogo.png" alt="QT Hub" width={80} height={28} className="object-contain" /></Link>
          <div className="flex gap-6 translate-x-21">
            <Link href="/internships" className="hover:text-pink-400 transition-colors">Internships</Link>
            <Link href="/scholarships" className="hover:text-pink-400 transition-colors">Scholarships</Link>
            <Link href="/resources" className="hover:text-pink-400 transition-colors">Resources</Link>
            <Link href="/about" className="hover:text-pink-400 transition-colors">About</Link>
          </div>
          <p>© 2026 QT Hub · Made for Hampton University</p>
        </div>
      </footer>
    </main>
  );
}