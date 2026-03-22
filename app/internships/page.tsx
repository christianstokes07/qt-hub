"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import featuredData from "@/data/internships.json";
import Navbar from "@/components/Navbar";

const POPPINS = { fontFamily: "'Poppins', sans-serif", fontWeight: 700 };
const DM      = { fontFamily: "'DM Sans', sans-serif" };

const MAJORS = [
  "All Majors",
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

const LOCATION_TYPES = ["All Locations", "Remote", "Hybrid", "On-site"];

const MAJOR_KEYWORDS: Record<string, string> = {
  "All Majors": "internship",
  "MBA / Business": "MBA business strategy internship",
  "Accounting": "accounting internship",
  "Accounting and Finance": "accounting finance internship",
  "Banking and Financial Support Services": "banking finance internship",
  "Business Administration": "business administration internship",
  "Business/Managerial Economics": "economics business internship",
  "Economics": "economics internship",
  "Finance": "finance internship",
  "Human Resources Management": "human resources HR internship",
  "Management Information Systems": "MIS information systems internship",
  "Marketing": "marketing internship",
  "Sales and Marketing Operations": "sales marketing internship",
  "Biochemistry": "biochemistry research internship",
  "Biology": "biology research internship",
  "Chemical Engineering": "chemical engineering internship",
  "Chemistry": "chemistry research internship",
  "Computer Engineering": "computer engineering internship",
  "Computer Science": "software engineering internship",
  "Computer and Information Sciences": "computer science IT internship",
  "Engineering": "engineering internship",
  "Information Science": "information technology IT internship",
  "Kinesiology and Exercise Science": "kinesiology sports health internship",
  "Marine Biology": "marine biology environmental internship",
  "Mathematics": "mathematics data analyst internship",
  "Physics": "physics research engineering internship",
  "Broadcast Journalism": "broadcast journalism media internship",
  "English": "communications writing editorial internship",
  "General Studies": "general business internship",
  "History": "museum archive research internship",
  "Journalism": "journalism media internship",
  "Liberal Arts": "communications public relations internship",
  "Organizational Communication": "communications corporate internship",
  "Philosophy and Religious Studies": "nonprofit public service internship",
  "Public Relations": "public relations communications internship",
  "Religion": "nonprofit ministry internship",
  "Spanish": "bilingual communications marketing internship",
  "Nursing": "nursing healthcare clinical internship",
  "Speech-Language Pathology": "speech language pathology internship",
  "Psychology": "psychology research internship",
  "Sociology": "social services nonprofit internship",
  "Sociology and Anthropology": "social research nonprofit internship",
  "Criminal Justice": "criminal justice law enforcement internship",
  "Cyber/Computer Forensics": "cybersecurity forensics internship",
  "International Relations": "international relations policy internship",
  "Legal Studies / Paralegal": "legal paralegal law internship",
  "Political Science": "political science policy government internship",
  "Public Administration": "public administration government internship",
  "Social Work": "social work nonprofit internship",
  "Early Childhood Education": "education teaching internship",
  "Elementary Education": "education teaching internship",
  "Music Teacher Education": "music education teaching internship",
  "Physical Education": "physical education sports internship",
  "Art / Art Studies": "art design creative internship",
  "Digital Arts": "digital arts graphic design internship",
  "Drama and Theatre Arts": "theatre arts entertainment internship",
  "Music": "music entertainment internship",
  "Music Management": "music industry management internship",
  "Music Technology": "music technology production internship",
  "Air Traffic Control": "aviation air traffic FAA internship",
  "Aviation": "aviation airline internship",
  "Hotel / Hospitality Management": "hotel hospitality internship",
  "Parks and Recreation": "parks recreation management internship",
  "Sport and Fitness Management": "sports management fitness internship",
};

type Featured = {
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

type LiveJob = {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  redirect_url: string;
  created: string;
  salary_min?: number;
  salary_max?: number;
};

const STATE_ALIASES: Record<string, string> = {
  "virginia": "VA", "va": "VA",
  "maryland": "MD", "md": "MD",
  "dc": "DC", "washington dc": "DC", "district of columbia": "DC",
  "new york": "NY", "ny": "NY", "nyc": "NY",
  "california": "CA", "ca": "CA",
  "texas": "TX", "tx": "TX",
  "washington": "WA", "wa": "WA",
  "illinois": "IL", "il": "IL", "chicago": "IL",
  "georgia": "GA", "ga": "GA", "atlanta": "GA",
  "massachusetts": "MA", "ma": "MA", "boston": "MA",
  "florida": "FL", "fl": "FL",
  "north carolina": "NC", "nc": "NC",
  "oregon": "OR", "or": "OR",
  "remote": "Remote",
  "mclean": "VA", "reston": "VA", "arlington": "VA", "fairfax": "VA",
  "falls church": "VA", "herndon": "VA", "tysons": "VA",
  "baltimore": "MD", "bethesda": "MD", "rockville": "MD",
  "silver spring": "MD", "columbia": "MD", "annapolis": "MD",
  "fort meade": "MD", "landover": "MD",
};

export default function InternshipsPage() {
  const [search, setSearch]                 = useState("");
  const [major, setMajor]                   = useState("All Majors");
  const [locationType, setLocationType]     = useState("All Locations");
  const [locationSearch, setLocationSearch] = useState("");
  const [liveJobs, setLiveJobs]             = useState<LiveJob[]>([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [searched, setSearched]             = useState(false);

  const filteredFeatured = (featuredData as Featured[])
    .filter((job) => {
      const majorMatch = major === "All Majors" || job.major.includes(major);
      const searchMatch =
        search === "" ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase());
      const locationTypeMatch =
        locationType === "All Locations" ||
        job.location.toLowerCase().includes(locationType.toLowerCase());
      const locLower = locationSearch.toLowerCase().trim();
      const stateCode = STATE_ALIASES[locLower];
      const locationSearchMatch =
        locationSearch === "" ||
        job.location.toLowerCase().includes(locLower) ||
        (stateCode && job.states?.includes(stateCode)) ||
        job.states?.some((s) => s.toLowerCase().includes(locLower));
      return majorMatch && searchMatch && locationTypeMatch && locationSearchMatch;
    })
    .slice(0, major === "All Majors" && search === "" && locationType === "All Locations" && locationSearch === "" ? 12 : undefined);

  const displayedLiveJobs = locationSearch.trim()
    ? liveJobs.filter((job) =>
        job.location?.display_name?.toLowerCase().includes(locationSearch.toLowerCase().trim())
      )
    : liveJobs;

  const fetchLiveJobs = useCallback(async (query: string) => {
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const keyword = MAJOR_KEYWORDS[major] || "internship";
      const locationTypeSuffix = locationType !== "All Locations" ? ` ${locationType}` : "";
      const fullQuery = query
        ? `${query} internship${locationTypeSuffix}`
        : `${keyword}${locationTypeSuffix}`;
      const res = await fetch(
        `/api/jobs?query=${encodeURIComponent(fullQuery)}${locationSearch ? `&location=${encodeURIComponent(locationSearch)}` : ""}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLiveJobs(data.results || []);
    } catch (err) {
      setError("Could not load live listings right now.");
      setLiveJobs([]);
    } finally {
      setLoading(false);
    }
  }, [major, locationType, locationSearch]);

  useEffect(() => {
    if (searched) fetchLiveJobs(search);
  }, [major, locationType]);

  useEffect(() => {
    fetchLiveJobs("");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLiveJobs(search);
  };

  const hasActiveFilters = major !== "All Majors" || locationType !== "All Locations" || locationSearch !== "" || search !== "";

  const clearAll = () => {
    setMajor("All Majors");
    setLocationType("All Locations");
    setLocationSearch("");
    setSearch("");
    fetchLiveJobs("");
  };

  const timeAgo = (dateStr: string) => {
    if (!dateStr) return null;
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 30) return `${days} days ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const fmt = (n: number) => n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
    if (min && max && min !== max) return `${fmt(min)} – ${fmt(max)}`;
    return fmt(min || max!);
  };

  return (
    <main className="min-h-screen bg-gray-50" style={DM}>

      <Navbar active="internships" />

      {/* ── Header ── */}
      <section className="bg-white border-b border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-2" style={POPPINS}>Internship Listings</h1>
          <p className="text-gray-500">Curated + live opportunities for Hampton University sophomores and juniors.</p>
        </div>
      </section>

      {/* ── Search + Filters ── */}
      <section className="bg-white border-b border-gray-100 py-5 px-6 sticky top-[69px] z-40 shadow-sm">
        <div className="max-w-6xl mx-auto space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search internships, companies..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 hover:border-pink-300 transition-colors"
              />
            </div>
            <button type="submit" className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap">
              Search
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Major</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer hover:border-pink-300 transition-colors"
              >
                {MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Work Type</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer hover:border-pink-300 transition-colors"
              >
                {LOCATION_TYPES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1 min-w-[180px]">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">City or State</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocationSearch(val);
                    if (val === "") fetchLiveJobs(search);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") fetchLiveJobs(search);
                  }}
                  placeholder="e.g. Virginia, DC, Baltimore..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 hover:border-pink-300 transition-colors"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex items-end pb-0.5">
                <button onClick={clearAll} className="text-sm text-pink-500 hover:text-pink-700 font-medium transition-colors whitespace-nowrap">
                  Clear all ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-14">

        {/* ── Featured Internships ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl">⭐</span>
            <h2 className="text-xl font-bold text-gray-900" style={POPPINS}>Featured Internships</h2>
            <span className="text-sm text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {filteredFeatured.length} listings
            </span>
          </div>

          {filteredFeatured.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-400">No featured internships match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatured.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-400 font-bold text-sm shrink-0">
                        {job.company.charAt(0)}
                      </div>
                      <p className="text-pink-500 font-semibold text-sm">{job.company}</p>
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
                      <span className="text-xs bg-pink-50 text-pink-600 px-2.5 py-1 rounded-full border border-pink-100 font-medium">
                        {job.major[0]}
                      </span>
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

        {/* ── Live Listings ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl">🔴</span>
            <h2 className="text-xl font-bold text-gray-900" style={POPPINS}>Live Listings</h2>
            <span className="text-xs text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full font-medium">Updated live</span>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-400 rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Finding live internships...</p>
            </div>
          )}
          {!loading && error && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-400">{error}</p>
            </div>
          )}
          {!loading && !error && displayedLiveJobs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-400">No live listings found. Try a different search.</p>
            </div>
          )}
          {!loading && !error && displayedLiveJobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedLiveJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-400 font-bold text-sm shrink-0">
                          {job.company?.display_name?.charAt(0) || "?"}
                        </div>
                        <p className="text-pink-500 font-semibold text-sm">{job.company?.display_name}</p>
                      </div>
                      {job.created && (
                        <span className="text-gray-400 text-xs whitespace-nowrap">{timeAgo(job.created)}</span>
                      )}
                    </div>
                    <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug line-clamp-2">{job.title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                      {job.description?.replace(/\n/g, " ").slice(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location?.display_name || "Location not listed"}
                      </span>
                      {formatSalary(job.salary_min, job.salary_max) && (
                        <span className="text-xs text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100 font-medium">
                          {formatSalary(job.salary_min, job.salary_max)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <a href={job.redirect_url} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 rounded-xl transition-colors duration-200">
                      Apply Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Footer ── */}
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