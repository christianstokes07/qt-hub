"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import internshipsData from "@/data/internships.json";
import scholarshipsData from "@/data/scholarships.json";

const POPPINS = { fontFamily: "'Poppins', sans-serif", fontWeight: 700 };
const DM      = { fontFamily: "'DM Sans', sans-serif" };

type Profile = {
  major: string | null;
  year: string | null;
  location_preference: string | null;
  gpa: string | null;
};

type Internship = {
  id: number;
  title: string;
  company: string;
  location: string;
  major: string[];
  year: string[];
  description: string;
  link: string;
  states?: string[];
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

const LOCATION_STATE_MAP: Record<string, string[]> = {
  "Washington DC / MD / VA": ["DC", "MD", "VA"],
  "New York": ["NY"],
  "California": ["CA"],
  "Texas": ["TX"],
  "Remote": ["Remote"],
  "Nationwide": [],
  "No preference": [],
};

const GPA_MIN: Record<string, number> = {
  "3.5+": 3.5,
  "3.0–3.49": 3.0,
  "2.75–2.99": 2.75,
  "2.5–2.74": 2.5,
  "Below 2.5": 0,
};

function SaveButton({ itemId, itemType, title, companyOrOrg, link, deadline }: {
  itemId: string;
  itemType: "internship" | "scholarship";
  title: string;
  companyOrOrg: string;
  link: string;
  deadline?: string;
}) {
  const { user, isSignedIn } = useUser();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    supabase.from("favorites").select("id")
      .eq("user_id", user.id).eq("item_id", itemId).eq("item_type", itemType)
      .maybeSingle().then(({ data }) => setSaved(!!data));
  }, [isSignedIn, user, itemId, itemType]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSignedIn || !user) return;
    if (saved) {
      await supabase.from("favorites").delete()
        .eq("user_id", user.id).eq("item_id", itemId).eq("item_type", itemType);
      setSaved(false);
    } else {
      await supabase.from("favorites").insert({
        user_id: user.id, item_id: itemId, item_type: itemType,
        title, company_or_org: companyOrOrg, link, deadline: deadline || "Rolling",
      });
      setSaved(true);
    }
  };

  return (
    <button onClick={toggle} className={`p-1.5 rounded-full transition-all duration-200 ${saved ? "text-pink-500" : "text-gray-300 hover:text-pink-400"}`}>
      <svg className="w-5 h-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}

export default function ForYouPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) { setLoading(false); return; }
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { setProfile(data); setLoading(false); });
  }, [isLoaded, isSignedIn, user]);

  // Match internships
  const matchedInternships = (internshipsData as Internship[]).filter((job) => {
    if (!profile) return false;
    const majorMatch = !profile.major || job.major.includes(profile.major) || job.major.includes("All Majors");
    const yearMatch = !profile.year || job.year.includes(profile.year);
    const locationMatch = !profile.location_preference ||
      profile.location_preference === "No preference" ||
      profile.location_preference === "Nationwide" ||
      (() => {
        const states = LOCATION_STATE_MAP[profile.location_preference] || [];
        return states.length === 0 || states.some((s) => job.states?.includes(s)) ||
          job.location.toLowerCase().includes("remote");
      })();
    return majorMatch && yearMatch && locationMatch;
  }).slice(0, 12);

  // Match scholarships
  const matchedScholarships = (scholarshipsData as Scholarship[]).filter((s) => {
    if (!profile) return false;
    const majorMatch = !profile.major || s.major.includes("All Majors") || s.major.includes(profile.major);
    const yearMatch = !profile.year || s.year.includes(profile.year);
    const gpaMatch = !profile.gpa || (() => {
      if (s.gpa === "None stated") return true;
      const userMin = GPA_MIN[profile.gpa] ?? 0;
      const reqGpa = parseFloat(s.gpa);
      return isNaN(reqGpa) || userMin >= reqGpa;
    })();
    return majorMatch && yearMatch && gpaMatch;
  }).slice(0, 9);

  const hasProfile = profile?.major || profile?.year;

  return (
    <main className="min-h-screen bg-gray-50" style={DM}>
      <Navbar />

      <section className="bg-white border-b border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-pink-500 font-medium text-sm uppercase tracking-widest mb-1">Personalized</p>
            <h1 className="text-3xl md:text-4xl text-gray-900 mb-2" style={POPPINS}>
              For You{user?.firstName ? `, ${user.firstName}` : ""}
            </h1>
            <p className="text-gray-500">Matches based on your major, class year, GPA, and location preference.</p>
          </div>
          <Link href="/profile" className="hidden md:block text-sm text-pink-500 hover:text-pink-700 font-medium border border-pink-200 px-4 py-2 rounded-full transition-colors">
            Edit Profile →
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-14">

        {!isLoaded || loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-400 rounded-full animate-spin" />
          </div>
        ) : !isSignedIn ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔒</p>
            <p className="text-xl font-semibold text-gray-700 mb-2">Sign in to see your matches</p>
            <Link href="/sign-in" className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-8 py-4 rounded-full transition-colors">Sign In</Link>
          </div>
        ) : !hasProfile ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">✨</p>
            <p className="text-xl font-semibold text-gray-700 mb-2">Set up your profile to get matches</p>
            <p className="text-gray-400 mb-6">Tell us your major, class year, GPA, and location preference.</p>
            <Link href="/profile" className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-8 py-4 rounded-full transition-colors">
              Complete Profile →
            </Link>
          </div>
        ) : (
          <>
            {/* Profile summary */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 flex flex-wrap gap-3">
              {profile.major && <span className="text-sm bg-white text-pink-600 px-3 py-1.5 rounded-full border border-pink-100 font-medium">📚 {profile.major}</span>}
              {profile.year && <span className="text-sm bg-white text-pink-600 px-3 py-1.5 rounded-full border border-pink-100 font-medium">🎓 {profile.year}</span>}
              {profile.gpa && <span className="text-sm bg-white text-pink-600 px-3 py-1.5 rounded-full border border-pink-100 font-medium">📊 GPA {profile.gpa}</span>}
              {profile.location_preference && profile.location_preference !== "No preference" && (
                <span className="text-sm bg-white text-pink-600 px-3 py-1.5 rounded-full border border-pink-100 font-medium">📍 {profile.location_preference}</span>
              )}
              <Link href="/profile" className="text-sm text-gray-400 hover:text-pink-500 px-3 py-1.5 rounded-full border border-gray-200 font-medium transition-colors">Edit →</Link>
            </div>

            {/* Matched Internships */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl">⭐</span>
                <h2 className="text-xl font-bold text-gray-900" style={POPPINS}>Matched Internships</h2>
                <span className="text-sm text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{matchedInternships.length} matches</span>
              </div>
              {matchedInternships.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-400">No internship matches yet — try updating your profile.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedInternships.map((job) => (
                    <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
                      <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-400 font-bold text-sm shrink-0">
                              {job.company.charAt(0)}
                            </div>
                            <p className="text-pink-500 font-semibold text-sm">{job.company}</p>
                          </div>
                          <SaveButton itemId={String(job.id)} itemType="internship" title={job.title} companyOrOrg={job.company} link={job.link} />
                        </div>
                        <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug line-clamp-2">{job.title}</h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{job.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </span>
                          {job.year.map((y) => (
                            <span key={y} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{y}</span>
                          ))}
                        </div>
                      </div>
                      <div className="px-6 pb-6">
                        <a href={job.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 rounded-xl transition-colors duration-200">
                          Apply Now →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Matched Scholarships */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl">🏆</span>
                <h2 className="text-xl font-bold text-gray-900" style={POPPINS}>Matched Scholarships</h2>
                <span className="text-sm text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{matchedScholarships.length} matches</span>
              </div>
              {matchedScholarships.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-400">No scholarship matches yet — try updating your profile.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedScholarships.map((s) => (
                    <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
                      <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-pink-500 font-semibold text-sm leading-tight">{s.organization}</p>
                          <SaveButton itemId={String(s.id)} itemType="scholarship" title={s.name} companyOrOrg={s.organization} link={s.link} deadline={s.deadline} />
                        </div>
                        <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug" style={POPPINS}>{s.name}</h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{s.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 font-semibold">
                            💰 {s.amount}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                            📅 {s.deadline}
                          </span>
                          {s.gpa && s.gpa !== "None stated" && (
                            <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100 font-medium">
                              GPA {s.gpa}+
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="px-6 pb-6">
                        <a href={s.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 rounded-xl transition-colors duration-200">
                          Apply Now →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <footer className="border-t border-gray-100 py-8 px-6 bg-white mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <Link href="/">
            <Image src="/QTlogo.png" alt="QT Hub" width={80} height={28} className="object-contain" />
          </Link>
          <div className="flex gap-6">
            <Link href="/internships" className="hover:text-pink-400 transition-colors">Internships</Link>
            <Link href="/scholarships" className="hover:text-pink-400 transition-colors">Scholarships</Link>
            <Link href="/resources" className="hover:text-pink-400 transition-colors">Resources</Link>
            <Link href="/about" className="hover:text-pink-400 transition-colors">About</Link>
          </div>
          <p>© 2025 QT Hub · Made for Hampton University</p>
        </div>
      </footer>
    </main>
  );
}