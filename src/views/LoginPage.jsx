import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/controllers/AuthController";
import { toast } from "@/components/Toaster";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { useRouter } from "@/lib/router";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, role);
      toast("Login successful", "success");
      if (role === "student")
        router.push("/dashboard");
      else if (role === "worker")
        router.push("/worker/verify");
      else
        router.push("/admin/dashboard");
    }
    catch (err) {
      toast(err.message || "Login failed", "error");
    }
    finally {
      setLoading(false);
    }
  };
  return (<div className="min-h-screen bg-[#fcfcf9] flex">
    <div className="flex-1 flex flex-col">
      <div className="p-6">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
          <div className="leading-none"><div className="font-semibold text-[16px] tracking-tight">Campus Rescue</div>
            <div className="text-[10px] uppercase tracking-[0.14em] font-medium text-slate-500">Operations Platform</div></div>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-420px">
          <div className="mb-8 space-y-3">
            <h1 className="text-[32px] font-700 tracking-[-0.02em] leading-[1.1]">Welcome back</h1>
            <p className="mt-3 text-[15px] leading-1.4 text-slate-600">Sign in to your campus operations account. Role verification is enforced <br />
              by backend.</p>
          </div>

          <div className="rounded-[20px] bg-white border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-7">
            <div className="grid grid-cols-3 gap-2 p-1 rounded-full bg-slate-50 border border-slate-100 mb-6">
              {[
                { id: "student", label: "Student" },
                { id: "worker", label: "Worker" },
                { id: "admin", label: "Admin" },
              ].map((r) => (<button key={r.id} onClick={() => setRole(r.id)} className={`px-3 py-2 rounded-full text-[13px] font-medium transition ${role === r.id ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900"}`}>{r.label}</button>))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[13px] font-medium text-slate-700">Email address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@university.edu" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition" />
              </div>
              <div>
                <div className="flex items-center justify-between"><label className="text-[13px] font-medium text-slate-700">Password</label><Link to="/forgot-password" className="text-[12px] font-medium text-slate-500 hover:text-slate-900">Forgot?</Link></div>
                <div className="relative mt-1.5">
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? "text" : "password"} required placeholder="••••••••" className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-50 border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-100">{showPass ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-500" />}</button>
                </div>
              </div>

              <button disabled={loading} className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 transition disabled:opacity-60 shadow-[0_4px_12px_rgba(15,23,42,0.2)]">
                {loading ? "Signing in..." : <>Continue <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">Or</span><div className="h-px flex-1 bg-slate-200" /></div>

            <GoogleAuthButton />

            <div className="mt-6 text-center text-[13px] text-slate-600">Don't have an account? <Link to="/register" className="font-semibold text-slate-900 hover:underline">Create account</Link></div><div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-3.5"><div className="text-[12px] font-semibold text-slate-900">Use your registered account</div><div className="mt-2 text-[11px] text-slate-600 leading-1.5">Your credentials and role are checked against the live MongoDB database.</div></div>
          </div>
        </motion.div>
      </div>
    </div>

    <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden p-10">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_20%,rgba(59,130,246,0.18),transparent),radial-gradient(40%_50%_at_20%_80%,rgba(16,185,129,0.15),transparent)]" />
      <div className="relative flex flex-col justify-between h-full w-full max-w-480px mx-auto">
        <div />
        <div>
          <h2 className="mt-6 text-[36px] font-700 leading-[0.9] tracking-[-0.02em] text-white">To access the other dashboards</h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-white/60">Try these emails and passwords:</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { k: "Admin Email", v: "admin@gmail.com" },
              { k: "Admin Password", v: "Admin@12345" },
              { k: "Worker Email", v: "worker@gmail.com" },
              { k: "Worker Password", v: "Worker@12345" },
            ].map((s) => (<div key={s.k} className="rounded-xl bg-white/0.06 border border-white/0.08 p-3.5"><div className="text-[13px] font-semibold text-white">{s.k}</div><div className="text-[11px] text-white/60 mt-1">{s.v}</div></div>))}
          </div>
        </div>
        <div>
          <div className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white text-[11px] font-semibold uppercase tracking-widest">Secure Access</div>
          <h2 className="mt-6 text-[36px] font-700 leading-[0.9] tracking-[-0.02em] text-white">Role-based authorization. Backend
            enforced.</h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-white/60">Selecting a role doesn't grant access. Your actual role stored in database is verified on every request.</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { k: "JWT", v: "Secure sessions" },
              { k: "bcrypt", v: "Hashed passwords" },
            ].map((s) => (<div key={s.k} className="rounded-xl bg-white/0.06 border border-white/0.08 p-3.5"><div className="text-[13px] font-semibold text-white">{s.k}</div><div className="text-[11px] text-white/60 mt-1">{s.v}</div></div>))}
          </div>
        </div>

        <div className="text-[12px] text-white/40">Campus Rescue • Operations Platform v2.4</div>
      </div>
    </div>
  </div>);
}
