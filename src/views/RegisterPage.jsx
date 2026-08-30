import { useState } from "react";
import {Link} from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/controllers/AuthController";
import { toast } from "@/components/Toaster";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { useRouter } from "@/lib/router";
export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();
    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast("Passwords do not match", "error");
            return;
        }
        setLoading(true);
        try {
            await register(name, email, password, confirmPassword);
            toast("Account created successfully", "success");
            router.push("/dashboard");
        }
        catch (err) {
            toast(err.message, "error");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-[#fcfcf9] flex">
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center"><Shield className="w-5 h-5 text-white"/></div>
            <div className="leading-none"><div className="font-semibold text-[16px] tracking-tight">Campus Rescue</div><div className="text-[10px] uppercase tracking-[0.14em] font-medium text-slate-500">Operations Platform</div></div>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-440px">
            <div className="mb-8">
              <h1 className="text-[32px] font-700 tracking-[-0.02em] leading-[0.95]">Create account</h1>
              <p className="mt-3 text-[15px] leading-1.1 text-slate-600">Join the campus operations platform. Only student signup is allowed. Worker & admin roles are backend-controlled.</p>
            </div>

            <div className="rounded-[20px] bg-white border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-7">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-[13px] font-medium text-slate-700">Full name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Alex Johnson" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"/>
                </div>
                <div>
                  <label className="text-[13px] font-medium text-slate-700">University email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@university.edu" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[13px] font-medium text-slate-700">Password</label>
                    <div className="relative mt-1.5">
                      <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? "text" : "password"} required placeholder="••••••••" className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-900"/>
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPass ? <EyeOff className="w-4 h-4 text-slate-500"/> : <Eye className="w-4 h-4 text-slate-500"/>}</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-slate-700">Confirm</label>
                    <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type={showPass ? "text" : "password"} required placeholder="••••••••" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-900"/>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] leading-1.2 text-slate-600">
                  <span className="font-semibold text-slate-900">Important Note:</span> <b> You can enter your email in university email input. </b>
                </div>

                <button disabled={loading} className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 transition disabled:opacity-60 shadow-[0_4px_12px_rgba(15,23,42,0.2)]">
                  {loading ? "Creating..." : <>Create Account <ArrowRight className="w-4 h-4"/></>}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200"/><span className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">Or</span><div className="h-px flex-1 bg-slate-200"/></div>

              <GoogleAuthButton />

              <div className="mt-6 text-center text-[13px] text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-slate-900 hover:underline">Sign in</Link></div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden p-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_20%,rgba(59,130,246,0.18),transparent),radial-gradient(40%_50%_at_20%_80%,rgba(16,185,129,0.15),transparent)]"/>
        <div className="relative flex flex-col justify-between h-full w-full max-w-480px mx-auto">
          <div />
          <div>
            <h2 className="text-[36px] font-700 leading-[0.9] tracking-[-0.02em] text-white">One active request. Enforced by backend.</h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-white/60">Students can only have one active complaint at a time. Prevents spam, ensures priority handling, and keeps operations clean.</p>
            <div className="mt-8 space-y-3">
              {[
            { title: "Pending → Accepted → Completed", desc: "Clear status workflow with notifications" },
            { title: "Real-time worker dispatch", desc: "No manual refresh needed, Socket-like polling" },
            { title: "Rating locked to complaint", desc: "Only rater who received service can rate" },
        ].map((f) => (<div key={f.title} className="flex gap-3 rounded-xl bg-white/0.06 border border-white/0.08 p-4">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><Shield className="w-4 h-4 text-white"/></div>
                  <div><div className="text-[13px] font-semibold text-white">{f.title}</div><div className="text-[12px] text-white/60 mt-1 leading-[1.4]">{f.desc}</div></div>
                </div>))}
            </div>
          </div>
          <div className="text-[12px] text-white/40">Campus Rescue • Secure by design</div>
        </div>
      </div>
    </div>);
}
