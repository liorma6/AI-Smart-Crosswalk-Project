/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const WatchlistContext = createContext(null);
const WATCHLIST_COOKIE = "smart_crosswalk_watchlist";
const COOKIE_MAX_AGE_DAYS = 30;

const readWatchlistCookie = () => {
  if (typeof document === "undefined") {
    return [];
  }

  const cookieEntry = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${WATCHLIST_COOKIE}=`));

  if (!cookieEntry) {
    return [];
  }

  try {
    const rawValue = cookieEntry.slice(WATCHLIST_COOKIE.length + 1);
    const parsedValue = JSON.parse(decodeURIComponent(rawValue));
    return Array.isArray(parsedValue)
      ? parsedValue.filter((id) => typeof id === "string")
      : [];
  } catch {
    return [];
  }
};

const writeWatchlistCookie = (watchlistIds) => {
  if (typeof document === "undefined") {
    return;
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + COOKIE_MAX_AGE_DAYS);

  document.cookie = [
    `${WATCHLIST_COOKIE}=${encodeURIComponent(JSON.stringify(watchlistIds))}`,
    `expires=${expiresAt.toUTCString()}`,
    "path=/",
    "SameSite=Lax",
  ].join("; ");
};

export const WatchlistProvider = ({ children }) => {
  const [watchlistIds, setWatchlistIds] = useState(() => readWatchlistCookie());

  useEffect(() => {
    writeWatchlistCookie(watchlistIds);
  }, [watchlistIds]);

  const value = useMemo(
    () => ({
      watchlistIds,
      isFavorite: (crosswalkId) => watchlistIds.includes(String(crosswalkId)),
      toggleFavorite: (crosswalkId) => {
        const normalizedId = String(crosswalkId);

        setWatchlistIds((currentIds) =>
          currentIds.includes(normalizedId)
            ? currentIds.filter((id) => id !== normalizedId)
            : [...currentIds, normalizedId],
        );
      },
      clearWatchlist: () => setWatchlistIds([]),
    }),
    [watchlistIds],
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider.");
  }

  return context;
};
