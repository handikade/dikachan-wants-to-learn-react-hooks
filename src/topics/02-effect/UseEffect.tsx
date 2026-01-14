import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";

// #region HELPERS
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adaptAnime = (raw: any): Anime => {
  const anime: Anime = {
    mal_id: raw.mal_id,
    title: raw.title,
    year: raw.year,
    rating: raw.rating,
    score: raw.score,
  };

  return anime;
};

type Anime = {
  mal_id: number;
  title: string;
  year: number | null;
  rating: string;
  score: number;
};
// #endregion HELPERS

const UseEffectExample = () => {
  return (
    <div style={{ margin: "0 auto", maxWidth: "800px" }}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="api-fetch" replace />} />
          <Route path="api-fetch" element={<ApiFetch />} />
          <Route path="ls-sync" element={<LocalStorageSync />} />
          <Route path="mouse-track" element={<TrackMouse />} />
        </Route>
      </Routes>
    </div>
  );
};

export default UseEffectExample;

function Layout() {
  return (
    <div>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <Link to="/effect/api-fetch">API Fetch</Link>
        <Link to="/effect/ls-sync">Local Storage Sync</Link>
        <Link to="/effect/mouse-track">Mouse Track</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function ApiFetch() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState("4");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("limit", limit);
    searchParams.append("page", page.toString());

    const url = `https://api.jikan.moe/v4/anime?${searchParams.toString()}`;

    const ctrl = new AbortController();

    const fetchAnimes = async () => {
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) {
          setError(`Request gagal: ${res.status}`);
          return;
        }
        const { data } = await res.json();
        setAnimes(data.map(adaptAnime));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setError("mungkin networknya bermasalah");
      }
    };

    fetchAnimes();

    return () => ctrl.abort();
  }, [limit, page]);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e?.target.value;
    setLimit(value);
    setPage(1);
  };

  const handlePrev = () => {
    if (page === 1) return;
    setPage((p) => p - 1);
  };

  const handleNext = () => {
    setPage((p) => p + 1);
  };

  return (
    <div>
      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}
      <table border={1} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>MAL ID</th>
            <th>TITLE</th>
            <th>YEAR</th>
            <th>RATING</th>
            <th>SCORE</th>
          </tr>
        </thead>
        <tbody>
          {animes.map((a) => (
            <tr key={a.mal_id}>
              <td>{a.mal_id}</td>
              <td>{a.title}</td>
              <td>{a.year}</td>
              <td>{a.rating}</td>
              <td>{a.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <label htmlFor="limit">LIMIT</label>
          <select id="limit" onChange={handleLimitChange}>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="8">8</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" onClick={handlePrev} disabled={page === 1}>
            PREV
          </button>
          <button type="button" onClick={handleNext}>
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}

function initializeCountFromLocalStorage() {
  const rawCount = localStorage.getItem("count");
  const count = Number(rawCount);

  return isNaN(count) ? 0 : count;
}

function LocalStorageSync() {
  /**
   * penting ⚠️
   * pass reference-nya (tanpa invoke): ```useState<number>(initializeCountFromLocalStorage)``` (lazy init)
   * kalo ```useState<number>(initializeCountFromLocalStorage())``` bakal dipanggil tiap render
   */
  const [count, setCount] = useState<number>(initializeCountFromLocalStorage);

  useEffect(() => {
    localStorage.setItem("count", count.toString());
  }, [count]);

  return (
    <>
      <h2 style={{ textAlign: "center", color: "red" }}>Count: {count}</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          Increment
        </button>
        <button type="button" onClick={() => setCount((c) => c - 1)}>
          Decrement
        </button>
      </div>
    </>
  );
}

function TrackMouse() {
  const [coordinate, setCoordinate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const area = document.getElementById("track-area");
    const track = (e: MouseEvent) => {
      setCoordinate({ x: e.x, y: e.y });
    };
    area?.addEventListener("mousemove", track);

    return () => {
      area?.removeEventListener("mousemove", track);
    };
  }, []);

  return (
    <>
      <div
        id="track-area"
        style={{
          height: "300px",
          background: "#ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>
          x: {coordinate.x}, y: {coordinate.y}
        </p>
      </div>
    </>
  );
}
