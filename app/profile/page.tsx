"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser, useAuth } from "@clerk/nextjs";
import { getAuthenticatedSupabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
export const dynamic = "force-dynamic";

const POPPINS = { fontFamily: "'Poppins', sans-serif", fontWeight: 700 };
const DM      = { fontFamily: "'DM Sans', sans-serif" };

const MAJORS = [
  "Select your major",
  "Accounting", "Accounting and Finance", "Banking and Financial Support Services",
  "Business Administration", "Business/Managerial Economics", "Economics", "Finance",
  "Human Resources Management", "Management Information Systems", "Marketing",
  "MBA / Business", "Sales and Marketing Operations",
  "Biochemistry", "Biology", "Chemical Engineering", "Chemistry", "Computer Engineering",
  "Computer Science", "Computer and Information Sciences", "Engineering", "Information Science",
  "Kinesiology and Exercise Science", "Marine Biology", "Mathematics", "Physics",
  "Broadcast Journalism", "English", "General Studies", "History", "Journalism",
  "Liberal Arts", "Organizational Communication", "Philosophy and Religious Studies",
  "Public Relations", "Religion", "Spanish",
  "Nursing", "Speech-Language Pathology",
  "Psychology", "Sociology", "Sociology and Anthropology",
  "Criminal Justice", "Cyber/Computer Forensics", "International Relations",
  "Legal Studies / Paralegal", "Political Science", "Public Administration", "Social Work",
  "Early Childhood Education", "Elementary Education", "Music Teacher Education", "Physical Education",
  "Art / Art Studies", "Digital Arts", "Drama and Theatre Arts", "Music", "Music Management", "Music Technology",
  "Air Traffic Control", "Aviation", "Hotel / Hospitality Management", "Parks and Recreation", "Sport and Fitness Management",
];

const YEARS = ["Select your class year", "Sophomore", "Junior"];
const LOCATIONS = [
  "No preference", "Remote", "Nationwide",
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "Washington DC", "West Virginia", "Wisconsin", "Wyoming",
];
const GPAS = ["Select your GPA range", "3.5+", "3.0–3.49", "2.75–2.99", "2.5–2.74", "Below 2.5"];

export default function ProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [major, setMajor]           = useState("Select your major");
  const [year, setYear]             = useState("Select your class year");
  const [locations, setLocations]   = useState<string[]>([]);
  const [gpa, setGpa]               = useState("Select your GPA range");
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [loaded, setLoaded]         = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const fetchProfile = async () => {
      const supabase = await getAuthenticatedSupabase(() => getToken({ template: "supabase" }));
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setMajor(data.major || "Select your major");
        setYear(data.year || "Select your class year");
        // Fix: split the comma-separated string back into an array
        setLocations(data.location_preference ? data.location_preference.split(",") : []);
        setGpa(data.gpa || "Select your GPA range");
      }
      setLoaded(true);
    };
    fetchProfile();
  }, [isLoaded, isSignedIn, user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const supabase = await getAuthenticatedSupabase(() => getToken({ template: "supabase" }));
    await supabase.from("profiles").upsert({
      user_id: user.id,
      major: major === "Select your major" ? null : major,
      year: year === "Select your class year" ? null : year,
      location_preference: locations.length > 0 ? locations.join(", ") : null,
      gpa: gpa === "Select your GPA range" ? null : gpa,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isLoaded || !loaded) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center" style={DM}>
        <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-400 rounded-full animate-spin" />
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6" style={DM}>
        <p className="text-2xl font-bold text-gray-900 mb-4" style={POPPINS}>Sign in to view your profile</p>
        <Link href="/sign-in" className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-8 py-4 rounded-full transition-colors">
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50" style={DM}>
      <Navbar />

      <section className="bg-white border-b border-gray-100 py-10 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-pink-500 font-medium text-sm uppercase tracking-widest mb-2">Your Profile</p>
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-2" style={POPPINS}>Personalize Your Experience</h1>
          <p className="text-gray-500">Tell us about yourself so we can match you with the best internships and scholarships.</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

        {/* Account info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4" style={POPPINS}>Account</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-lg" style={POPPINS}>
              {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-500">{user.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>
        </div>

        {/* Academic info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-900" style={POPPINS}>Academic Info</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Major</label>
            <select value={major} onChange={(e) => setMajor(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer hover:border-pink-300 transition-colors">
              {MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Class Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer hover:border-pink-300 transition-colors">
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">GPA</label>
            <select value={gpa} onChange={(e) => setGpa(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer hover:border-pink-300 transition-colors">
              {GPAS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Location Preference</label>
            <p className="text-xs text-gray-400">Select all that apply</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {LOCATIONS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocations((prev) =>
                    prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
                  )}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    locations.includes(l)
                      ? "bg-pink-400 text-white border-pink-400"
                      : "bg-white text-gray-600 border-gray-200 hover:border-pink-300"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className={`w-full font-semibold py-4 rounded-full transition-all duration-200 ${
            saved ? "bg-green-400 text-white" : "bg-pink-400 hover:bg-pink-500 text-white shadow-md hover:shadow-lg"
          }`}>
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Profile"}
        </button>

        <div className="text-center">
          <Link href="/for-you" className="text-pink-500 hover:text-pink-700 font-medium text-sm transition-colors">
            View your personalized matches →
          </Link>
        </div>
      </div>

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