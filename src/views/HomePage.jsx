import { Navbar } from "@/components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Clock, Users, Star, MapPin, Zap, FileText, Wrench, Package, Presentation, ArrowRight, CheckCircle, Award, TrendingUp, Layers, GraduationCap, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { CATEGORY_DETAILS } from "@/lib/constants";
function Reveal({ children, delay = 0, className = "" }) {
  return (<motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }} className={className}>
    {children}
  </motion.div>);
}
export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (<div className="min-h-screen bg-[#fcfcf9] selection:bg-slate-900 selection:text-white overflow-hidden">
    <Navbar />

    { }
    <section ref={heroRef} className="relative pt-120px pb-20 md:pb-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(15,23,42,0.08),transparent),radial-gradient(40%_40%_at_90%_20%,rgba(59,130,246,0.08),transparent),radial-gradient(35%_35%_at_10%_80%,rgba(16,185,129,0.06),transparent)]" />
        <div className="absolute top-18% left-8% w-320px h-320px rounded-full bg-linear-to-br from-slate-100 to-slate-200 blur-[80px] opacity-60" />
        <div className="absolute top-30% right-10% w-420px h-420px rounded-full bg-linear-to-br from-blue-50 to-indigo-50 blur-[90px] opacity-70" />
      </div>

      <div className="mx-auto max-w-1280px px-6">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-8 items-center">
          <motion.div style={{ y, opacity }} className="relative">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[12px] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live across 12 campus blocks • Avg response 9 min
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-8">
              <h1 className="text-[42px] md:text-[64px] lg:text-[72px] font-[750] leading-[0.9] tracking-[-0.03em] text-slate-900">
                Campus help,
                <br />
                <span className="font-300 italic tracking-[-0.02em]">instantly</span> delivered.
              </h1>
            </Reveal>

            <Reveal delay={0.2} className="mt-6">
              <p className="text-[18px] md:text-[19px] leading-[1.6] text-slate-600 max-w-520px font-[380]">
                The professional operations platform for university life. Request assistance, get matched with verified specialists, track progress in real-time.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/register" className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-900 text-white text-[15px] font-semibold hover:bg-slate-800 transition-all shadow-[0_8px_24px_rgba(15,23,42,0.2)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.28)] hover:-translate-y-0.5">
                Request Campus Help
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="#how-it-works" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-slate-200 text-slate-900 text-[15px] font-medium hover:bg-slate-50 transition shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center">
                  <span className="w-0 h-0 border-l-[5px] border-l-white border-y-[3px] border-y-transparent ml-0.5" />
                </div>
                See how it works
              </Link>
            </Reveal>

            <Reveal delay={0.4} className="mt-12 grid grid-cols-3 gap-6 max-w-420px border-t border-slate-200/70 pt-8">
              {[
                { k: "4.8/5", v: "Avg rating" },
                { k: "2.4k+", v: "Requests solved" },
                { k: "9 min", v: "Avg response" },
              ].map((s) => (<div key={s.v}>
                <div className="text-[22px] font-semibold tracking-tight text-slate-900">{s.k}</div>
                <div className="text-[12px] font-medium text-slate-500 uppercase tracking-widest mt-1">{s.v}</div>
              </div>))}
            </Reveal>
          </motion.div>

          <Reveal delay={0.25} className="relative lg:h-640px">
            <div className="relative h-full rounded-32px bg-white border border-slate-200 shadow-[0_24px_64px_rgba(15,23,42,0.08),0_0_0_1px_rgba(15,23,42,0.04)] overflow-hidden p-2">
              <div className="h-full rounded-24px bg-[#f8fafc] border border-slate-100 overflow-hidden relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size:32px_32px opacity-[0.3]" />

                <div className="relative p-6 md:p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div>
                      <span className="text-[13px] font-semibold tracking-tight">Live Operations</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-semibold uppercase tracking-widest">Active</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="mt-8 space-y-3">
                    {[
                      { id: "CR-7K9P2X", cat: "Tech Rescue", loc: "CS Lab Block A", urgency: "urgent", time: "2m ago", status: "accepted", worker: "Roma F." },
                      { id: "CR-3M8Q1Z", cat: "Campus Delivery", loc: "Library → Hostel 4", urgency: "normal", time: "5m ago", status: "pending", worker: "Pending" },
                      { id: "CR-9L2W4A", cat: "Electrical", loc: "Seminar Hall 2", urgency: "emergency", time: "8m ago", status: "completed", worker: "Mehdi." },
                    ].map((t, i) => (<motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.12 }} className="group rounded-2xl bg-white border border-slate-200 p-4 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-semibold tracking-wide text-slate-500">{t.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${t.urgency === "emergency" ? "bg-red-50 text-red-600 border-red-100" : t.urgency === "urgent" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-slate-50 text-slate-600 border-slate-200"}`}>{t.urgency}</span>
                          </div>
                          <div className="mt-1.5 text-[14px] font-semibold text-slate-900">{t.cat}</div>
                          <div className="mt-1 flex items-center gap-1.5 text-[12px] text-slate-500"><MapPin className="w-3 h-3" />{t.loc}</div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${t.status === "accepted" ? "bg-blue-50 text-blue-700" : t.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{t.status}</div>
                      </div>
                      <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-[11px] text-slate-500">{t.time} • {t.worker}</span>
                        <span className="text-[11px] font-medium text-slate-900 group-hover:gap-1.5 flex items-center gap-1 transition-all">View <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </motion.div>))}
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="rounded-2xl bg-slate-900 text-white p-5">
                      <div className="flex items-center justify-between">
                        <div className="text-[13px] font-medium opacity-80">Campus Coverage</div>
                        <div className="text-[11px] px-2 py-1 rounded-full bg-white/10">12 blocks</div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        {[
                          { label: "Academic", val: "4" },
                          { label: "Hostels", val: "6" },
                          { label: "Labs", val: "12" },
                        ].map((c) => (<div key={c.label} className="rounded-xl bg-white/0.08 border border-white/0.08 p-3">
                          <div className="text-[18px] font-semibold">{c.val}</div>
                          <div className="text-[10px] uppercase tracking-widest opacity-60 mt-0.5">{c.label}</div>
                        </div>))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-3 -right-4 rounded-2xl bg-white border border-slate-200 shadow-[0_12px_32px_rgba(0,0,0,0.1)] p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
              <div>
                <div className="text-[13px] font-semibold leading-none">Request Completed</div>
                <div className="text-[11px] text-slate-500 mt-1">CR-9L2W4A • Rated 5★</div>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -bottom-6 -left-6 rounded-2xl bg-white border border-slate-200 shadow-[0_12px_32px_rgba(0,0,0,0.1)] p-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[12px] font-semibold">A</div>
                <div>
                  <div className="text-[12px] font-semibold">Ahmed k.</div>
                  <div className="flex items-center gap-1 mt-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><span className="text-[11px] font-medium">4.9 • 128 jobs</span></div>
                </div>
                <div className="ml-2 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-100">Available</div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>

    { }
    <Reveal className="border-y border-slate-200/70 bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-1280px px-6 py-6 flex flex-wrap items-center justify-between gap-6">
        <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">Trusted by campus operations</div>
        <div className="flex items-center gap-8 flex-wrap">
          {["Academic Block", "Hostel Ops", "Lab Services", "Library Systems", "Admin Wing"].map((b) => (<div key={b} className="flex items-center gap-2 text-[13px] font-medium text-slate-600"><Building2 className="w-4 h-4 opacity-60" />{b}</div>))}
        </div>
      </div>
    </Reveal>

    { }
    <section id="how-it-works" className=" scroll-mt-32 py-24 md:py-32 bg-white relative">
      <div className="mx-auto max-w-1280px px-6">
        <Reveal>
          <div className="max-w-640px">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-semibold uppercase tracking-widest">Workflow</div>
            <h2 className="mt-5 text-[36px] md:text-[48px] font-700 leading-[0.95] tracking-[-0.03em]">From request to resolution in minutes, not hours.</h2>
            <p className="mt-4 text-[17px] leading-[1.6] text-slate-600">Designed for real campus urgency. Every step is tracked, prioritized, and notified.</p>
          </div>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Create request", desc: "Select category, urgency, location. Get instantly matched with verified specialists.", icon: FileText, color: "bg-blue-50 border-blue-100 text-blue-600" },
            { step: "02", title: "Worker accepts", desc: "Real-time notification. No refresh needed. Worker prioritizes by urgency & timing.", icon: Zap, color: "bg-amber-50 border-amber-100 text-amber-600" },
            { step: "03", title: "Completed & rated", desc: "Work marked complete, you get notified, rate the experience. Performance tracked.", icon: Award, color: "bg-emerald-50 border-emerald-100 text-emerald-600" },
          ].map((s, i) => (<Reveal key={s.step} delay={i * 0.1}>
            <div className="group relative rounded-24px bg-[#fcfcf9] border border-slate-200 p-8 hover:bg-white hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${s.color}`}><s.icon className="w-6 h-6" /></div>
                <span className="text-[13px] font-mono font-semibold tracking-widest text-slate-400">{s.step}</span>
              </div>
              <h3 className="mt-6 text-[20px] font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-[14px] leading-[1.6] text-slate-600">{s.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-[13px] font-medium text-slate-900">Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" /></div>
            </div>
          </Reveal>))}
        </div>

        <Reveal delay={0.2} className="mt-16 grid md:grid-cols-4 gap-4">
          {[
            { icon: Clock, label: "Avg response", value: "9 minutes", sub: "Across all categories" },
            { icon: Users, label: "Active workers", value: "24 specialists", sub: "Verified & rated" },
            { icon: Shield, label: "One active rule", value: "Enforced", sub: "Backend validated" },
            { icon: TrendingUp, label: "Completion rate", value: "94.2%", sub: "Last 30 days" },
          ].map((stat) => (<div key={stat.label} className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center"><stat.icon className="w-5 h-5 text-slate-700" /></div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-widest text-slate-500">{stat.label}</div>
              <div className="text-[16px] font-semibold tracking-tight mt-0.5">{stat.value}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</div>
            </div>
          </div>))}
        </Reveal>
      </div>
    </section>

    { }
    <section id="categories" className="scroll-mt-32   py-24 md:py-32 bg-[#f8fafc] border-y border-slate-200/70">
      <div className="mx-auto max-w-1280px px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-semibold uppercase tracking-widest">Services</div>
              <h2 className="mt-4 text-[36px] md:text-[48px] font-700 leading-[0.95] tracking-[-0.03em]">Nine categories.<br />One platform.</h2>
            </div>
            <p className="max-w-420px text-[16px] leading-[1.6] text-slate-600">Every campus problem has a specialist. Matched by category, availability, rating, and response time.</p>
          </div>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORY_DETAILS.map((cat, i) => (<Reveal key={cat.id} delay={i * 0.05}>
            <div className="group rounded-24px bg-white border border-slate-200 p-6 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 h-full flex flex-col">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-[22px] ${cat.color}`}>{cat.icon}</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-medium text-slate-600">{cat.workers.length} specialists</span>
                </div>
              </div>
              <h3 className="mt-5 text-[18px] font-semibold tracking-tight">{cat.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-slate-600 line-clamp-2">{cat.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {cat.workers.slice(0, 2).map((w) => (<span key={w} className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600">{w}</span>))}
              </div>
              <Link
                to="/workers"
                className="mt-auto pt-5 flex items-center gap-2 text-[13px] font-medium text-slate-900"
              >
                Explore specialists
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </Reveal>))}
        </div>
      </div>
    </section>

    { }
    <section className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-1280px px-6">
        <Reveal>
          <div className="rounded-32px bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(50%_80%_at_80%_20%,rgba(59,130,246,0.15),transparent),radial-gradient(40%_60%_at_20%_80%,rgba(16,185,129,0.12),transparent)]" />
            <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-0">
              <div className="p-10 md:p-14">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-semibold uppercase tracking-widest">Verified Network</div>
                <h2 className="mt-6 text-[32px] md:text-[44px] font-700 leading-[0.95] tracking-[-0.03em]">Specialists who know every corridor, lab, and shortcut.</h2>
                <p className="mt-4 text-[16px] leading-1.6 text-white/70 max-w-480px">Not random helpers. Verified campus workers with specializations, ratings, response times, and performance history. Ranked by relevance to your problem.</p>

                <div className="mt-10 grid grid-cols-3 gap-4">
                  {[
                    { v: "4.8", l: "Avg rating" },
                    { v: "128", l: "Avg jobs" },
                    { v: "<12m", l: "Response" },
                  ].map((s) => (<div key={s.l} className="rounded-2xl bg-white/6 border border-white/8 p-4">
                    <div className="text-[24px] font-semibold tracking-tight">{s.v}</div>
                    <div className="text-[11px] uppercase tracking-widest opacity-60 mt-1">{s.l}</div>
                  </div>))}
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <Link to="/register" className="px-6 py-3 rounded-full bg-white text-slate-900 text-[14px] font-semibold hover:bg-slate-100 transition">Request help now</Link>
                  <span className="text-[13px] text-white/60">Worker verification required • Secret code protected</span>
                </div>
              </div>

              <div className="bg-white/4 border-t lg:border-t-0 lg:border-l border-white/8 p-6 md:p-8 space-y-3 max-h-520px overflow-auto">
                {[
                  { name: "Aanya", spec: "Hardware Specialist", rating: 4.9, jobs: 128, avail: "Available", time: "8 min", cats: ["Tech Rescue", "Electrical"] },
                  { name: "Faris", spec: "Technical Support", rating: 4.7, jobs: 94, avail: "Available", time: "12 min", cats: ["Tech Rescue", "Presentation"] },
                  { name: "Ahad", spec: "Delivery Personnel", rating: 4.9, jobs: 210, avail: "Available", time: "6 min", cats: ["Campus Delivery"] },
                  { name: "Zara", spec: "Documentation", rating: 4.6, jobs: 87, avail: "Available", time: "20 min", cats: ["Document Help"] },
                ].map((w) => (<div key={w.name} className="rounded-2xl bg-white text-slate-900 p-4 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-[13px]">{w.name[0]}</div>
                    <div>
                      <div className="text-[14px] font-semibold leading-none">{w.name}</div>
                      <div className="text-[12px] text-slate-500 mt-1">{w.spec} • ⭐ {w.rating} • {w.jobs} jobs</div>
                      <div className="mt-1.5 flex gap-1">{w.cats.map(c => <span key={c} className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-medium">{c}</span>)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border ${w.avail === "Available" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>{w.avail}</div>
                    <div className="text-[11px] text-slate-500 mt-1.5">{w.time} avg</div>
                  </div>
                </div>))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    { }
    <section id="coverage" className=" scroll-mt-32 py-24 md:py-28 bg-[#f8fafc] border-t border-slate-200/70">
      <div className="mx-auto max-w-1280px px-6">
        <div className="grid lg:grid-cols-0.9fr_1.1fr gap-12 items-start">
          <Reveal>
            <div className="sticky top-28">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-semibold uppercase tracking-widest">Campus Coverage</div>
              <h2 className="mt-4 text-[32px] md:text-[40px] font-700 leading-[0.95] tracking-[-0.03em]">Every block. Every lab. Every hostel.</h2>
              <p className="mt-4 text-[16px] leading-1.6 text-slate-600">Built for a real university operations workflow. From emergency electrical to document help, coverage is mapped and prioritized.</p>

              <div className="mt-8 rounded-20px bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-white" /></div>
                  <div>
                    <div className="text-[14px] font-semibold">University Operations Center</div>
                    <div className="text-[12px] text-slate-500">Live monitoring • 24/7</div>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { k: "12 blocks", v: "100% coverage" },
                    { k: "24 workers", v: "Verified" },
                    { k: "9 categories", v: "Specialized" },
                    { k: "94.2%", v: "Completion" },
                  ].map((s) => (<div key={s.k} className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
                    <div className="text-[14px] font-semibold">{s.k}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{s.v}</div>
                  </div>))}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="space-y-4">
            {[
              { title: "Academic Blocks A-D", desc: "Tech Rescue, Presentation Help, Document Help priority. Avg 7 min response.", stats: "4 blocks • 8 workers", icon: Building2 },
              { title: "Hostels 1-6", desc: "Quick Fix, Electrical, Plumbing, Cleaning. Emergency prioritized.", stats: "6 hostels • 6 workers", icon: Layers },
              { title: "Research Labs", desc: "Electrical, Tech Rescue, Delivery. High-priority lab equipment support.", stats: "12 labs • 4 specialists", icon: Zap },
              { title: "Library & Admin", desc: "Document Help, Campus Delivery, Presentation Help for seminars.", stats: "2 zones • 6 workers", icon: FileText },
            ].map((block, i) => (<Reveal key={block.title} delay={i * 0.08}>
              <div className="group rounded-[20px] bg-white border border-slate-200 p-6 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-colors"><block.icon className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[16px] font-semibold tracking-tight">{block.title}</h3>
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 font-medium text-slate-600">{block.stats}</span>
                    </div>
                    <p className="mt-2 text-[14px] leading-1.5 text-slate-600">{block.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>))}

            <Reveal delay={0.4}>
              <div className="rounded-[20px] bg-slate-900 text-white p-7 flex items-center justify-between">
                <div>
                  <div className="text-[15px] font-semibold">Need emergency assistance?</div>
                  <div className="text-[13px] text-white/60 mt-1">Highest priority • Immediate dispatch • Tracked live</div>
                </div>
                <Link to="/register" className="px-5 py-2.5 rounded-full bg-white text-slate-900 text-[13px] font-semibold hover:bg-slate-100 transition">Request Now</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    { }
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="mx-auto max-w-1280px px-6">
        <Reveal>
          <div className="rounded-32px bg-[#fcfcf9] border border-slate-200 p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(15,23,42,0.06),transparent)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-semibold uppercase tracking-widest">Get Started</div>
              <h2 className="mt-6 text-[32px] md:text-[48px] font-700 leading-[0.95] tracking-[-0.03em] max-w-720px mx-auto">Campus help should be as reliable as your timetable.</h2>
              <p className="mt-4 text-[17px] leading-[1.6] text-slate-600 max-w-520px mx-auto">Join 1,200+ students who get help in under 10 minutes. Verified workers, real-time tracking, rated experiences.</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/register" className="px-8 py-3.5 rounded-full bg-slate-900 text-white text-[15px] font-semibold hover:bg-slate-800 transition shadow-[0_8px_24px_rgba(15,23,42,0.2)]">Create Account — It's Free</Link>
                <Link to="/login" className="px-8 py-3.5 rounded-full bg-white border border-slate-200 text-slate-900 text-[15px] font-medium hover:bg-slate-50 transition">Login to Dashboard</Link>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-[12px] text-slate-500">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />No spam</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />Verified workers only</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />One active request rule</span>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-slate-200 text-[13px] text-slate-500">
          <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div><span className="font-medium text-slate-900">Campus Rescue</span><span>© 2024 University Operations Platform</span></div>
          <div className="flex items-center gap-6"><span>Worker secret code protected</span><span>•</span><span>Role-based authorization</span><span>•</span><span>Real-time dispatch</span></div>
        </div>
      </div>
    </section>
  </div>);
}
