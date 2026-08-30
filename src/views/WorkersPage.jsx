import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Star,
  Clock3,
  CheckCircle2,
  BriefcaseBusiness,
  ShieldCheck,
  Users,
  X
} from "lucide-react";
import {Navbar} from "@/components/Navbar";
import { apiFetch } from "@/lib/api";

export default function WorkersPage() {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch("/api/workers", {
          credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Unable to load specialists");
        }

        setWorkers(data.workers || []);
      } catch (err) {
        setError(err.message || "Unable to load specialists");
      } finally {
        setLoading(false);
      }
    };

    loadWorkers();
  }, []);

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        worker.name?.toLowerCase().includes(query) ||
        worker.specialization?.toLowerCase().includes(query) ||
        worker.categories?.some((category) =>
          category.toLowerCase().includes(query)
        );

      const matchesAvailability =
        availability === "all" ||
        worker.availability === availability;

      return matchesSearch && matchesAvailability;
    });
  }, [workers, search, availability]);

  const clearFilters = () => {
    setSearch("");
    setAvailability("all");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main>
        <section className="pt-32 pb-14 bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 hover:text-slate-900 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Campus Rescue
            </Link>

            <div className="mt-8 max-w-760px">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-semibold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified specialists
              </div>

              <h1 className="mt-5 text-[42px] md:text-[58px] font-bold leading-[1.02] tracking-[-0.04em]">
                Find the right specialist for your campus request.
              </h1>

              <p className="mt-5 text-[16px] md:text-[18px] leading-[1.6] text-slate-600 max-w-650px">
                Browse verified campus workers by specialization,
                availability, ratings, and completed requests.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <Users className="w-5 h-5 text-slate-500" />
                <div className="mt-4 text-[24px] font-semibold">
                  {workers.length}
                </div>
                <div className="text-[12px] text-slate-500 mt-1">
                  Specialists
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <div className="mt-4 text-[24px] font-semibold">
                  {workers.filter((w) => w.availability === "available").length}
                </div>
                <div className="text-[12px] text-slate-500 mt-1">
                  Available now
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <Star className="w-5 h-5 text-amber-500" />
                <div className="mt-4 text-[24px] font-semibold">
                  {workers.length
                    ? (
                        workers.reduce(
                          (sum, worker) => sum + Number(worker.ratingAvg || 0),
                          0
                        ) / workers.length
                      ).toFixed(1)
                    : "0.0"}
                </div>
                <div className="text-[12px] text-slate-500 mt-1">
                  Average rating
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <BriefcaseBusiness className="w-5 h-5 text-blue-500" />
                <div className="mt-4 text-[24px] font-semibold">
                  {workers.reduce(
                    (sum, worker) => sum + Number(worker.completedRequests || 0),
                    0
                  )}
                </div>
                <div className="text-[12px] text-slate-500 mt-1">
                  Completed requests
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-6">

            <div className="rounded-24px bg-white border border-slate-200 p-4 md:p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="flex flex-col lg:flex-row gap-3">

                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, specialization or category..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "all", label: "All" },
                    { id: "available", label: "Available" },
                    { id: "busy", label: "Busy" },
                    { id: "offline", label: "Offline" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAvailability(item.id)}
                      className={`px-4 py-3 rounded-xl text-[13px] font-medium border transition ${
                        availability === item.id
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {(search || availability !== "all") && (
                <button
                  onClick={clearFilters}
                  className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-900"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear filters
                </button>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div>
                <h2 className="text-[20px] font-semibold tracking-tight">
                  Campus specialists
                </h2>
                <p className="mt-1 text-[13px] text-slate-500">
                  {loading
                    ? "Loading specialists..."
                    : `${filteredWorkers.length} specialist${
                        filteredWorkers.length === 1 ? "" : "s"
                      } found`}
                </p>
              </div>
            </div>

            {loading && (
              <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-300px rounded-24px bg-white border border-slate-200 animate-pulse"
                  />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="mt-6 rounded-24px bg-white border border-red-200 p-10 text-center">
                <div className="text-[16px] font-semibold text-slate-900">
                  Unable to load specialists
                </div>

                <p className="mt-2 text-[13px] text-slate-500">
                  {error}
                </p>

                <Link
                  to="/login"
                  className="mt-5 inline-flex px-5 py-2.5 rounded-full bg-slate-900 text-white text-[13px] font-semibold"
                >
                  Login to continue
                </Link>
              </div>
            )}

            {!loading && !error && filteredWorkers.length === 0 && (
              <div className="mt-6 rounded-24px bg-white border border-slate-200 p-12 text-center">
                <Search className="w-8 h-8 mx-auto text-slate-400" />

                <h3 className="mt-4 text-[16px] font-semibold">
                  No specialists found
                </h3>

                <p className="mt-2 text-[13px] text-slate-500">
                  Try another search or change the availability filter.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-5 px-5 py-2.5 rounded-full bg-slate-900 text-white text-[13px] font-semibold"
                >
                  Clear filters
                </button>
              </div>
            )}

            {!loading && !error && filteredWorkers.length > 0 && (
              <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className="group rounded-24px bg-white border border-slate-200 p-6 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">
                        {worker.avatar ? (
                          <img
                            src={worker.avatar}
                            alt={worker.name}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-[15px] font-semibold">
                            {worker.name?.[0]?.toUpperCase() || "W"}
                          </div>
                        )}

                        <div>
                          <h3 className="text-[15px] font-semibold">
                            {worker.name}
                          </h3>

                          <p className="mt-0.5 text-[12px] text-slate-500">
                            Verified campus specialist
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          worker.availability === "available"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : worker.availability === "busy"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {worker.availability}
                      </span>
                    </div>

                    <div className="mt-6">
                      <div className="text-[18px] font-semibold tracking-tight">
                        {worker.specialization}
                      </div>

                      <p className="mt-2 text-[13px] text-slate-600 leading-[1.6] min-h-42px">
                        {worker.bio || "Experienced campus support specialist."}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {(worker.categories || []).map((category) => (
                        <span
                          key={category}
                          className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-medium text-slate-600"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-3">

                      <div>
                        <div className="flex items-center gap-1 text-[13px] font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {Number(worker.ratingAvg || 0).toFixed(1)}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {worker.ratingCount || 0} ratings
                        </div>
                      </div>

                      <div>
                        <div className="text-[13px] font-semibold">
                          {worker.completedRequests || 0}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          completed
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 text-[13px] font-semibold">
                          <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                          {worker.responseTimeAvg || 0}m
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          avg response
                        </div>
                      </div>

                    </div>

                    <Link
                      to="/create-ticket"
                      className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white text-[13px] font-semibold hover:bg-slate-800 transition"
                    >
                      Request this specialist
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}