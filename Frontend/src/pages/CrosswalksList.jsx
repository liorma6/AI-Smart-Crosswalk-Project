import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Filter, Search, X } from "lucide-react";
import CrosswalkCard from "../components/CrosswalkCard";
import { SkeletonCard } from "../components/SkeletonLoader";
import { useWatchlist } from "../context/WatchlistContext";
import { useRealTimeUpdates } from "../hooks/useRealTimeUpdates";
import { fetchCrosswalks } from "../services/api";

const transliterateHebrewToEnglish = (hebrewText) => {
  const pattern = hebrewText
    .split("")
    .map((char, index) => {
      let base = "";

      switch (char) {
        case "א":
          base = "[ae]?";
          break;
        case "ב":
          base = "[bv]";
          break;
        case "ג":
          base = "g";
          break;
        case "ד":
          base = "d";
          break;
        case "ה":
          base = "h?";
          break;
        case "ו":
          base = "[ouvw]?";
          break;
        case "ז":
          base = "z";
          break;
        case "ח":
          base = "(h|ch)";
          break;
        case "ט":
          base = "t";
          break;
        case "י":
          base = "[iye]?";
          break;
        case "כ":
        case "ך":
          base = "[kc]";
          break;
        case "ל":
          base = "l";
          break;
        case "מ":
        case "ם":
          base = "m";
          break;
        case "נ":
        case "ן":
          base = "n";
          break;
        case "ס":
          base = "s";
          break;
        case "ע":
          base = "[ae]?";
          break;
        case "פ":
        case "ף":
          base = "[pf]";
          break;
        case "צ":
          base = "(ts|tz|z)";
          break;
        case "ק":
          base = "[kq]";
          break;
        case "ר":
          base = "r";
          break;
        case "ש":
          base = "(s|sh)";
          break;
        case "ת":
          base = "t";
          break;
        case " ":
          return "\\s*";
        default:
          return char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }

      if (index < hebrewText.length - 1) {
        base += "[aeiou]?";
      }

      return base;
    })
    .join("");

  try {
    return new RegExp(pattern, "i");
  } catch {
    return null;
  }
};

const statusStyles = {
  all: "bg-slate-900 text-white",
  active: "bg-emerald-600 text-white",
  maintenance: "bg-amber-500 text-white",
  inactive: "bg-rose-600 text-white",
};

const CrosswalksList = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useRealTimeUpdates(fetchCrosswalks, 15000);
  const { isFavorite, toggleFavorite, watchlistIds } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const crosswalks = useMemo(() => data || [], [data]);

  const filteredCrosswalks = useMemo(() => {
    let nextCrosswalks = [...crosswalks];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const hebrewRegex = transliterateHebrewToEnglish(searchQuery);

      nextCrosswalks = nextCrosswalks.filter((crosswalk) => {
        const name = crosswalk.name?.toLowerCase() || "";
        const status = crosswalk.status?.toLowerCase() || "";
        const id = crosswalk._id?.toLowerCase() || "";
        const address = crosswalk.location?.address?.toLowerCase() || "";
        const coordinates = `${crosswalk.location?.lat || ""} ${crosswalk.location?.lng || ""}`.toLowerCase();

        const literalMatch =
          name.includes(query) ||
          status.includes(query) ||
          id.includes(query) ||
          address.includes(query) ||
          coordinates.includes(query);

        return (
          literalMatch ||
          Boolean(hebrewRegex?.test(name)) ||
          Boolean(hebrewRegex?.test(address))
        );
      });
    }

    if (statusFilter !== "all") {
      nextCrosswalks = nextCrosswalks.filter(
        (crosswalk) => crosswalk.status === statusFilter,
      );
    }

    return nextCrosswalks;
  }, [crosswalks, searchQuery, statusFilter]);

  const activeFiltersCount =
    (searchQuery.trim() ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
        <div className="mx-auto grid max-w-[1760px] gap-6 px-4 py-8 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4].map((item) => (
            <SkeletonCard key={item} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 text-rose-600" size={40} />
          <h1 className="text-xl font-semibold text-slate-900">
            Failed to load crossings
          </h1>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      <div className="mx-auto max-w-[1760px] px-4 py-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                All Crossings
              </span>
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">
                  Crossing network overview
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Browse every crossing, inspect coordinates, and pin the ones
                  you want in your watchlist.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="flex min-h-[96px] flex-col items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-center text-white">
                <div className="text-2xl font-semibold">{crosswalks.length}</div>
                <div className="text-xs uppercase tracking-[0.16em] text-slate-300">
                  Total
                </div>
              </div>
              <div className="flex min-h-[96px] flex-col items-center justify-center rounded-2xl bg-emerald-50 px-4 py-3 text-center text-emerald-700">
                <div className="text-2xl font-semibold">
                  {crosswalks.filter((crosswalk) => crosswalk.status === "active").length}
                </div>
                <div className="text-xs uppercase tracking-[0.16em]">
                  Active
                </div>
              </div>
              <div className="flex min-h-[96px] flex-col items-center justify-center rounded-2xl bg-amber-50 px-4 py-3 text-center text-amber-700">
                <div className="text-2xl font-semibold">{watchlistIds.length}</div>
                <div className="text-xs uppercase tracking-[0.16em]">
                  Watchlist
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, ID, street, or coordinates"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-14 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowFilters((current) => !current)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 transition ${
                  showFilters || activeFiltersCount > 0
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:bg-slate-200"
                }`}
                aria-label="Toggle filters"
              >
                <Filter size={18} />
              </button>
            </div>

            {showFilters && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Filter by status
                    </h2>
                    <p className="text-xs text-slate-500">
                      Narrow the list before adding crossings to the watchlist.
                    </p>
                  </div>
                  {activeFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      <X size={14} />
                      Clear
                    </button>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["all", "active", "maintenance", "inactive"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                        statusFilter === status
                          ? statusStyles[status]
                          : "bg-white text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="mt-6 flex items-center justify-between px-1">
          <p className="text-sm text-slate-600">
            Showing {filteredCrosswalks.length} of {crosswalks.length} crossings
          </p>
        </div>

        {filteredCrosswalks.length === 0 ? (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              No crossings match this filter
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Try a different search or clear the current filters.
            </p>
          </section>
        ) : (
          <section className="mt-6 flex flex-wrap justify-center gap-6">
            {filteredCrosswalks.map((crosswalk) => (
              <div
                key={crosswalk._id}
                className="w-full md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)]"
              >
                <CrosswalkCard
                  crosswalk={crosswalk}
                  isFavorite={isFavorite(crosswalk._id)}
                  onToggleFavorite={toggleFavorite}
                  onViewDetails={(crosswalkId) => navigate(`/crosswalk/${crosswalkId}`)}
                />
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default CrosswalksList;
