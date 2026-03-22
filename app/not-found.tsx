import Link from "next/link";
import Image from "next/image";

const POPPINS = { fontFamily: "'Poppins', sans-serif", fontWeight: 700 };
const DM      = { fontFamily: "'DM Sans', sans-serif" };

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex flex-col" style={DM}>

      {/* Navbar */}
      <nav className="border-b border-pink-100 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/">
            <Image src="/QTlogo.png" alt="QT Hub" width={120} height={40} className="object-contain" />
          </Link>
        </div>
      </nav>

      {/* 404 Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-8xl mb-6">🌸</p>
        <h1 className="text-6xl text-gray-900 mb-4" style={POPPINS}>404</h1>
        <h2 className="text-2xl text-gray-700 mb-4" style={POPPINS}>Page Not Found</h2>
        <p className="text-gray-500 max-w-md mb-10 leading-relaxed">
          Looks like this page doesn't exist. Let's get you back to finding your next opportunity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-8 py-4 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Back to Home
          </Link>
          <Link
            href="/internships"
            className="border border-pink-300 text-pink-500 hover:bg-pink-50 font-semibold px-8 py-4 rounded-full transition-colors duration-200"
          >
            Browse Internships
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-6 text-center text-sm text-gray-400">
        <p>© 2025 QT Hub · Made for Hampton University</p>
      </footer>
    </main>
  );
}