import { apiFetch } from "@/lib/api";
import { useState } from "react";
import {Link} from "react-router-dom";
import { Shield, ArrowLeft, Mail } from "lucide-react";
import { toast } from "@/components/Toaster";
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
        const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiFetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error);
            setSent(true);
                        toast("If the account exists, a reset email has been sent", "success");
        }
        catch (err) {
            toast(err.message, "error");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-[#fcfcf9] flex items-center justify-center p-6">
      <div className="w-full max-w-420px">
        <Link to="/login" className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600 hover:text-slate-900 mb-8"><ArrowLeft className="w-4 h-4"/>Back to login</Link>

        <div className="rounded-24px bg-white border border-slate-200 shadow-[0_16px_40px_rgba(0,0,0,0.06)] p-8">
          <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center mb-6"><Shield className="w-5 h-5 text-white"/></div>
          <h1 className="text-[24px] font-semibold tracking-tight">Forgot password?</h1>
          <p className="mt-2 text-[14px] leading-1.5 text-slate-600">Enter your email and we'll send a secure password reset link.</p>

          {!sent ? (<form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-[13px] font-medium">Email address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="you@university.edu" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-900"/>
              </div>
              <button disabled={loading} className="w-full px-6 py-3 rounded-xl bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 disabled:opacity-60">{loading ? "Sending..." : "Send reset link"}</button>
            </form>) : (<div className="mt-6 space-y-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 flex gap-3">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0"/>
                <div><div className="text-[13px] font-semibold text-emerald-900">Reset email sent</div><div className="text-[12px] text-emerald-700 mt-1 leading-1.5">If the account exists, check the email inbox for the reset link.</div></div>
              </div>

              <button onClick={() => setSent(false)} className="w-full px-6 py-3 rounded-xl bg-white border border-slate-200 text-[14px] font-medium">Send another</button>
            </div>)}
        </div>
      </div>
    </div>);
}
