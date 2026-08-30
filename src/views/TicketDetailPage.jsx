import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "@/lib/router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/controllers/AuthController";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Star, User, Trash2, Edit2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import {Link} from "react-router-dom";
import { toast } from "@/components/Toaster";
export default function TicketDetailPage() {
    const { id } = useParams();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [complaint, setComplaint] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [submittingRating, setSubmittingRating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editDesc, setEditDesc] = useState("");
    const fetchComplaint = async () => {
        try {
            const res = await apiFetch(`/api/complaints/${id}`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setComplaint(data.complaint);
                setEditDesc(data.complaint.description);
            }
            else {
                toast("Ticket not found", "error");
                router.push("/dashboard");
            }
        }
        catch { }
        finally {
            setFetching(false);
        }
    };
    useEffect(() => {
        if (!loading && !user)
            router.push("/login");
        if (id)
            fetchComplaint();
        const interval = setInterval(() => { if (id)
            fetchComplaint(); }, 4000);
        return () => clearInterval(interval);
    }, [id, user, loading]);
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this request?"))
            return;
        try {
            const res = await apiFetch(`/api/complaints/${id}`, { method: "DELETE", credentials: "include" });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error);
            toast("Request deleted", "success");
            router.push("/dashboard");
        }
        catch (err) {
            toast(err.message, "error");
        }
    };
    const handleEdit = async () => {
        try {
            const res = await apiFetch(`/api/complaints/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: editDesc }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error);
            setComplaint(data.complaint);
            setEditing(false);
            toast("Updated successfully", "success");
        }
        catch (err) {
            toast(err.message, "error");
        }
    };
    const handleRating = async () => {
        if (rating === 0) {
            toast("Select a rating", "error");
            return;
        }
        setSubmittingRating(true);
        try {
            const res = await apiFetch("/api/ratings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ complaintId: id, rating, feedback }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error);
            toast("Rating submitted", "success");
            fetchComplaint();
        }
        catch (err) {
            toast(err.message, "error");
        }
        finally {
            setSubmittingRating(false);
        }
    };
    if (loading || fetching) {
        return <DashboardLayout role="student"><div className="animate-pulse h-96 bg-slate-200 rounded-[20px]"/></DashboardLayout>;
    }
    if (!complaint)
        return null;
    const statusColor = complaint.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : complaint.status === "accepted" ? "bg-blue-50 text-blue-700 border-blue-100" : complaint.status === "rejected" ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100";
    return (<DashboardLayout role="student">
      <div className="max-w-900px mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50"><ArrowLeft className="w-4 h-4"/></Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-[22px] font-semibold tracking-tight">{complaint.ticketId}</h1>
              <span className={`px-3 py-1 rounded-full text-[12px] font-semibold border ${statusColor}`}>{complaint.status}</span>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase ${complaint.urgency === "emergency" ? "bg-red-100 text-red-700" : complaint.urgency === "urgent" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}>{complaint.urgency}</span>
            </div>
            <p className="text-[13px] text-slate-500 mt-1">{complaint.category} • Created {new Date(complaint.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            {["pending"].includes(complaint.status) && <button onClick={() => setEditing(!editing)} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50"><Edit2 className="w-4 h-4"/></button>}
            {["pending", "rejected"].includes(complaint.status) && <button onClick={handleDelete} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-red-50 text-slate-600 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.5fr_0.9fr] gap-6">
          <div className="space-y-6">
            <div className="rounded-[20px] bg-white border border-slate-200 p-6">
              <h3 className="text-[14px] font-semibold">Request Details</h3>
              <div className="mt-5 space-y-4">
                <div className="flex gap-3"><MapPin className="w-4 h-4 text-slate-400 mt-0.5"/><div><div className="text-[12px] text-slate-500 uppercase tracking-widest font-semibold">Location</div><div className="text-[14px] font-medium mt-1">{complaint.location}</div></div></div>
                <div><div className="text-[12px] text-slate-500 uppercase tracking-widest font-semibold">Description</div>{editing ? <div className="mt-2"><textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[14px]"/><div className="mt-3 flex gap-2"><button onClick={handleEdit} className="px-4 py-2 rounded-full bg-slate-900 text-white text-[13px] font-medium">Save</button><button onClick={() => setEditing(false)} className="px-4 py-2 rounded-full bg-white border border-slate-200 text-[13px]">Cancel</button></div></div> : <div className="mt-2 text-[14px] leading-[1.6] text-slate-700">{complaint.description}</div>}</div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div><div className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">Category</div><div className="text-[13px] font-medium mt-1">{complaint.category}</div></div>
                  <div><div className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">Priority</div><div className="text-[13px] font-medium mt-1">{complaint.priority} • {complaint.urgency}</div></div>
                </div>
              </div>
            </div>

            <div className="rounded-[20px] bg-white border border-slate-200 p-6">
              <h3 className="text-[14px] font-semibold">Status Timeline</h3>
              <div className="mt-6 space-y-4 relative">
                <div className="absolute left-11px top-2 bottom-2 w-px bg-slate-200"/>
                {[
            { label: "Request Submitted", time: complaint.createdAt, done: true, icon: Clock },
            { label: "Worker Assigned", time: complaint.acceptedAt, done: !!complaint.acceptedAt, icon: User, extra: complaint.worker?.name },
            { label: complaint.status === "rejected" ? "Request Rejected" : "Request Accepted", time: complaint.acceptedAt || complaint.rejectedAt, done: !!(complaint.acceptedAt || complaint.rejectedAt), icon: complaint.status === "rejected" ? XCircle : CheckCircle },
            { label: "Completed", time: complaint.completedAt, done: !!complaint.completedAt, icon: CheckCircle },
        ].map((s, i) => (<div key={i} className="relative flex gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${s.done ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-400"}`}><s.icon className="w-3 h-3"/></div>
                    <div className="flex-1 pb-4"><div className={`text-[13px] font-medium ${s.done ? "text-slate-900" : "text-slate-400"}`}>{s.label} {s.extra ? `• ${s.extra}` : ""}</div>{s.time && <div className="text-[11px] text-slate-500 mt-1">{new Date(s.time).toLocaleString()}</div>}</div>
                  </div>))}
              </div>
            </div>

            {complaint.status === "completed" && !complaint.rating && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[20px] bg-slate-900 text-white p-6">
                <h3 className="text-[15px] font-semibold">Rate your experience</h3>
                <p className="text-[13px] text-white/70 mt-1">Only you can rate this worker for this complaint. One rating per completed request.</p>
                <div className="mt-5 flex gap-2">{[1, 2, 3, 4, 5].map((s) => <button key={s} onClick={() => setRating(s)} className={`w-11 h-11 rounded-xl border flex items-center justify-center transition ${rating >= s ? "bg-white text-slate-900 border-white" : "bg-white/10 border-white/20 text-white/60 hover:bg-white/20"}`}><Star className={`w-5 h-5 ${rating >= s ? "fill-slate-900" : ""}`}/></button>)}</div>
                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Optional feedback..." rows={3} className="mt-4 w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 text-[14px] focus:outline-none focus:ring-2 focus:ring-white/20"/>
                <button onClick={handleRating} disabled={submittingRating || rating === 0} className="mt-4 px-6 py-2.5 rounded-full bg-white text-slate-900 text-[13px] font-semibold disabled:opacity-50 hover:bg-slate-100 transition">{submittingRating ? "Submitting..." : "Submit Rating"}</button>
              </motion.div>)}

            {complaint.rating && (<div className="rounded-[20px] bg-emerald-50 border border-emerald-100 p-6">
                <h3 className="text-[14px] font-semibold text-emerald-900">You rated this experience</h3>
                <div className="mt-3 flex items-center gap-1">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-5 h-5 ${s <= complaint.rating.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}/>)}<span className="ml-2 text-[14px] font-semibold">{complaint.rating.rating}/5</span></div>
                {complaint.rating.feedback && <p className="mt-3 text-[13px] leading-1.5 text-emerald-800">{complaint.rating.feedback}</p>}
              </div>)}
          </div>

          <div className="space-y-6">
            {complaint.worker ? (<div className="rounded-[20px] bg-white border border-slate-200 p-6">
                <h3 className="text-[14px] font-semibold">Assigned Worker</h3>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">{complaint.worker.name[0]}</div>
                  <div><div className="text-[14px] font-semibold">{complaint.worker.name}</div><div className="text-[12px] text-slate-600">{complaint.worker.specialization} • ⭐ {complaint.worker.ratingAvg} • {complaint.worker.ratingCount || 0} ratings</div></div>
                </div>
                {complaint.worker.bio && <p className="mt-4 text-[13px] leading-1.5 text-slate-600">{complaint.worker.bio}</p>}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3"><div className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">Completed</div><div className="text-[14px] font-semibold mt-1">{complaint.worker.completedRequests || 0}</div></div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3"><div className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">Availability</div><div className="text-[13px] font-medium mt-1 capitalize">{complaint.worker.availability}</div></div>
                </div>
              </div>) : (<div className="rounded-[20px] bg-amber-50 border border-amber-100 p-6">
                <div className="flex gap-3"><AlertTriangle className="w-5 h-5 text-amber-700 shrink-0"/><div><div className="text-[13px] font-semibold text-amber-900">Awaiting worker assignment</div><div className="text-[12px] text-amber-800 mt-1 leading-1.5">Your request is pending. Workers will see it in real-time without refresh. Average acceptance 4 minutes.</div></div></div>
              </div>)}

            <div className="rounded-[20px] bg-white border border-slate-200 p-6">
              <h3 className="text-[14px] font-semibold">Ticket Information</h3>
              <div className="mt-4 space-y-3 text-[13px]">
                <div className="flex justify-between"><span className="text-slate-500">Ticket ID</span><span className="font-mono font-medium">{complaint.ticketId}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Created</span><span>{new Date(complaint.createdAt).toLocaleString()}</span></div>
                {complaint.acceptedAt && <div className="flex justify-between"><span className="text-slate-500">Accepted</span><span>{new Date(complaint.acceptedAt).toLocaleString()}</span></div>}
                {complaint.completedAt && <div className="flex justify-between"><span className="text-slate-500">Completed</span><span>{new Date(complaint.completedAt).toLocaleString()}</span></div>}
                <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-medium capitalize">{complaint.status}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>);
}
