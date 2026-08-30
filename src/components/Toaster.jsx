import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
let toastListeners = [];
export function toast(message, type = "info") {
    const t = { id: Math.random().toString(36).slice(2), message, type };
    toastListeners.forEach((l) => l(t));
}
export function Toaster() {
    const [toasts, setToasts] = useState([]);
    useEffect(() => {
        const listener = (t) => {
            setToasts((prev) => [...prev, t]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((x) => x.id !== t.id));
            }, 4000);
        };
        toastListeners.push(listener);
        return () => {
            toastListeners = toastListeners.filter((l) => l !== listener);
        };
    }, []);
    return (<div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (<motion.div key={t.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className={`pointer-events-auto flex items-center gap-3 rounded-2xl px-5 py-4 shadow-[0_16px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl border min-w-[320px] max-w-420px ${t.type === "success" ? "bg-slate-900 text-white border-slate-800" :
                t.type === "error" ? "bg-white text-slate-900 border-red-100 shadow-[0_16px_32px_rgba(239,68,68,0.15)]" :
                    "bg-white text-slate-900 border-slate-200"}`}>
            {t.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0"/>}
            {t.type === "error" && <AlertCircle className="w-5 h-5 text-red-500 shrink-0"/>}
            {t.type === "info" && <Info className="w-5 h-5 text-slate-500 shrink-0"/>}
            <p className="text-[14px] font-medium leading-[1.4] flex-1">{t.message}</p>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="p-1 rounded-full hover:bg-white/10">
              <X className="w-4 h-4 opacity-60"/>
            </button>
          </motion.div>))}
      </AnimatePresence>
    </div>);
}
