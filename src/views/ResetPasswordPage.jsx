import { apiFetch } from "@/lib/api";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "@/lib/router";
import {Link} from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/Toaster";
function ResetContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirm) {
            toast("Passwords do not match", "error");
            return;
        }
        setLoading(true);
        try {
            const res = await apiFetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, email, newPassword }),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error);
            toast("Password reset successful. Please login.", "success");
            router.push("/login");
        }
        catch (err) {
            toast(err.message, "error");
        }
        finally {
            setLoading(false);
        }
    };
    if (!token || !email) {
        return (<div className="rounded-[20px] bg-white border border-slate-200 p-8 max-w-420px text-center mx-auto">
        <h1 className="text-[20px] font-semibold">Invalid reset link</h1>
        <p className="mt-2 text-[14px] text-slate-600">Token or email missing. Please request a new link.</p>
        <Link to="/forgot-password" className="mt-6 inline-flex px-6 py-3 rounded-xl bg-slate-900 text-white text-[14px] font-medium">Request new link</Link>
      </div>);
    }
    return (<div className="w-full max-w-420px">
      <div className="rounded-24px bg-white border border-slate-200 shadow-[0_16px_40px_rgba(0,0,0,0.06)] p-8">
        <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center mb-6"><Shield className="w-5 h-5 text-white"/></div>
        <h1 className="text-[24px] font-semibold tracking-tight">Reset password</h1>
        <p className="mt-2 text-[14px] text-slate-600">For {email}. Token expires in 1 hour and becomes invalid after use.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-[13px] font-medium">New password</label>
            <div className="relative mt-1.5">
              <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type={show ? "text" : "password"} required placeholder="••••••••" className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-50 border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-900"/>
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2">{show ? <EyeOff className="w-4 h-4 text-slate-500"/> : <Eye className="w-4 h-4 text-slate-500"/>}</button>
            </div>
          </div>
          <div>
            <label className="text-[13px] font-medium">Confirm new password</label>
            <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type={show ? "text" : "password"} required placeholder="••••••••" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-900"/>
          </div>
          <button disabled={loading} className="w-full px-6 py-3 rounded-xl bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 disabled:opacity-60">{loading ? "Resetting..." : "Reset password"}</button>
        </form>
      </div>
    </div>);
}
export default function ResetPasswordPage() {
    return (<div className="min-h-screen bg-[#fcfcf9] flex items-center justify-center p-6">
      <Suspense fallback={<div className="h-96 w-420px bg-white rounded-[20px] animate-pulse"/>}>
        <ResetContent />
      </Suspense>
    </div>);
}
