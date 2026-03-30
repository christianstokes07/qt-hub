"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import Navbar from "@/components/Navbar";
import { getAuthenticatedSupabase } from "@/lib/supabase";
import { useAuth } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

const POPPINS = { fontFamily: "'Poppins', sans-serif", fontWeight: 700 };
const DM = { fontFamily: "'DM Sans', sans-serif" };

type AppStatus = "saved" | "applied" | "interview" | "offer" | "rejected";

type Application = {
  id: string;
  user_id: string;
  title: string;
  company_or_org: string;
  link?: string;
  item_type: "internship" | "scholarship";
  status: AppStatus;
  is_custom: boolean;
  created_at: string;
};

const COLUMNS: { id: AppStatus; label: string; color: string; bg: string; border: string; dot: string }[] = [
  { id: "saved",     label: "Saved",     color: "text-gray-500",  bg: "bg-gray-50",   border: "border-gray-200", dot: "bg-gray-400"  },
  { id: "applied",   label: "Applied",   color: "text-blue-500",  bg: "bg-blue-50",   border: "border-blue-200", dot: "bg-blue-400"  },
  { id: "interview", label: "Interview", color: "text-purple-500",bg: "bg-purple-50", border: "border-purple-200",dot: "bg-purple-400"},
  { id: "offer",     label: "Offer 🎉",  color: "text-green-500", bg: "bg-green-50",  border: "border-green-200",dot: "bg-green-400" },
  { id: "rejected",  label: "Rejected",  color: "text-red-400",   bg: "bg-red-50",    border: "border-red-200",  dot: "bg-red-300"   },
];

const EMPTY_FORM = {
  title: "",
  company_or_org: "",
  link: "",
  item_type: "internship" as "internship" | "scholarship",
  status: "applied" as AppStatus,
};

