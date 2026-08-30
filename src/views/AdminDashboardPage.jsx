import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/controllers/AuthController";
import { useRouter } from "@/lib/router";
import { motion } from "framer-motion";
import { Users, Wrench, Ticket, CheckCircle, XCircle, Clock, Star, TrendingUp, Activity, BarChart3, Shield } from "lucide-react";
export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [activities, setActivities] = useState([]);
    const [tab, setTab] = useState("overview");
    const [fetching, setFetching] = useState(true);
    useEffect(() => {
        if (!loading && !user)
            router.push("/login");
        if (user && user.role !== "admin") {
            if (user.role === "student")
                router.push("/dashboard");
            else
                router.push("/worker/dashboard");
        }
    }, [user, loading]);
    const fetchAll = async () => {
        try {
            const [sRes, uRes, wRes, cRes, aRes] = await Promise.all([
                apiFetch("/api/admin/statistics", { credentials: "include" }),
                apiFetch("/api/admin/users", { credentials: "include" }),
                apiFetch("/api/admin/workers", { credentials: "include" }),
                apiFetch("/api/admin/complaints", { credentials: "include" }),
                apiFetch("/api/admin/activity", { credentials: "include" }),
            ]);
            if (sRes.ok) {
                const d = await sRes.json();
                setStats(d.statistics);
            }
            if (uRes.ok) {
                const d = await uRes.json();
                setUsers(d.users || []);
            }
            if (wRes.ok) {
                const d = await wRes.json();
                setWorkers(d.workers || []);
            }
            if (cRes.ok) {
                const d = await cRes.json();
                setComplaints(d.complaints || []);
            }
            if (aRes.ok) {
                const d = await aRes.json();
                setActivities(d.activities || []);
            }
        }
        catch { }
        finally {
            setFetching(false);
        }
    };
    useEffect(() => { if (user)
        fetchAll(); }, [user]);
    if (loading || fetching) {
        return <DashboardLayout role="admin"><div className="animate-pulse space-y-4"><div className="h-32 bg-slate-200 rounded-2xl"/><div className="grid grid-cols-4 gap-4"><div className="h-24 bg-slate-200 rounded-2xl"/><div className="h-24 bg-slate-200 rounded-2xl"/><div className="h-24 bg-slate-200 rounded-2xl"/><div className="h-24 bg-slate-200 rounded-2xl"/></div></div></DashboardLayout>;
    }
    return (<DashboardLayout role="admin">
      <div className="max-w-1280px mx-auto space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-700 tracking-[-0.02em] leading-[0.9]">Admin Control Center</h1>
            <p className="text-[13px] text-slate-600 mt-2">Complete system overview • Users • Workers • Complaints • Activity monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            {[
            { id: "overview", label: "Overview" },
            { id: "users", label: "Students" },
            { id: "workers", label: "Workers" },
            { id: "complaints", label: "Complaints" },
            { id: "activity", label: "Activity" },
        ].map((t) => (<button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-full text-[13px] font-medium border transition ${tab === t.id ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{t.label}</button>))}
          </div>
        </div>

        {tab === "overview" && stats && (<>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Students", value: stats.totalStudents, icon: Users, color: "bg-blue-50 text-blue-600 border-blue-100" },
                { label: "Total Workers", value: stats.totalWorkers, icon: Wrench, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                { label: "Active Complaints", value: stats.activeComplaints, icon: Clock, color: "bg-amber-50 text-amber-600 border-amber-100" },
                { label: "Completed", value: stats.completedComplaints, icon: CheckCircle, color: "bg-slate-900 text-white border-slate-900" },
                { label: "Pending", value: stats.pendingComplaints, icon: Ticket, color: "bg-violet-50 text-violet-600 border-violet-100" },
                { label: "Rejected", value: stats.rejectedComplaints, icon: XCircle, color: "bg-red-50 text-red-600 border-red-100" },
                { label: "Avg Rating", value: stats.avgRating, icon: Star, color: "bg-yellow-50 text-yellow-600 border-yellow-100" },
                { label: "Avg Response", value: `${stats.avgResponseTime}m`, icon: TrendingUp, color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
            ].map((s, i) => (<motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-[18px] bg-white border border-slate-200 p-5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5"/></div>
                  <div className="mt-4 text-[22px] font-semibold leading-none">{s.value}</div>
                  <div className="text-[11px] uppercase tracking-widest font-medium text-slate-500 mt-1.5">{s.label}</div>
                </motion.div>))}
            </div>

            <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6">
              <div className="rounded-[20px] bg-white border border-slate-200 p-6">
                <h3 className="text-[14px] font-semibold flex items-center gap-2"><BarChart3 className="w-4 h-4"/>System Health</h3>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-center"><div className="text-[24px] font-semibold">{stats.totalComplaints}</div><div className="text-[11px] uppercase tracking-widest text-slate-500 mt-1">Total Tickets</div></div>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center"><div className="text-[24px] font-semibold text-emerald-700">{stats.totalComplaints ? Math.round((stats.completedComplaints / stats.totalComplaints) * 100) : 0}%</div><div className="text-[11px] uppercase tracking-widest text-slate-500 mt-1">Completion Rate</div></div>
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-center"><div className="text-[24px] font-semibold text-blue-700">{stats.totalRatings}</div><div className="text-[11px] uppercase tracking-widest text-slate-500 mt-1">Ratings</div></div>
                </div>
                <div className="mt-6 rounded-xl bg-slate-900 text-white p-5">
                  <div className="flex items-center gap-2"><Shield className="w-4 h-4"/><span className="text-[13px] font-semibold">Security Status</span><span className="ml-auto px-2 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-semibold">All Secure</span></div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-[11px]">
                    <div className="rounded-lg bg-white/10 p-3"><div className="opacity-60">JWT Auth</div><div className="font-semibold mt-1">Active • 7d expiry</div></div>
                    <div className="rounded-lg bg-white/10 p-3"><div className="opacity-60">RBAC</div><div className="font-semibold mt-1">Enforced • Backend</div></div>
                    <div className="rounded-lg bg-white/10 p-3"><div className="opacity-60">Worker Code</div><div className="font-semibold mt-1">Env protected</div></div>
                    <div className="rounded-lg bg-white/10 p-3"><div className="opacity-60">One Active Rule</div><div className="font-semibold mt-1">DB enforced</div></div>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] bg-white border border-slate-200 p-6">
                <h3 className="text-[14px] font-semibold flex items-center gap-2"><Activity className="w-4 h-4"/>Recent Activity</h3>
                <div className="mt-4 space-y-2.5 max-h-320px overflow-auto">
                  {activities.slice(0, 8).map((a) => (<div key={a.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-semibold shrink-0">{a.user?.name?.[0] || "S"}</div>
                      <div className="flex-1 min-w-0"><div className="text-[12px] font-medium truncate">{a.user?.name || "System"} • {a.action}</div><div className="text-[11px] text-slate-500 truncate">{a.metadata?.ticketId || ""} • {new Date(a.createdAt).toLocaleTimeString()}</div></div>
                    </div>))}
                </div>
              </div>
            </div>
          </>)}

        {tab === "users" && (<div className="rounded-[20px] bg-white border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100"><h3 className="text-[15px] font-semibold">Students / Users ({users.filter(u => u.role === "student").length})</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-widest font-semibold text-slate-500"><tr><th className="px-6 py-3">User</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Joined</th><th className="px-6 py-3">Complaints</th><th className="px-6 py-3">Active</th><th className="px-6 py-3">Completed</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {users.filter(u => u.role === "student").map((u) => (<tr key={u.id} className="hover:bg-slate-50"><td className="px-6 py-3.5"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[12px] font-semibold">{u.name[0]}</div><span className="text-[13px] font-medium">{u.name}</span></div></td><td className="px-6 py-3.5 text-[13px] text-slate-600">{u.email}</td><td className="px-6 py-3.5 text-[12px] text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td><td className="px-6 py-3.5 text-[13px]">{u.totalComplaints}</td><td className="px-6 py-3.5"><span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[11px] font-medium">{u.activeComplaints}</span></td><td className="px-6 py-3.5"><span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-medium">{u.completedComplaints}</span></td></tr>))}
                </tbody>
              </table>
            </div>
          </div>)}

        {tab === "workers" && (<div className="rounded-[20px] bg-white border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100"><h3 className="text-[15px] font-semibold">Workers ({workers.length}) • Performance Overview</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-widest font-semibold text-slate-500"><tr><th className="px-6 py-3">Worker</th><th className="px-6 py-3">Specialization</th><th className="px-6 py-3">Availability</th><th className="px-6 py-3">Rating</th><th className="px-6 py-3">Completed</th><th className="px-6 py-3">Rejected</th><th className="px-6 py-3">Response</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {workers.map((w) => (<tr key={w.id} className="hover:bg-slate-50"><td className="px-6 py-3.5"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[12px] font-semibold">{w.name[0]}</div><div><div className="text-[13px] font-medium">{w.name}</div><div className="text-[11px] text-slate-500">{w.email}</div></div></div></td><td className="px-6 py-3.5 text-[13px]">{w.specialization}</td><td className="px-6 py-3.5"><span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${w.availability === "available" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : w.availability === "busy" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}>{w.availability}</span></td><td className="px-6 py-3.5 text-[13px] font-medium">⭐ {w.ratingAvg} ({w.ratingCount})</td><td className="px-6 py-3.5 text-[13px]">{w.completedRequests}</td><td className="px-6 py-3.5 text-[13px]">{w.rejectedRequests}</td><td className="px-6 py-3.5 text-[13px]">{w.responseTimeAvg}m</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>)}

        {tab === "complaints" && (<div className="rounded-[20px] bg-white border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between"><h3 className="text-[15px] font-semibold">All Complaints ({complaints.length})</h3><div className="flex gap-2"><span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px]">{complaints.filter(c => c.status === "pending").length} pending</span><span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px]">{complaints.filter(c => c.status === "completed").length} completed</span></div></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-widest font-semibold text-slate-500"><tr><th className="px-6 py-3">Ticket</th><th className="px-6 py-3">Student</th><th className="px-6 py-3">Worker</th><th className="px-6 py-3">Category</th><th className="px-6 py-3">Urgency</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Created</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.slice(0, 50).map((c) => (<tr key={c.id} className="hover:bg-slate-50"><td className="px-6 py-3.5 font-mono text-[12px] font-medium">{c.ticketId}</td><td className="px-6 py-3.5 text-[13px]">{c.student?.name}</td><td className="px-6 py-3.5 text-[13px]">{c.worker?.name || "—"}</td><td className="px-6 py-3.5 text-[13px]">{c.category}</td><td className="px-6 py-3.5"><span className={`px-2 py-1 rounded-full text-[11px] font-medium ${c.urgency === "emergency" ? "bg-red-50 text-red-700" : c.urgency === "urgent" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-600"}`}>{c.urgency}</span></td><td className="px-6 py-3.5"><span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${c.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : c.status === "accepted" ? "bg-blue-50 text-blue-700 border-blue-100" : c.status === "rejected" ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>{c.status}</span></td><td className="px-6 py-3.5 text-[12px] text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>)}

        {tab === "activity" && (<div className="rounded-[20px] bg-white border border-slate-200 p-6">
            <h3 className="text-[15px] font-semibold">System Activity & Login Monitoring (100 recent)</h3>
            <div className="mt-6 space-y-2 max-h-700px overflow-auto">
              {activities.map((a) => (<div key={a.id} className="flex gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-semibold shrink-0">{a.user?.name?.[0] || "?"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-[13px] font-semibold">{a.user?.name || "Unknown"}</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${a.user?.role === "admin" ? "bg-violet-50 text-violet-700" : a.user?.role === "worker" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>{a.user?.role || "system"}</span><span className="text-[12px] text-slate-600">{a.action}</span></div>
                    <div className="text-[11px] text-slate-500 mt-1">{a.metadata ? JSON.stringify(a.metadata).slice(0, 120) : ""} • {new Date(a.createdAt).toLocaleString()}</div>
                  </div>
                </div>))}
            </div>
          </div>)}
      </div>
    </DashboardLayout>);
}
