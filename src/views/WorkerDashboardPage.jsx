import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/controllers/AuthController";
import { useRouter } from "@/lib/router";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, User, CheckCircle, XCircle, AlertTriangle, Zap, Star, TrendingUp, Bell } from "lucide-react";
import { toast } from "@/components/Toaster";
export default function WorkerDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [complaints, setComplaints] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [filter, setFilter] = useState("all");
    const [availability, setAvailability] = useState("available");
    const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, completed: 0 });
    const [newRequestAlert, setNewRequestAlert] = useState(false);
    const [prevCount, setPrevCount] = useState(0);
    useEffect(() => {
        if (!loading && !user)
            router.push("/login");
        if (user && user.role !== "worker") {
            if (user.role === "student")
                router.push("/dashboard");
            else
                router.push("/admin/dashboard");
        }
    }, [user, loading]);
    const fetchComplaints = async () => {
        try {
            const res = await apiFetch("/api/worker/complaints", { credentials: "include" });
            if (res.status === 403) {
                router.push("/worker/verify");
                return;
            }
            if (res.ok) {
                const data = await res.json();
                const newCount = data.complaints?.length || 0;
                if (prevCount > 0 && newCount > prevCount) {
                    setNewRequestAlert(true);
                    toast("New campus assistance request received", "info");
                    setTimeout(() => setNewRequestAlert(false), 4000);
                }
                setPrevCount(newCount);
                setComplaints(data.complaints || []);
                setStats({
                    total: data.complaints.length,
                    pending: data.complaints.filter((c) => c.status === "pending").length,
                    accepted: data.complaints.filter((c) => c.status === "accepted" && c.workerId === user?.id).length,
                    completed: data.complaints.filter((c) => c.status === "completed" && c.workerId === user?.id).length,
                });
            }
        }
        catch { }
        finally {
            setFetching(false);
        }
    };
    useEffect(() => {
        if (user) {
            fetchComplaints();
            const id = setInterval(fetchComplaints, 3000);
            return () => clearInterval(id);
        }
    }, [user]);
    const handleAction = async (id, action) => {
        try {
            const res = await apiFetch(`/api/worker/complaints/${id}/${action}`, { method: "PUT", credentials: "include" });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error);
            toast(`Request ${action}ed successfully`, "success");
            fetchComplaints();
        }
        catch (err) {
            toast(err.message, "error");
        }
    };
    const handleAvailability = async (avail) => {
        try {
            const res = await apiFetch("/api/workers/status", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ availability: avail }),
                credentials: "include",
            });
            if (res.ok) {
                setAvailability(avail);
                toast(`Status set to ${avail}`, "success");
            }
        }
        catch { }
    };
    const filtered = complaints.filter(c => {
        if (filter === "pending")
            return c.status === "pending";
        if (filter === "my")
            return c.workerId === user?.id && (c.status === "accepted" || c.status === "completed");
        if (filter === "accepted")
            return c.status === "accepted";
        return true;
    }).sort((a, b) => {
        if (b.priority !== a.priority)
            return b.priority - a.priority;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    if (loading || fetching) {
        return <DashboardLayout role="worker"><div className="animate-pulse space-y-4"><div className="h-24 bg-slate-200 rounded-2xl"/><div className="h-96 bg-slate-200 rounded-2xl"/></div></DashboardLayout>;
    }
    return (<DashboardLayout role="worker">
      <div className="max-w-1200px mx-auto space-y-6">
        <AnimatePresence>
          {newRequestAlert && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="rounded-16px bg-slate-900 text-white p-4 flex items-center gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center"><Bell className="w-5 h-5"/></div>
              <div className="flex-1"><div className="text-[14px] font-semibold">New campus assistance request received</div><div className="text-[12px] text-white/60">A student just created a request — no refresh needed.</div></div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
            </motion.div>)}
        </AnimatePresence>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-700 tracking-[-0.02em]">Worker Operations</h1>
            <p className="text-[13px] text-slate-600 mt-1">Real-time requests • Sorted by urgency • Auto-updates every 3s</p>
          </div>
          <div className="flex items-center gap-2">
            {[
            { id: "available", label: "Available", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
            { id: "busy", label: "Busy", color: "bg-amber-50 text-amber-700 border-amber-200" },
            { id: "offline", label: "Offline", color: "bg-slate-100 text-slate-600 border-slate-200" },
        ].map((s) => (<button key={s.id} onClick={() => handleAvailability(s.id)} className={`px-4 py-2 rounded-full text-[12px] font-medium border transition ${availability === s.id ? "bg-slate-900 text-white border-slate-900" : s.color}`}>{s.label}</button>))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Requests", value: stats.total, icon: Zap, color: "bg-slate-900 text-white" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "bg-amber-50 text-amber-600 border-amber-100" },
            { label: "My Active", value: stats.accepted, icon: User, color: "bg-blue-50 text-blue-600 border-blue-100" },
            { label: "Completed", value: stats.completed, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        ].map((s, i) => (<motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`rounded-[18px] border p-5 ${s.color.includes("bg-slate-900") ? s.color : `bg-white border-slate-200`}`}>
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${s.color}`}><s.icon className="w-4.5 h-4.5"/></div>
              <div className="mt-3 text-[22px] font-semibold leading-none">{s.value}</div>
              <div className="text-[11px] uppercase tracking-widest font-medium opacity-70 mt-1">{s.label}</div>
            </motion.div>))}
        </div>

        <div className="rounded-[20px] bg-white border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold">Incoming Requests</h2>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-medium">{filtered.length} total</span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>Live</span>
            </div>
            <div className="flex items-center gap-2">
              {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
            { id: "accepted", label: "Accepted" },
            { id: "my", label: "My Jobs" },
        ].map((f) => (<button key={f.id} onClick={() => setFilter(f.id)} className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition ${filter === f.id ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{f.label}</button>))}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.length === 0 ? (<div className="p-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto"><Clock className="w-7 h-7 text-slate-400"/></div>
                <div className="mt-4 text-[14px] font-semibold">No requests in this view</div>
                <div className="text-[13px] text-slate-500 mt-1">New requests appear automatically without refresh. Average 2-3 per hour.</div>
              </div>) : (filtered.map((c) => (<motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 hover:bg-slate-50/70 transition group">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 font-bold text-[12px] ${c.urgency === "emergency" ? "bg-red-50 border-red-200 text-red-700" : c.urgency === "urgent" ? "bg-amber-50 border-amber-200 text-amber-700" : c.urgency === "normal" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"}`}>{c.urgency[0].toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-semibold text-slate-500">{c.ticketId}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${c.status === "accepted" ? "bg-blue-50 text-blue-700 border-blue-100" : c.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : c.status === "rejected" ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>{c.status}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${c.priority === 4 ? "bg-red-100 text-red-700" : c.priority === 3 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>P{c.priority} • {c.urgency}</span>
                        <span className="text-[11px] text-slate-400">{new Date(c.createdAt).toLocaleTimeString()} • {Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 60000)}m ago</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span className="text-[14px] font-semibold">{c.category}</span>
                        <span className="flex items-center gap-1 text-[12px] text-slate-600"><MapPin className="w-3.5 h-3.5"/>{c.location}</span>
                        {c.student && <span className="flex items-center gap-1.5 text-[12px] text-slate-600"><User className="w-3.5 h-3.5"/>{c.student.name} • {c.student.email}</span>}
                      </div>
                      <p className="mt-2 text-[13px] leading-1.5 text-slate-600 line-clamp-2">{c.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {c.status === "pending" && (<>
                          <button onClick={() => handleAction(c.id, "accept")} className="px-4 py-2 rounded-full bg-slate-900 text-white text-[12px] font-semibold hover:bg-slate-800 transition flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5"/>Accept</button>
                          <button onClick={() => handleAction(c.id, "reject")} className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-[12px] font-medium hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5"/>Reject</button>
                        </>)}
                      {c.status === "accepted" && c.workerId === user?.id && (<button onClick={() => handleAction(c.id, "complete")} className="px-4 py-2 rounded-full bg-emerald-600 text-white text-[12px] font-semibold hover:bg-emerald-700 transition flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5"/>Complete</button>)}
                      {c.status === "accepted" && c.workerId !== user?.id && <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">Assigned to other</span>}
                    </div>
                  </div>
                </motion.div>)))}
          </div>
        </div>
      </div>
    </DashboardLayout>);
}
