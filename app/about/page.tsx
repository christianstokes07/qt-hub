import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const POPPINS  = { fontFamily: "'Poppins', sans-serif", fontWeight: 700 };
const PLAYFAIR = { fontFamily: "'Playfair Display', serif" };
const DM       = { fontFamily: "'DM Sans', sans-serif" };

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white" style={DM}>

      <Navbar active="about" />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-pink-50 to-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-pink-100 text-pink-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            About QT Hub
          </span>
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-6 leading-tight" style={POPPINS}>
            Built for HU.<br />
            <span className="text-pink-400">By HU.</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            QT Hub is a career platform built exclusively for Hampton University sophomores
            and juniors — connecting students with internships, scholarships, and resources
            tailored to their journey.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-10 border border-pink-100">
            <p className="text-pink-500 font-medium text-sm uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="text-3xl text-gray-900 mb-6 leading-snug" style={POPPINS}>
              No HU student should miss an opportunity because they didn't know it existed.
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              The internship and scholarship search is broken for HBCU students. Opportunities
              exist — they're just scattered across dozens of websites, buried in career fair
              handouts, or shared only through personal connections. QT Hub fixes that by putting
              everything in one place, filtered specifically for Hampton University students.
            </p>
          </div>
        </div>
      </section>

      {/* ── Founder ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-pink-500 font-medium text-sm uppercase tracking-widest mb-10 text-center">The Team</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Abi */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-pink-200 scale-105" />
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md relative z-10">
                  <Image src="/founder.jpg" alt="Abi Moyosore" fill className="object-cover object-top" />
                </div>
              </div>
              <h3 className="text-xl text-gray-900 mb-1" style={POPPINS}>Abi Moyosore</h3>
              <p className="text-pink-500 font-medium text-sm mb-4">Founder & CEO</p>
              <p className="text-gray-500 text-sm leading-relaxed" style={PLAYFAIR}>
                Abi Moyosore is a 2nd year in the 5-Year MBA Program at Hampton University,
originally from Richmond, Virginia. She founded QT Hub out of a personal
frustration with how hard it was to find internship opportunities as an HBCU
student — and her vision to be Hampton University&apos;s Junior Class President
fuels her commitment to building tools that serve the HU community.
              </p>
            </div>

            {/* Christian */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-pink-200 scale-105" />
                <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center border-4 border-white shadow-md relative z-10">
                  <span className="text-4xl font-bold text-pink-400" style={POPPINS}>C</span>
                </div>
              </div>
              <h3 className="text-xl text-gray-900 mb-1" style={POPPINS}>Christian Stokes Jr.</h3>
              <p className="text-pink-500 font-medium text-sm mb-4">Lead Software Engineer</p>
              <p className="text-gray-500 text-sm leading-relaxed" style={PLAYFAIR}>
                Christian Stokes Jr. is a 2nd year Computer Science major at Hampton University,
originally from Prince George&apos;s County, Maryland. He is the sole lead software
engineer behind QT Hub — designing, building, and shipping the entire platform
from the ground up.
              </p>
            </div>
          </div>
        </div>
      </section>

      

      {/* ── Stats ── */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 text-center">
          {[
            { value: "165+", label: "Internships" },
            { value: "55+",  label: "Scholarships" },
            { value: "68",   label: "HU Majors Covered" },
            { value: "1",    label: "Engineer" },
          ].map((stat) => (
            <div key={stat.label} className="px-4">
              <p className="text-3xl text-gray-900" style={POPPINS}>{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl text-gray-900 mb-4" style={POPPINS}>Ready to get started?</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Browse internships and scholarships built specifically for Hampton University students.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/internships" className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-8 py-4 rounded-full transition-colors shadow-md hover:shadow-lg">
              Browse Internships →
            </Link>
            <Link href="/scholarships" className="border border-pink-300 text-pink-500 hover:bg-pink-50 font-semibold px-8 py-4 rounded-full transition-colors">
              Find Scholarships →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 px-6 bg-white">
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