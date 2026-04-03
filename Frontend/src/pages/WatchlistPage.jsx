import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CalendarClock, MapPin, Star, TriangleAlert } from "lucide-react";
import CrosswalkCard from "../components/CrosswalkCard";
import ImageModal from "../components/ImageModal";
import { SkeletonCard } from "../components/SkeletonLoader";
import { useWatchlist } from "../context/WatchlistContext";
import { useRealTimeUpdates } from "../hooks/useRealTimeUpdates";
import { fetchAlerts, fetchCrosswalks, getImageUrl } from "../services/api";

const WatchlistEventCard = ({ event, crosswalkName, onImageClick }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-2">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
            event.isHazard
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {event.isHazard ? "Hazard" : "Event"}
        </span>
        <h3 className="text-lg font-semibold text-slate-900">
          {event.description || "Incident"}
        </h3>
        <p className="text-sm text-slate-500">{crosswalkName}</p>
      </div>

      <div className="text-right text-xs text-slate-500">
        <div className="flex items-center justify-end gap-1">
          <CalendarClock size={14} />
          <span>{new Date(event.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>

    {event.reasons?.length > 0 && (
      <p className="mt-3 text-sm text-slate-600">{event.reasons.join(", ")}</p>
    )}

    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl bg-slate-50 p-3">
        <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
          Distance
        </div>
        <div className="mt-1 text-sm font-semibold text-slate-800">
          {event.detectionDistance ?? 0} m
        </div>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
          Objects
        </div>
        <div className="mt-1 text-sm font-semibold text-slate-800">
          {event.detectedObjectsCount ?? 0}
        </div>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
          LED
        </div>
        <div className="mt-1 text-sm font-semibold text-slate-800">
          {event.ledActivated ? "Activated" : "Off"}
        </div>
      </div>
    </div>

    {event.imageUrl && (
      <button
        type="button"
        onClick={() => onImageClick(getImageUrl(event.imageUrl))}
        className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        View image
      </button>
    )}
  </article>
);

const WatchlistPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = React.useState(null);
  const {
    data: crosswalkData,
    loading: crosswalksLoading,
    error: crosswalksError,
  } = useRealTimeUpdates(fetchCrosswalks, 15000);
  const {
    data: alertsData,
    loading: alertsLoading,
    error: alertsError,
  } = useRealTimeUpdates(fetchAlerts, 15000);
  const { watchlistIds, isFavorite, toggleFavorite, clearWatchlist } = useWatchlist();

  const watchlistCrosswalks = useMemo(() => {
    const allCrosswalks = crosswalkData || [];
    return allCrosswalks.filter((crosswalk) => watchlistIds.includes(crosswalk._id));
  }, [crosswalkData, watchlistIds]);

  const watchlistNameMap = useMemo(
    () => new Map(watchlistCrosswalks.map((crosswalk) => [crosswalk._id, crosswalk.name])),
    [watchlistCrosswalks],
  );

  const watchlistEvents = useMemo(() => {
    const alerts = alertsData || [];

    return alerts
      .filter((alert) => {
        const crosswalkId =
          typeof alert.crosswalkId === "object"
            ? alert.crosswalkId?._id
            : alert.crosswalkId;

        return watchlistIds.includes(String(crosswalkId));
      })
      .sort(
        (left, right) =>
          new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
      );
  }, [alertsData, watchlistIds]);

  const loading = crosswalksLoading || alertsLoading;
  const error = crosswalksError || alertsError;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-slate-50">
        <div className="mx-auto grid max-w-[1760px] gap-6 px-4 py-8 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
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
            Failed to load the watchlist
          </h1>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-slate-50">
      <ImageModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <div className="mx-auto max-w-[1760px] px-4 py-8">
        <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                <Star size={14} className="fill-current" />
                Watchlist
              </span>
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">
                  Favorite crossings and incidents
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Follow your selected crossings and review every event linked to
                  them in one place.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="flex min-h-[96px] flex-col items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-center text-white">
                <div className="text-2xl font-semibold">{watchlistCrosswalks.length}</div>
                <div className="text-xs uppercase tracking-[0.16em] text-slate-300">
                  Saved
                </div>
              </div>
              <div className="flex min-h-[96px] flex-col items-center justify-center rounded-2xl bg-red-50 px-4 py-3 text-center text-red-700">
                <div className="text-2xl font-semibold">{watchlistEvents.length}</div>
                <div className="text-xs uppercase tracking-[0.16em]">
                  Events
                </div>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={clearWatchlist}
                  disabled={watchlistCrosswalks.length === 0}
                  className="flex h-full min-h-[88px] w-full min-w-[156px] items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Remove all
                </button>
              </div>
            </div>
          </div>
        </section>

        {watchlistCrosswalks.length === 0 ? (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Your watchlist is empty
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Use the star button on any crossing to add it here.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Browse all crossings
            </button>
          </section>
        ) : (
          <>
            <section
              className="mt-6 flex flex-wrap justify-center gap-6"
            >
              {watchlistCrosswalks.map((crosswalk) => (
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

            <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Watchlist incidents
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    All events for the crossings currently in your watchlist.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                  <TriangleAlert size={14} />
                  {watchlistEvents.length} total events
                </div>
              </div>

              {watchlistEvents.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <MapPin className="mx-auto text-slate-400" size={28} />
                  <p className="mt-3 text-sm text-slate-600">
                    No events found yet for the selected crossings.
                  </p>
                </div>
              ) : (
                <div
                  className="mt-6 grid gap-4"
                  style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
                >
                  {watchlistEvents.map((event) => {
                    const crosswalkId =
                      typeof event.crosswalkId === "object"
                        ? event.crosswalkId?._id
                        : event.crosswalkId;
                    const crosswalkName =
                      typeof event.crosswalkId === "object"
                        ? event.crosswalkId?.name
                        : watchlistNameMap.get(String(crosswalkId)) || "Crosswalk";

                    return (
                      <WatchlistEventCard
                        key={event._id}
                        event={event}
                        crosswalkName={crosswalkName}
                        onImageClick={setSelectedImage}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