export default function TrackerPage() {
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) fetchApps();
  }, [isSignedIn]);

  async function fetchApps() {
    setLoading(true);
    try {
      const sb = await getAuthenticatedSupabase(() => getToken({ template: "supabase" }));
      const { data, error } = await sb
        .from("applications")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error && data) setApps(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!form.title.trim() || !form.company_or_org.trim()) return;
    setSaving(true);
    try {
      const sb = await getAuthenticatedSupabase(() => getToken({ template: "supabase" }));
      const { data, error } = await sb
        .from("applications")
        .insert([{ ...form, is_custom: true }])
        .select()
        .single();
      if (!error && data) {
        setApps((prev) => [...prev, data]);
        setModalOpen(false);
        setForm(EMPTY_FORM);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const sb = await getAuthenticatedSupabase(() => getToken({ template: "supabase" }));
    await sb.from("applications").delete().eq("id", id);
    setApps((prev) => prev.filter((a) => a.id !== id));
    setDeleteId(null);
  }

  async function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as AppStatus;
    setApps((prev) =>
      prev.map((a) => (a.id === draggableId ? { ...a, status: newStatus } : a))
    );

    const sb = await getAuthenticatedSupabase(() => getToken({ template: "supabase" }));
    await sb.from("applications").update({ status: newStatus }).eq("id", draggableId);
  }

  const byStatus = (status: AppStatus) => apps.filter((a) => a.status === status);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <main className="min-h-screen bg-gray-50" style={DM}>
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-pink-500 font-medium text-sm uppercase tracking-widest mb-1">My Applications</p>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-3xl text-gray-900 uppercase tracking-tight" style={POPPINS}>
              Application Tracker
            </h1>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> Add Application
            </button>
          </div>

          {/* Summary pills */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {COLUMNS.map((col) => {
              const count = byStatus(col.id).length;
              return (
                <span key={col.id} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${col.bg} ${col.border} ${col.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                  {col.label}: {count}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="px-4 py-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              Loading your applications…
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-4 min-w-max pb-4">
                {COLUMNS.map((col) => {
                  const cards = byStatus(col.id);
                  return (
                    <div key={col.id} className="w-64 flex flex-col">
                      {/* Column header */}
                      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3 border ${col.bg} ${col.border}`}>
                        <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                        <span className={`text-sm font-semibold ${col.color}`} style={POPPINS}>
                          {col.label}
                        </span>
                        <span className={`ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full bg-white border ${col.border} ${col.color}`}>
                          {cards.length}
                        </span>
                      </div>

                      {/* Droppable */}
                      <Droppable droppableId={col.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 min-h-32 rounded-xl p-2 transition-colors duration-150 ${
                              snapshot.isDraggingOver ? `${col.bg} ${col.border} border-2 border-dashed` : "bg-transparent"
                            }`}
                          >
                            {cards.length === 0 && !snapshot.isDraggingOver && (
                              <div className="flex items-center justify-center h-20 text-gray-300 text-xs text-center px-2">
                                Drop cards here
                              </div>
                            )}
                            {cards.map((app, index) => (
                              <Draggable key={app.id} draggableId={app.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`bg-white rounded-xl border border-gray-100 p-3.5 mb-2 shadow-sm transition-all duration-150 group ${
                                      snapshot.isDragging ? "shadow-lg rotate-1 scale-105 border-pink-200" : "hover:shadow-md hover:-translate-y-0.5"
                                    }`}
                                  >
                                    {/* Type badge */}
                                    <div className="flex items-center justify-between mb-2">
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                        app.item_type === "internship"
                                          ? "bg-pink-50 text-pink-500 border border-pink-100"
                                          : "bg-purple-50 text-purple-500 border border-purple-100"
                                      }`}>
                                        {app.item_type === "internship" ? "Internship" : "Scholarship"}
                                      </span>
                                      {app.is_custom && (
                                        <span className="text-xs text-gray-300 font-medium">Custom</span>
                                      )}
                                    </div>

                                    <p className="text-sm font-semibold text-gray-900 leading-snug mb-0.5 line-clamp-2">
                                      {app.title}
                                    </p>
                                    <p className="text-xs text-gray-400 mb-3">{app.company_or_org}</p>

                                    <div className="flex items-center gap-2">
                                      {app.link && (
                                        <a
                                          href={app.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="text-xs text-pink-400 hover:text-pink-500 font-medium transition-colors"
                                        >
                                          View →
                                        </a>
                                      )}
                                      <button
                                        onClick={() => setDeleteId(app.id)}
                                        className="ml-auto opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-xs"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          )}

          {/* Empty state */}
          {!loading && apps.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-900 font-semibold text-lg mb-1" style={POPPINS}>No applications yet</p>
              <p className="text-gray-400 text-sm mb-6">Add your first application to start tracking your progress.</p>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all duration-200 shadow-sm"
              >
                + Add Application
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-md p-6 z-10">
            <h2 className="text-xl text-gray-900 mb-1 uppercase tracking-tight" style={POPPINS}>Add Application</h2>
            <p className="text-gray-400 text-sm mb-5">Track something you applied to outside of QT Hub.</p>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Role / Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering Intern"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all placeholder-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Company / Organization *</label>
                <input
                  type="text"
                  placeholder="e.g. Google"
                  value={form.company_or_org}
                  onChange={(e) => setForm({ ...form, company_or_org: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all placeholder-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Link (optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all placeholder-gray-300"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Type</label>
                  <select
                    value={form.item_type}
                    onChange={(e) => setForm({ ...form, item_type: e.target.value as "internship" | "scholarship" })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all bg-white"
                  >
                    <option value="internship">Internship</option>
                    <option value="scholarship">Scholarship</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as AppStatus })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all bg-white"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setModalOpen(false); setForm(EMPTY_FORM); }}
                className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold px-4 py-2.5 rounded-full text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving || !form.title.trim() || !form.company_or_org.trim()}
                className="flex-1 bg-pink-400 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2.5 rounded-full text-sm transition-all duration-200 shadow-sm"
              >
                {saving ? "Saving…" : "Add Application"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-sm p-6 z-10 text-center">
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="text-lg text-gray-900 font-semibold mb-1" style={POPPINS}>Delete Application?</h3>
            <p className="text-gray-400 text-sm mb-5">This can't be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold px-4 py-2.5 rounded-full text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-2.5 rounded-full text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}