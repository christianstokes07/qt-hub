"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Navbar from "@/components/Navbar";

const ARCHIVO  = { fontFamily: "'Poppins', sans-serif", fontWeight: 700 };
const PLAYFAIR = { fontFamily: "'Playfair Display', serif" };
const DM       = { fontFamily: "'DM Sans', sans-serif" };

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white" style={DM}>

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-36 pb-24 px-6 text-center relative overflow-hidden">
        {/* Skyline photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        {/* Pink gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-pink-900/60 to-white" />

        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-block bg-white/80 backdrop-blur-sm text-pink-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6 tracking-wide">
            🎓 For Hampton University Students
          </span>
          <h1 className="text-5xl md:text-6xl text-white leading-tight mb-6 uppercase tracking-tight" style={ARCHIVO}>
            Find Your{" "}
            <span className="text-pink-400">Dream Internship</span>
          </h1>
          <p className="text-lg md:text-xl text-white leading-relaxed max-w-2xl mx-auto mb-10">
            QT Hub is built for Hampton University sophomores and juniors.
            Browse curated internship opportunities, filter by your major, and
            take the next step in your career — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/internships" className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Browse Internships →
            </Link>
            <Link href="/scholarships" className="bg-white/20 backdrop-blur-sm border border-white/50 text-white hover:bg-white/30 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-200">
              Find Scholarships →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-4 divide-x divide-gray-200 text-center">
          {[
            { value: "165+", label: "Internships" },
{ value: "30+",  label: "Scholarships" },
{ value: "50+",  label: "Companies" },
{ value: "HU",   label: "Students Only" },
          ].map((stat) => (
            <div key={stat.label} className="px-4">
              <p className="text-3xl text-gray-900" style={ARCHIVO}>{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Meet the Founder ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="shrink-0">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 rounded-full border-4 border-pink-200 scale-105" />
                <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-pink-100 z-0" />
                <div className="w-full h-full rounded-full z-10 relative overflow-hidden border-4 border-white shadow-lg">
                  <Image src="/founder.jpg" alt="Founder" fill className="object-cover object-top" />
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-pink-500 font-medium text-sm uppercase tracking-widest mb-3">Meet the Founder</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-snug" style={PLAYFAIR}>
                Built by an HU student,{"\u00A0\u00A0"}
                <em className="text-pink-400">for HU students.</em>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4" style={PLAYFAIR}>
                Abi Moyosore is a 2nd year in the 5-year MBA program at Hampton University,
                originally from Richmond, Virginia — and she&apos;s vying to be your Junior Class President.
              </p>
              <p className="text-gray-500 leading-relaxed mb-4" style={PLAYFAIR}>
                QT Hub was created out of a simple frustration — internship opportunities
                existed, but they weren&apos;t easy to find in one place for Hampton University
                students. So she built it herself.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6" style={PLAYFAIR}>
                As a sophomore or junior navigating recruitment season, you deserve a
                platform that actually understands your journey. QT Hub is that platform.
              </p>
              <div className="inline-flex items-center gap-2">
                <div className="h-px w-8 bg-pink-300" />
                <span className="text-gray-700 font-semibold text-lg italic" style={PLAYFAIR}>
                  Abi Moyosore, Hampton University &rsquo;26
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-pink-500 font-medium text-sm uppercase tracking-widest mb-3">Why QT Hub</p>
          <h2 className="text-3xl md:text-4xl text-gray-900 text-center mb-12 uppercase tracking-tight" style={ARCHIVO}>
            Everything you need to get started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🎯", title: "Curated for HU", body: "Every listing is hand-picked for Hampton University sophomores and juniors — no irrelevant noise." },
              { icon: "🏆", title: "Scholarships Too", body: "Browse 30+ scholarships filtered by your major, class year, and deadline — all in one place." },
              { icon: "📄", title: "Career Resources", body: "Access resume tips, interview guides, and career advice built specifically for HU students." },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-lg text-gray-900 mb-2 uppercase tracking-tight" style={ARCHIVO}>{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-10 border border-pink-100 shadow-sm">
          <h2 className="text-3xl text-gray-900 mb-4 uppercase tracking-tight" style={ARCHIVO}>
            Ready to find your fit? ✨
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Hundreds of HU students have already found internships and scholarships through QT Hub.
            Your next opportunity is one click away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/internships" className="inline-block bg-pink-400 hover:bg-pink-500 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Browse Internships →
            </Link>
            <Link href="/scholarships" className="inline-block border border-pink-300 text-pink-500 hover:bg-pink-50 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-200">
              Find Scholarships →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 pl-9 pr-7 bg-white mt-8">
  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
    <Link href="/">
      <Image src="/QTlogo.png" alt="QT Hub" width={80} height={28} className="object-contain" />
    </Link>
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