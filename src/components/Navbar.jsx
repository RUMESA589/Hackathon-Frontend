import { Link } from "react-router-dom";
import { useAuth } from "@/controllers/AuthController";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, LogOut, LayoutDashboard } from "lucide-react";
import { toast } from "@/components/Toaster";

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast("Logged out successfully", "success");
    window.location.href = "/";
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-6"
        }`}
    >
      <div className="mx-auto max-w-1280px px-6">
        <div
          className={`flex items-center justify-between rounded-[20px] px-6 py-3.5 transition-all duration-500 ${scrolled
              ? "bg-white/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-slate-200/60"
              : "bg-transparent"
            }`}
        >
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>

            <div className="leading-none">
              <div className="font-semibold text-[17px] tracking-tight text-slate-900">
                Campus Rescue
              </div>
              <div className="text-[10px] uppercase tracking-[0.14em] font-medium text-slate-500 mt-1">
                Operations Platform
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <a
              href="/#how-it-works"
              className="px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
            >
              How it works
            </a>

            <a
              href="/#categories"
              className="px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
            >
              Services
            </a>

            <a
              href="/#coverage"
              className="px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
            >
              Coverage
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to={
                    user.role === "student"
                      ? "/dashboard"
                      : user.role === "worker"
                        ? "/worker/dashboard"
                        : "/admin/dashboard"
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-900 text-[14px] font-medium hover:bg-slate-200 transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-[14px] font-medium text-slate-700 hover:text-slate-900 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 transition shadow-[0_4px_12px_rgba(15,23,42,0.2)]"
                >
                  Get Help Now
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 rounded-full bg-white border border-slate-200"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mx-6 mt-3 rounded-[20px] bg-white border border-slate-200 shadow-[0_16px_32px_rgba(0,0,0,0.12)] p-6"
          >
            <div className="flex flex-col gap-1">
              <a
                href="/#how-it-works"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-slate-50 text-[15px] font-medium"
              >
                How it works
              </a>

              <a
                href="/#categories"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-slate-50 text-[15px] font-medium"
              >
                Services
              </a>

              <a
                href="/#coverage"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-slate-50 text-[15px] font-medium"
              >
                Coverage
              </a>

              <div className="h-px bg-slate-100 my-3" />

              {user ? (
                <>
                  <Link
                    to={
                      user.role === "student"
                        ? "/dashboard"
                        : user.role === "worker"
                          ? "/worker/dashboard"
                          : "/admin/dashboard"
                    }
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl bg-slate-900 text-white font-medium"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-xl border border-slate-200 text-left font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl border border-slate-200 font-medium text-center"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl bg-slate-900 text-white font-semibold text-center"
                  >
                    Get Help Now
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}