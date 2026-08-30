import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/controllers/AuthController";
import { useRouter } from "@/lib/router";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, AlertTriangle, Star, Clock, Check, Search, ArrowLeft } from "lucide-react";
import {Link} from "react-router-dom";
import { toast } from "@/components/Toaster";
import { CATEGORY_DETAILS } from "@/lib/constants";
export default function CreateTicketPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [urgency, setUrgency] = useState("normal");
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [fetchingWorkers, setFetchingWorkers] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        if (!loading && !user)
            router.push("/login");
        if (user && user.role !== "student")
            router.push("/dashboard");
    }, [user, loading]);
    const fetchWorkers = async (cat) => {
        setFetchingWorkers(true);
        try {
            const res = await apiFetch(`/api/workers/recommended?category=${encodeURIComponent(cat)}`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setWorkers(data.workers || []);
            }
        }
        catch { }
        finally {
            setFetchingWorkers(false);
        }
    };
    useEffect(() => {
        if (category)
            fetchWorkers(category);
    }, [category]);
    const handleSubmit = async () => {
        if (!category || !description || !location || !urgency) {
            toast("Fill all required fields", "error");
            return;
        }
        setSubmitting(true);
        try {
            const res = await apiFetch("/api/complaints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, description, location, urgency, workerId: selectedWorker?.id }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error);
            toast("Request created successfully", "success");
            router.push(`/ticket/${data.complaint.id}`);
        }
        catch (err) {
            toast(err.message, "error");
        }
        finally {
            setSubmitting(false);
        }
    };
    const filteredCategories = CATEGORY_DETAILS.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return (<DashboardLayout role="student">
      <div className="max-w-900px mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50"><ArrowLeft className="w-4 h-4"/></Link>
          <div><h1 className="text-[24px] font-semibold tracking-tight">Create Campus Request</h1><p className="text-[13px] text-slate-500">Step {step} of 3 • {step === 1 ? "Select category" : step === 2 ? "Details & worker" : "Review & submit"}</p></div>
        </div>

        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3].map((s) => (<div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold border transition ${step >= s ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-400"}`}>{s}</div>
              {s < 3 && <div className={`h-px flex-1 transition ${step > s ? "bg-slate-900" : "bg-slate-200"}`}/>}
            </div>))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (<motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-24px bg-white border border-slate-200 p-6 md:p-8">
              <h2 className="text-[18px] font-semibold tracking-tight">What do you need help with?</h2>
              <p className="mt-2 text-[14px] text-slate-600">Choose a category that best matches your problem. We'll recommend specialists.</p>

              <div className="mt-6 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search categories (e.g., laptop, plumbing, delivery...)" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-900"/>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-3">
                {filteredCategories.map((cat) => (<button key={cat.id} onClick={() => { setCategory(cat.id); setStep(2); }} className={`text-left p-5 rounded-2xl border-2 transition text-[14px] ${category === cat.id ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>
                    <div className="flex items-start justify-between"><div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-[20px] ${cat.color}`}>{cat.icon}</div>{category === cat.id && <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center"><Check className="w-3.5 h-3.5"/></div>}</div>
                    <div className="mt-4 font-semibold">{cat.title}</div>
                    <div className="mt-1 text-[13px] leading-[1.4] text-slate-600 line-clamp-2">{cat.description}</div>
                    <div className="mt-3 flex gap-1.5 flex-wrap">{cat.workers.slice(0, 2).map((w) => <span key={w} className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px]">{w}</span>)}</div>
                  </button>))}
              </div>
            </motion.div>)}

          {step === 2 && (<motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="rounded-24px bg-white border border-slate-200 p-6 md:p-8">
                <h2 className="text-[18px] font-semibold tracking-tight">Request details</h2>
                <div className="mt-6 grid gap-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div><label className="text-[13px] font-medium">Category</label><div className="mt-1.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-medium flex items-center justify-between"><span>{category}</span><button onClick={() => setStep(1)} className="text-[12px] text-slate-500 hover:text-slate-900 underline">Change</button></div></div>
                    <div><label className="text-[13px] font-medium">Location *</label><div className="relative mt-1.5"><MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., CS Lab Block A, Room 302" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-900"/></div></div>
                  </div>

                  <div><label className="text-[13px] font-medium">Description *</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your issue in detail. What happened? What do you need?" rows={4} className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"/></div>

                  <div><label className="text-[13px] font-medium">Urgency *</label><div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                { id: "emergency", label: "Emergency", desc: "Immediate", color: "border-red-200 bg-red-50 text-red-700" },
                { id: "urgent", label: "Urgent", desc: "High priority", color: "border-amber-200 bg-amber-50 text-amber-700" },
                { id: "normal", label: "Normal", desc: "Standard", color: "border-blue-200 bg-blue-50 text-blue-700" },
                { id: "low", label: "Low", desc: "Whenever", color: "border-slate-200 bg-slate-50 text-slate-700" },
            ].map((u) => (<button key={u.id} onClick={() => setUrgency(u.id)} className={`p-3 rounded-xl border-2 text-left transition ${urgency === u.id ? "border-slate-900 bg-slate-900 text-white" : `bg-white ${u.color} hover:border-slate-300`}`}>
                        <div className="text-[13px] font-semibold">{u.label}</div><div className={`text-[11px] mt-0.5 ${urgency === u.id ? "text-white/70" : "opacity-70"}`}>{u.desc}</div>
                      </button>))}
                  </div></div>
                </div>
              </div>

              <div className="rounded-24px bg-white border border-slate-200 p-6 md:p-8">
                <h3 className="text-[16px] font-semibold tracking-tight flex items-center gap-2"><Star className="w-4 h-4"/>Recommended Workers for {category}</h3>
                <p className="mt-1 text-[13px] text-slate-600">Ranked by specialization match, availability, rating, and response time. Select one or proceed without.</p>

                <div className="mt-6 space-y-3">
                  {fetchingWorkers ? (<div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-88px rounded-2xl bg-slate-100 animate-pulse"/>)}</div>) : workers.length === 0 ? (<div className="text-[13px] text-slate-500 py-8 text-center">No workers available for this category. Your request will be broadcast to all workers.</div>) : (workers.slice(0, 5).map((w) => (<button key={w.id} onClick={() => setSelectedWorker(selectedWorker?.id === w.id ? null : w)} className={`w-full text-left p-4 rounded-2xl border-2 flex items-center gap-4 transition ${selectedWorker?.id === w.id ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>
                        <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">{w.name[0]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2"><span className="text-[14px] font-semibold">{w.name}</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${w.availability === "available" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : w.availability === "busy" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}>{w.availability}</span></div>
                          <div className="text-[12px] text-slate-600 mt-0.5">{w.specialization} • ⭐ {w.ratingAvg} • {w.completedRequests} completed • {w.responseTimeAvg}m avg</div>
                          <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{w.bio}</div>
                        </div>
                        {selectedWorker?.id === w.id && <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center"><Check className="w-3.5 h-3.5"/></div>}
                      </button>)))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-[13px] font-medium">Back</button>
                  <button onClick={() => setStep(3)} disabled={!location || !description} className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-[13px] font-semibold disabled:opacity-50 hover:bg-slate-800 transition">Continue to Review</button>
                </div>
              </div>
            </motion.div>)}

          {step === 3 && (<motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-24px bg-white border border-slate-200 p-6 md:p-8">
              <h2 className="text-[18px] font-semibold tracking-tight">Review & Submit</h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3">
                  <div className="flex justify-between"><span className="text-[13px] text-slate-500">Category</span><span className="text-[13px] font-semibold">{category}</span></div>
                  <div className="flex justify-between"><span className="text-[13px] text-slate-500">Location</span><span className="text-[13px] font-semibold">{location}</span></div>
                  <div className="flex justify-between"><span className="text-[13px] text-slate-500">Urgency</span><span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase ${urgency === "emergency" ? "bg-red-100 text-red-700" : urgency === "urgent" ? "bg-amber-100 text-amber-700" : urgency === "normal" ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-700"}`}>{urgency}</span></div>
                  <div><div className="text-[13px] text-slate-500">Description</div><div className="mt-1 text-[13px] leading-1.5">{description}</div></div>
                  {selectedWorker && <div className="flex justify-between items-center pt-3 border-t border-slate-200"><span className="text-[13px] text-slate-500">Selected Worker</span><span className="text-[13px] font-semibold flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">{selectedWorker.name[0]}</span>{selectedWorker.name} • ⭐ {selectedWorker.ratingAvg}</span></div>}
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0"/>
                  <div className="text-[12px] leading-1.5 text-amber-900"><span className="font-semibold">One active request rule:</span> You can only have one active complaint at a time. Backend enforces this. Worker will receive notification instantly without refresh.</div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button onClick={() => setStep(2)} className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-[13px] font-medium">Back</button>
                  <button onClick={handleSubmit} disabled={submitting} className="px-8 py-3 rounded-full bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 disabled:opacity-60 shadow-[0_4px_12px_rgba(15,23,42,0.2)]">{submitting ? "Submitting..." : "Submit Request"}</button>
                </div>
              </div>
            </motion.div>)}
        </AnimatePresence>
      </div>
    </DashboardLayout>);
}
