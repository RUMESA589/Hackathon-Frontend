import { apiFetch } from "@/lib/api";
import { useEffect, useState, Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/controllers/AuthController";
import { useRouter, useSearchParams } from "@/lib/router";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, ArrowRight, Plus, AlertTriangle, Bell, User } from "lucide-react";
import {Link} from "react-router-dom";
import { toast } from "@/components/Toaster";
function DashboardContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab") || "overview";
    const [complaints, setComplaints] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [stats, setStats] = useState({ active: 0, completed: 0, rejected: 0, pending: 0 });
    const [fetching, setFetching] = useState(true);
    useEffect(() => {
        if (!loading && !user)
            router.push("/login");
        if (user && user.role !== "student") {
            if (user.role === "worker")
                router.push("/worker/dashboard");
            else if (user.role === "admin")
                router.push("/admin/dashboard");
        }
    }, [user, loading]);
    const fetchData = async () => {
        try {
            const [compRes, notifRes] = await Promise.all([
                apiFetch("/api/complaints", { credentials: "include" }),
                apiFetch("/api/notifications", { credentials: "include" }),
            ]);
            if (compRes.ok) {
                const data = await compRes.json();
                setComplaints(data.complaints || []);
                const active = data.complaints.filter((c) => c.status === "pending" || c.status === "accepted").length;
                const completed = data.complaints.filter((c) => c.status === "completed").length;
                const rejected = data.complaints.filter((c) => c.status === "rejected").length;
                const pending = data.complaints.filter((c) => c.status === "pending").length;
                setStats({ active, completed, rejected, pending });
            }
            if (notifRes.ok) {
                const data = await notifRes.json();
                setNotifications(data.notifications?.slice(0, 5) || []);
            }
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setFetching(false);
        }
    };
    useEffect(() => {
        if (user) {
            fetchData();
            const id = setInterval(fetchData, 4000);
            return () => clearInterval(id);
        }
    }, [user]);
    if (loading || fetching) {
        return (<div className="animate-pulse space-y-6">
        <div className="h-32 rounded-[20px] bg-slate-200"/>
        <div className="grid grid-cols-4 gap-4"><div className="h-24 rounded-2xl bg-slate-200"/><div className="h-24 rounded-2xl bg-slate-200"/><div className="h-24 rounded-2xl bg-slate-200"/><div className="h-24 rounded-2xl bg-slate-200"/></div>
      </div>);
    }
    const activeComplaint = complaints.find((c) => c.status === "pending" || c.status === "accepted");
    const filteredComplaints = tab === "active" ? complaints.filter(c => c.status === "pending" || c.status === "accepted") : tab === "history" ? complaints.filter(c => c.status === "completed" || c.status === "rejected") : complaints;
    return (<div className="max-w-1200px mx-auto space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-700 tracking-[-0.02em] leading-[0.9]">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="mt-2 text-[14px] text-slate-600">Here's what's happening with your campus requests.</p>
        </div>
        <Link to="/create-ticket" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 transition shadow-[0_4px_12px_rgba(15,23,42,0.2)]">
          <Plus className="w-4 h-4"/> New Request
        </Link>
      </div>

      {activeComplaint && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[20px] bg-amber-50 border border-amber-200 p-5 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0"><AlertTriangle className="w-5 h-5 text-amber-700"/></div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-amber-900">You have an active request</div>
            <div className="text-[13px] text-amber-800 mt-1 leading-1.5">Ticket {activeComplaint.ticketId} • {activeComplaint.category} at {activeComplaint.location} • Status: {activeComplaint.status}. You cannot create another request until this is resolved.</div>
            <Link to={`/ticket/${activeComplaint.id}`} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-amber-900 hover:underline">View details <ArrowRight className="w-3.5 h-3.5"/></Link>
          </div>
        </motion.div>)}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
            { label: "Active Requests", value: stats.active, icon: Clock, color: "bg-blue-50 border-blue-100 text-blue-600" },
            { label: "Completed", value: stats.completed, icon: CheckCircle, color: "bg-emerald-50 border-emerald-100 text-emerald-600" },
            { label: "Rejected", value: stats.rejected, icon: XCircle, color: "bg-red-50 border-red-100 text-red-600" },
            { label: "Pending", value: stats.pending, icon: Bell, color: "bg-amber-50 border-amber-100 text-amber-600" },
        ].map((s, i) => (<motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-[20px] bg-white border border-slate-200 p-5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5"/></div>
            <div className="mt-4 text-[26px] font-semibold tracking-tight leading-none">{s.value}</div>
            <div className="mt-1 text-[12px] font-medium text-slate-500 uppercase tracking-widest">{s.label}</div>
          </motion.div>))}
      </div>

      <div className="grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
        <div className="rounded-[20px] bg-white border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold tracking-tight">{tab === "overview" ? "Recent Requests" : tab === "active" ? "Active Requests" : "History"}</h2>
            <div className="flex items-center gap-2">
              <Link to="/dashboard?tab=active" className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition ${tab === "active" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>Active</Link>
              <Link to="/dashboard?tab=history" className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition ${tab === "history" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>History</Link>
              <Link to="/dashboard" className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition ${tab === "overview" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>All</Link>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredComplaints.length === 0 ? (<div className="p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto"><Bell className="w-7 h-7 text-slate-400"/></div>
                <div className="mt-4 text-[15px] font-semibold">No requests yet</div>
                <div className="mt-1 text-[13px] text-slate-500">Create your first campus assistance request to get started.</div>
                <Link to="/create-ticket" className="mt-5 inline-flex px-5 py-2.5 rounded-full bg-slate-900 text-white text-[13px] font-semibold">Create Request</Link>
              </div>) : (filteredComplaints.slice(0, 8).map((c) => (<Link key={c.id} to={`/ticket/${c.id}`} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition group">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${c.urgency === "emergency" ? "bg-red-50 border-red-100 text-red-600" : c.urgency === "urgent" ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                    <span className="text-[11px] font-bold uppercase">{c.urgency[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold text-slate-500">{c.ticketId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${c.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : c.status === "accepted" ? "bg-blue-50 text-blue-700 border-blue-100" : c.status === "rejected" ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>{c.status}</span>
                      <span className="text-[12px] text-slate-400">• {new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-1 text-[14px] font-semibold truncate group-hover:text-slate-900">{c.category} • {c.location}</div>
                    <div className="mt-0.5 text-[12px] text-slate-500 truncate">{c.description}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {c.worker && <div className="hidden md:flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-semibold">{c.worker.name?.[0]}</div><div className="text-[12px] font-medium">{c.worker.name?.split(" ")[0]}</div></div>}
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition"/>
                  </div>
                </Link>)))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[20px] bg-white border border-slate-200 p-6">
            <h3 className="text-[14px] font-semibold flex items-center gap-2"><Bell className="w-4 h-4"/>Recent Notifications</h3>
            <div className="mt-4 space-y-3">
              {notifications.length === 0 ? (<div className="text-[13px] text-slate-500 py-6 text-center">No notifications yet</div>) : (notifications.map((n) => (<div key={n.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type.includes("accepted") ? "bg-blue-50 text-blue-600" : n.type.includes("completed") ? "bg-emerald-50 text-emerald-600" : n.type.includes("rejected") ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"}`}><Bell className="w-4 h-4"/></div>
                    <div className="flex-1 min-w-0"><div className="text-[12px] font-semibold leading-[1.3]">{n.title}</div><div className="text-[11px] text-slate-600 mt-1 leading-[1.4] line-clamp-2">{n.message}</div><div className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</div></div>
                  </div>)))}
            </div>
          </div>

          <div className="rounded-[20px] bg-slate-900 text-white p-6">
            <h3 className="text-[14px] font-semibold">Need help fast?</h3>
            <p className="mt-2 text-[13px] leading-1.1 text-white/70">Emergency requests are prioritized and dispatched immediately to available specialists.</p>
            <div className="mt-4 flex items-center gap-2">
              <Link to="/create-ticket" className="px-4 py-2 rounded-full bg-white text-slate-900 text-[13px] font-semibold">Create Request</Link>
              <span className="text-[11px] text-white/50">Avg 9 min response</span>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
export default function StudentDashboardPage() {
    return (<DashboardLayout role="student">
      <Suspense fallback={<div className="animate-pulse h-96 bg-slate-200 rounded-[20px]"/>}>
        <DashboardContent />
      </Suspense>
    </DashboardLayout>);
}
