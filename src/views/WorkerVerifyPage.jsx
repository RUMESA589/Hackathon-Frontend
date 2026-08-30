import { apiFetch } from "@/lib/api";
import { useState, useEffect } from "react";
import { useAuth } from "@/controllers/AuthController";
import { useRouter } from "@/lib/router";
import { Shield, Lock, ArrowRight } from "lucide-react";
import { toast } from "@/components/Toaster";
import {Link} from "react-router-dom";
export default function WorkerVerifyPage() {
    const { user, loading } = useAuth();
    const [code, setCode] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
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
    const handleVerify = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await apiFetch("/api/workers/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ secretCode: code }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error);
            toast("Worker verified successfully", "success");
            router.push("/worker/dashboard");
        }
        catch (err) {
            toast(err.message, "error");
        }
        finally {
            setSubmitting(false);
        }
    };
    if (loading)
        return <div className="min-h-screen bg-[#fcfcf9] flex items-center justify-center">Loading...</div>;
    return (<div className="min-h-screen bg-[#fcfcf9] flex">
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center"><Shield className="w-5 h-5 text-white"/></div>
            <div className="leading-none"><div className="font-semibold text-[16px] tracking-tight">Campus Rescue</div><div className="text-[10px] uppercase tracking-[0.14em] font-medium text-slate-500">Worker Verification</div></div>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-420px">
            <div className="rounded-24px bg-white border border-slate-200 shadow-[0_16px_40px_rgba(0,0,0,0.06)] p-8">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto"><Lock className="w-7 h-7 text-white"/></div>
              <h1 className="mt-6 text-center text-[22px] font-semibold tracking-tight">Worker Verification</h1>
              <p className="mt-2 text-center text-[13px] leading-1.1 text-slate-600">This is a secure step. Enter the secret worker code provided by administration. Try <b>RescueWorker00</b>.</p>

              <form onSubmit={handleVerify} className="mt-8 space-y-5">
                <div>
                  <label className="text-[13px] font-medium">Secret Worker Code</label>
                  <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter the worker code" required className="mt-1.5 w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-slate-900"/>
                </div>

                <div className="rounded-xl bg-blue-50 border border-blue-100 p-3.5">
                  <div className="text-[12px] font-semibold text-blue-900">Why this step?</div>
                  <div className="text-[11px] leading-1.1 text-blue-800 mt-1">Workers handle real campus operations. Secret code ensures only authorized personnel access the worker dashboard and can accept/reject requests.</div>
                </div>

                <button disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 disabled:opacity-60 shadow-[0_4px_12px_rgba(15,23,42,0.2)]">
                  {submitting ? "Verifying..." : <>Verify & Continue <ArrowRight className="w-4 h-4"/></>}
                </button>
              </form>

              <div className="mt-6 text-center text-[12px] text-slate-500">Having trouble? Contact your campus administrator</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden p-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_20%,rgba(59,130,246,0.18),transparent),radial-gradient(40%_50%_at_20%_80%,rgba(16,185,129,0.15),transparent)]"/>
        <div className="relative flex flex-col justify-between h-full w-full max-w-440px mx-auto">
          <div />
          <div>
            <h2 className="text-[32px] font-700 leading-[0.9] tracking-[-0.02em] text-white">Secure worker access. No shortcuts.</h2>
            <p className="mt-4 text-[14px] leading-[1.6] text-white/60">Secret code is stored in Our Database</p>
            <div className="mt-8 space-y-3">
              {[
            "Backend validation only",
            "No code in React bundle",
            "JWT + role middleware",
            "Activity logging enabled",
        ].map((f) => (<div key={f} className="flex items-center gap-2.5 text-[13px] text-white/80"><div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"><Shield className="w-3 h-3 text-white"/></div>{f}</div>))}
            </div>
          </div>
          <div className="text-[12px] text-white/40">Campus Rescue • Worker Ops v2.4</div>
        </div>
      </div>
    </div>);
}
