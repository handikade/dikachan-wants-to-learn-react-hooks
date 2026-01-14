import { useEffect, useState } from "react";

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

const ApiFetch = () => {
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
          <th>MAL ID</th>
          <th>TITLE</th>
          <th>YEAR</th>
          <th>RATING</th>
          <th>SCORE</th>
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
};

const UseEffectExample = () => {
  return (
    <div style={{ margin: "0 auto", maxWidth: "800px" }}>
      <ApiFetch />
    </div>
  );
};

export default UseEffectExample;
