import { apiFetch } from "@/lib/api";
import { Link } from "react-router-dom";
import { usePathname, useRouter } from "@/lib/router";
import { useAuth } from "@/controllers/AuthController";
import {
  Shield,
  LayoutDashboard,
  PlusCircle,
  Ticket,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/components/Toaster";

export function DashboardLayout({ children, role }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await apiFetch("/api/notifications", {
          credentials: "include"
        });

        if (res.ok) {
          const data = await res.json();

          const unread = (data.notifications || []).filter(
            (notification) => !notification.read
          );

          setNotifications(unread);
          setNotifCount(data.unreadCount || unread.length);
        }
      } catch { }
    };

    fetchNotifs();

    const id = setInterval(fetchNotifs, 5000);

    return () => clearInterval(id);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast("Logged out", "success");
    router.push("/");
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await apiFetch(`/api/notifications/${notification.id}/read`, {
          method: "PUT",
          credentials: "include"
        });
      }

      setNotifications((prev) =>
        prev.filter((item) => item.id !== notification.id)
      );

      setNotifCount((prev) => Math.max(0, prev - 1));
      setShowNotifications(false);

      if (notification.relatedComplaint) {
        const complaintId =
          notification.relatedComplaint._id ||
          notification.relatedComplaint;

        if (role === "worker") {
          router.push("/worker/dashboard");
        } else {
          router.push(`/ticket/${complaintId}`);
        }
      }
    } catch { }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await apiFetch("/api/notifications/read-all", {
        method: "PUT",
        credentials: "include"
      });

      if (res.ok) {
        setNotifications([]);
        setNotifCount(0);
      }
    } catch { }
  };

  const studentNav = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard
    },
    {
      href: "/create-ticket",
      label: "New Request",
      icon: PlusCircle
    },
    {
      href: "/dashboard?tab=active",
      label: "Active",
      icon: Ticket
    },
    {
      href: "/dashboard?tab=history",
      label: "History",
      icon: Ticket
    }
  ];

  const workerNav = [
    {
      href: "/worker/dashboard",
      label: "Requests",
      icon: LayoutDashboard
    }
  ];

  const adminNav = [
    {
      href: "/admin/dashboard",
      label: "Overview",
      icon: LayoutDashboard
    }
  ];

  const nav =
    role === "student"
      ? studentNav
      : role === "worker"
        ? workerNav
        : adminNav;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          } ${sidebarOpen ? "lg:translate-x-0" : "lg:-translate-x-full"
          }`}
      >
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>

              <div className="leading-none">
                <div className="font-semibold text-[15px] tracking-tight">
                  Campus Rescue
                </div>

                <div className="text-[10px] uppercase tracking-widest font-medium text-slate-500">
                  {role} • Operations
                </div>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => {
            const active =
              pathname === item.href.split("?")[0] &&
              !pathname.includes("create");

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition ${active
                    ? "bg-slate-900 text-white shadow-[0_4px_12px_rgba(15,23,42,0.15)]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[12px] font-semibold">
                  {user?.name?.[0] || "U"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate">
                    {user?.name}
                  </div>

                  <div className="text-[11px] text-slate-500 truncate">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "lg:ml-[280px]" : "lg:ml-0"
          }`}
      >
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="hidden lg:flex p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            <div className="hidden md:block">
              <h1 className="text-[16px] font-semibold tracking-tight">
                {role === "student"
                  ? "Student Dashboard"
                  : role === "worker"
                    ? "Worker Operations"
                    : "Admin Control Center"}
              </h1>

              <p className="text-[12px] text-slate-500">
                Real-time campus assistance monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <div className="relative">
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className="relative p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <Bell className="w-5 h-5 text-slate-600" />

                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
                    {notifCount > 9 ? "9+" : notifCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-[420px] max-w-[calc(100vw-32px)] max-h-[480px] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl z-50">

                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-sm">
                      Notifications
                    </h3>

                    {notifications.length > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-slate-500 hover:text-slate-900"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() =>
                          handleNotificationClick(notification)
                        }
                        className="w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <div className="text-sm font-semibold text-slate-900">
                          {notification.title}
                        </div>

                        <div className="text-xs text-slate-500 mt-1 leading-5">
                          {notification.message}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="w-px h-6 bg-slate-200" />

              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[12px] font-semibold">
                {user?.name?.[0] || "U"}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}