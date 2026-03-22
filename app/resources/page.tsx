import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const POPPINS = { fontFamily: "'Poppins', sans-serif", fontWeight: 700 };
const DM      = { fontFamily: "'DM Sans', sans-serif" };

const resumeTips = [
  { number: "01", title: "Keep it to one page", body: "As a sophomore or junior, one page is the standard. Recruiters spend an average of 7 seconds scanning a resume — make every line count." },
  { number: "02", title: "Use strong action verbs", body: 'Start every bullet with a powerful verb: "Led," "Built," "Designed," "Analyzed," "Increased." Avoid passive language like "Responsible for."' },
  { number: "03", title: "Quantify your impact", body: 'Numbers make your experience real. Instead of "helped grow social media," write "Grew Instagram following by 40% in 3 months."' },
  { number: "04", title: "Tailor to each job", body: "Read the job description carefully and mirror its language. Use keywords that match the role — many companies use ATS software that filters resumes." },
  { number: "05", title: "List relevant coursework", body: "If you lack work experience, list relevant HU courses under your education section. This shows recruiters you have foundational knowledge." },
  { number: "06", title: "Proofread everything", body: "One typo can cost you an interview. Read your resume out loud, then have a friend, professor, or the HU Career Center review it." },
];

const interviewTips = [
  { icon: "🎯", title: "Research the company first", body: "Know the company's mission, recent news, and the specific team you're applying to. Mention something specific — it shows genuine interest." },
  { icon: "📖", title: "Use the STAR method", body: 'For behavioral questions ("Tell me about a time..."), structure your answer: Situation, Task, Action, Result. Practice 4–5 stories that cover different skills.' },
  { icon: "💬", title: 'Prepare your "Tell me about yourself"', body: "Have a 60-second pitch ready: who you are, your major, a key experience, and why you're excited about this role. Practice until it sounds natural." },
  { icon: "❓", title: "Always ask questions", body: "Prepare 2–3 thoughtful questions for the interviewer. Ask about team culture, day-to-day work, or growth opportunities — never ask about salary first." },
  { icon: "👔", title: "Dress one level up", body: "When unsure, overdress. Business casual is usually safe. For virtual interviews, check your background, lighting, and internet connection beforehand." },
  { icon: "📧", title: "Send a thank-you email", body: "Within 24 hours, send a brief thank-you email to your interviewer. Mention something specific you discussed. Most candidates skip this — don't." },
];

const resources = [
  { label: "Resume Builder", name: "HU Career Center", desc: "Get 1-on-1 resume reviews and career coaching from Hampton University's Career Services team.", link: "https://home.hamptonu.edu/career/", color: "bg-pink-50 border-pink-100", badge: "text-pink-600 bg-pink-100" },
  { label: "Free Template", name: "Canva Resume Templates", desc: "Hundreds of free, professional resume templates you can customize in minutes.", link: "https://canva.com/resumes/templates/", color: "bg-rose-50 border-rose-100", badge: "text-rose-600 bg-rose-100" },
  { label: "Interview Prep", name: "Big Interview", desc: "Practice common interview questions with AI feedback. Many universities offer free access.", link: "https://biginterview.com/", color: "bg-purple-50 border-purple-100", badge: "text-purple-600 bg-purple-100" },
  { label: "Networking", name: "LinkedIn for Students", desc: "Build your profile, connect with HU alumni, and find internships through LinkedIn's student hub.", link: "https://linkedin.com/school/hampton-university/", color: "bg-blue-50 border-blue-100", badge: "text-blue-600 bg-blue-100" },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-gray-50" style={DM}>

      <Navbar active="resources" />

      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-100 py-12 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-pink-100 text-pink-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            Career Resources
          </span>
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-3" style={POPPINS}>Set Yourself Up for Success</h1>
          <p className="text-gray-500 leading-relaxed">
            Resume tips, interview strategies, and free tools — everything you need to land and ace your internship as an HU sophomore or junior.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-14 space-y-16">

        {/* ── Resume Tips ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">📄</span>
            <h2 className="text-2xl text-gray-900" style={POPPINS}>Resume Tips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {resumeTips.map((tip) => (
              <div key={tip.number} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-pink-300 font-bold text-xl shrink-0 mt-0.5" style={POPPINS}>{tip.number}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1.5" style={POPPINS}>{tip.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{tip.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* ── Interview Tips ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">🎤</span>
            <h2 className="text-2xl text-gray-900" style={POPPINS}>Interview Tips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {interviewTips.map((tip) => (
              <div key={tip.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-2xl mb-3">{tip.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1.5" style={POPPINS}>{tip.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* ── Helpful Links ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">🔗</span>
            <h2 className="text-2xl text-gray-900" style={POPPINS}>Helpful Links</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {resources.map((res) => (
              <a key={res.name} href={res.link} target="_blank" rel="noopener noreferrer" className={`block rounded-2xl p-6 border ${res.color} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900" style={POPPINS}>{res.name}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${res.badge} whitespace-nowrap`}>{res.label}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{res.desc}</p>
                <p className="text-pink-500 text-sm font-semibold mt-3">Visit →</p>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* ── CTA ── */}
      <section className="py-14 px-6 text-center bg-white border-t border-gray-100">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl text-gray-900 mb-3" style={POPPINS}>Ready to apply what you've learned?</h2>
          <p className="text-gray-500 mb-6">Browse our curated internship listings and start applying today.</p>
          <Link href="/internships" className="inline-block bg-pink-400 hover:bg-pink-500 text-white font-semibold px-8 py-4 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg">
            Browse Internships →
          </Link>
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