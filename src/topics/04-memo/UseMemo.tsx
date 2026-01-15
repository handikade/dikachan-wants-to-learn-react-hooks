import { useMemo, useState, type JSX } from "react";
import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { CATEGORIES, generateItems, type Item } from "./generate-items";

const DATASET_SIZE = 8000;

type SortBy = "price-asc" | "price-desc" | "rating-desc";

const UseMemoExample = () => {
  return (
    <div style={{ margin: "0 auto", maxWidth: "900px" }}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="base" replace />} />
          <Route path="base" element={<CatalogBase />} />
          <Route path="optimized" element={<CatalogOptimized />} />
        </Route>
      </Routes>
    </div>
  );
};

export default UseMemoExample;

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
        <Link to="/memo/base">Catalog Base</Link>
        <Link to="/memo/optimized">Catalog Optimized</Link>
      </nav>
      <Outlet />
    </div>
  );
}

// #region PAGE(s)
function CatalogBase() {
  const [items] = useState<Item[]>(() => generateItems(DATASET_SIZE));
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [minRating, setMinRating] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>("price-asc");
  const [visibleCount, setVisibleCount] = useState(50);
  const [unrelatedCount, setUnrelatedCount] = useState(0);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  console.time("derive catalog");
  const filtered = items.filter((item) => {
    if (category !== "All" && item.category !== category) return false;
    if (item.rating < minRating) return false;
    if (
      normalizedSearch.length > 0 &&
      !item.name.toLowerCase().includes(normalizedSearch)
    ) {
      return false;
    }
    return true;
  });

  const sorted = [...filtered];
  if (sortBy === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else {
    sorted.sort((a, b) => b.rating - a.rating);
  }

  let totalPrice = 0;
  let topRating = 0;
  for (const item of filtered) {
    totalPrice += item.price;
    topRating = Math.max(topRating, item.rating);
  }
  const averagePrice = filtered.length ? totalPrice / filtered.length : 0;

  const visibleItems = sorted.slice(0, visibleCount);
  console.timeEnd("derive catalog");

  return (
    <CatalogView
      filter={
        <CatalogFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
          minRating={minRating}
          setMinRating={setMinRating}
          sortBy={sortBy}
          setSortBy={setSortBy}
          visibleCount={visibleCount}
          setVisibleCount={setVisibleCount}
        />
      }
      stats={
        <CatalogStats
          numberOfVisibleItems={visibleItems.length}
          numberOfFilteredItems={filtered.length}
          averagePrice={averagePrice}
          topRating={topRating}
          unrelatedCount={unrelatedCount}
          setUnrelatedCount={setUnrelatedCount}
        />
      }
      list={<CatalogList visibleItems={visibleItems} />}
    />
  );
}

function CatalogOptimized() {
  const [items] = useState<Item[]>(() => generateItems(DATASET_SIZE));
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [minRating, setMinRating] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>("price-asc");
  const [visibleCount, setVisibleCount] = useState(50);
  const [unrelatedCount, setUnrelatedCount] = useState(0);

  const { filtered, stats, sorted } = useMemo(() => {
    console.time("derive catalog");
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = items.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (item.rating < minRating) return false;
      if (
        normalizedSearch.length > 0 &&
        !item.name.toLowerCase().includes(normalizedSearch)
      ) {
        return false;
      }
      return true;
    });

    const sorted = [...filtered];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    let totalPrice = 0;
    let topRating = 0;
    for (const item of filtered) {
      totalPrice += item.price;
      topRating = Math.max(topRating, item.rating);
    }
    const averagePrice = filtered.length ? totalPrice / filtered.length : 0;

    console.timeEnd("derive catalog");

    return {
      filtered,
      sorted,
      stats: { averagePrice, topRating },
    };
  }, [items, searchTerm, category, minRating, sortBy]);

  const visibleItems = useMemo(() => {
    return sorted.slice(0, visibleCount);
  }, [sorted, visibleCount]);

  return (
    <CatalogView
      filter={
        <CatalogFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
          minRating={minRating}
          setMinRating={setMinRating}
          sortBy={sortBy}
          setSortBy={setSortBy}
          visibleCount={visibleCount}
          setVisibleCount={setVisibleCount}
        />
      }
      stats={
        <CatalogStats
          numberOfVisibleItems={visibleItems.length}
          numberOfFilteredItems={filtered.length}
          averagePrice={stats.averagePrice}
          topRating={stats.topRating}
          unrelatedCount={unrelatedCount}
          setUnrelatedCount={setUnrelatedCount}
        />
      }
      list={<CatalogList visibleItems={visibleItems} />}
    />
  );
}
// #endregion PAGE(s)

