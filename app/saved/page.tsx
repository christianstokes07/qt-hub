"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser, useAuth } from "@clerk/nextjs";
import { getAuthenticatedSupabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
export const dynamic = "force-dynamic";

const POPPINS = { fontFamily: "'Poppins', sans-serif", fontWeight: 700 };
const DM      = { fontFamily: "'DM Sans', sans-serif" };

type Favorite = {
  id: string;
  item_id: string;
  item_type: "internship" | "scholarship";
  title: string;
  company_or_org: string;
  link: string;
  deadline: string;
  created_at: string;
};

export default function SavedPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) { setLoading(false); return; }

    const fetchFavorites = async () => {
      const supabase = await getAuthenticatedSupabase(() => getToken({ template: "supabase" }));
      const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setFavorites(data || []);
      setLoading(false);
    };

    fetchFavorites();
  }, [isLoaded, isSignedIn, user]);

  const remove = async (id: string) => {
    const supabase = await getAuthenticatedSupabase(() => getToken({ template: "supabase" }));
    await supabase.from("favorites").delete().eq("id", id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const internships = favorites.filter((f) => f.item_type === "internship");
  const scholarships = favorites.filter((f) => f.item_type === "scholarship");

  return (
    <main className="min-h-screen bg-gray-50" style={DM}>
      <Navbar />

      <section className="bg-white border-b border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-2" style={POPPINS}>My Saved</h1>
          <p className="text-gray-500">Your saved internships and scholarships — all in one place.</p>
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
            <p className="text-xl font-semibold text-gray-700 mb-2">Sign in to view your saved items</p>
            <p className="text-gray-400 mb-6">Create an account to save internships and scholarships.</p>
            <Link href="/sign-in" className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-8 py-4 rounded-full transition-colors">Sign In</Link>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🌸</p>
            <p className="text-xl font-semibold text-gray-700 mb-2">No saved items yet</p>
            <p className="text-gray-400 mb-6">Hit the heart icon on any internship or scholarship to save it here.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/internships" className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-6 py-3 rounded-full transition-colors">Browse Internships</Link>
              <Link href="/scholarships" className="border border-pink-300 text-pink-500 hover:bg-pink-50 font-semibold px-6 py-3 rounded-full transition-colors">Browse Scholarships</Link>
            </div>
          </div>
        ) : (
          <>
            {internships.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xl">⭐</span>
                  <h2 className="text-xl font-bold text-gray-900" style={POPPINS}>Saved Internships</h2>
                  <span className="text-sm text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{internships.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {internships.map((fav) => (
                    <div key={fav.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                      <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-400 font-bold text-sm shrink-0">
                              {fav.company_or_org.charAt(0)}
                            </div>
                            <p className="text-pink-500 font-semibold text-sm">{fav.company_or_org}</p>
                          </div>
                          <button onClick={() => remove(fav.id)} className="text-pink-400 hover:text-pink-600 transition-colors" title="Remove">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>
                        <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug">{fav.title}</h2>
                        {fav.deadline && fav.deadline !== "Rolling" && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                            📅 {fav.deadline}
                          </span>
                        )}
                      </div>
                      <div className="px-6 pb-6">
                        <a href={fav.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 rounded-xl transition-colors">
                          Apply Now →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {scholarships.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xl">🏆</span>
                  <h2 className="text-xl font-bold text-gray-900" style={POPPINS}>Saved Scholarships</h2>
                  <span className="text-sm text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{scholarships.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {scholarships.map((fav) => (
                    <div key={fav.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                      <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-pink-500 font-semibold text-sm">{fav.company_or_org}</p>
                          <button onClick={() => remove(fav.id)} className="text-pink-400 hover:text-pink-600 transition-colors" title="Remove">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>
                        <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug">{fav.title}</h2>
                        {fav.deadline && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                            📅 {fav.deadline}
                          </span>
                        )}
                      </div>
                      <div className="px-6 pb-6">
                        <a href={fav.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 rounded-xl transition-colors">
                          Apply Now →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

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