// #region UI(s)
function CatalogView({
  filter,
  stats,
  list,
}: {
  filter: JSX.Element;
  stats: JSX.Element;
  list: JSX.Element;
}) {
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <header>
        <h2 style={{ marginBottom: "6px" }}>Catalog Filter</h2>
        <p style={{ margin: 0, color: "#555" }}>
          Filter and sort a large list. This version recomputes everything on
          every render.
        </p>
      </header>

      {filter}

      {stats}

      {list}
    </div>
  );
}

function CatalogFilter({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  visibleCount,
  setVisibleCount,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  minRating: number;
  setMinRating: React.Dispatch<React.SetStateAction<number>>;
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      }}
    >
      <label style={{ display: "grid", gap: "6px" }}>
        <span>Search</span>
        <input
          type="text"
          value={searchTerm}
          placeholder="Item name"
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </label>

      <label style={{ display: "grid", gap: "6px" }}>
        <span>Category</span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="All">All</option>
          {CATEGORIES.map((currentCategory) => (
            <option key={currentCategory} value={currentCategory}>
              {currentCategory}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "grid", gap: "6px" }}>
        <span>Minimum rating: {minRating.toFixed(1)}</span>
        <input
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={minRating}
          onChange={(event) => setMinRating(Number(event.target.value))}
        />
      </label>

      <label style={{ display: "grid", gap: "6px" }}>
        <span>Sort by</span>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortBy)}
        >
          <option value="price-asc">Price (low to high)</option>
          <option value="price-desc">Price (high to low)</option>
          <option value="rating-desc">Rating (high to low)</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: "6px" }}>
        <span>Show</span>
        <select
          value={visibleCount}
          onChange={(event) => setVisibleCount(Number(event.target.value))}
        >
          <option value={25}>25 items</option>
          <option value={50}>50 items</option>
          <option value={100}>100 items</option>
          <option value={200}>200 items</option>
        </select>
      </label>
    </div>
  );
}

function CatalogStats({
  numberOfVisibleItems,
  numberOfFilteredItems,
  averagePrice,
  topRating,
  unrelatedCount,
  setUnrelatedCount,
}: {
  numberOfVisibleItems: number;
  numberOfFilteredItems: number;
  averagePrice: number;
  topRating: number;
  unrelatedCount: number;
  setUnrelatedCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        alignItems: "center",
      }}
    >
      <strong>
        Showing {numberOfVisibleItems} of {numberOfFilteredItems}
      </strong>
      <span>Average price: ${averagePrice.toFixed(2)}</span>
      <span>Top rating: {topRating.toFixed(1)}</span>
      <button type="button" onClick={() => setUnrelatedCount((v) => v + 1)}>
        Unrelated counter: {unrelatedCount}
      </button>
    </div>
  );
}

function CatalogList({ visibleItems }: { visibleItems: Item[] }) {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "grid",
        gap: "10px",
      }}
    >
      {visibleItems.map((item) => (
        <li
          key={item.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px 12px",
          }}
        >
          <div style={{ fontWeight: 600 }}>{item.name}</div>
          <div style={{ fontSize: "12px", color: "#555" }}>
            {item.category} · ${item.price.toFixed(2)} ·{" "}
            {item.rating.toFixed(1)}★
          </div>
        </li>
      ))}
    </ul>
  );
}
// #endregion UI(s)
