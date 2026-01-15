import type { Filter } from "./todoTypes";
import { RenderCountBadge } from "./RenderCountBadge";
import { useRenderCount } from "./useRenderCount";

type FilterTabsProps = {
  filter: Filter;
  onChange: (filter: Filter) => void;
};

export function FilterTabs({ filter, onChange }: FilterTabsProps) {
  const renderCount = useRenderCount();
  return (
    <section style={{ display: "flex", gap: "8px" }}>
      <button
        type="button"
        onClick={() => onChange("all")}
        style={{
          padding: "6px 10px",
          borderRadius: "999px",
          border: "1px solid #ddd",
          background: filter === "all" ? "#f4f4f4" : "transparent",
        }}
      >
        All
      </button>
      <button
        type="button"
        onClick={() => onChange("active")}
        style={{
          padding: "6px 10px",
          borderRadius: "999px",
          border: "1px solid #ddd",
          background: filter === "active" ? "#f4f4f4" : "transparent",
        }}
      >
        Active
      </button>
      <button
        type="button"
        onClick={() => onChange("done")}
        style={{
          padding: "6px 10px",
          borderRadius: "999px",
          border: "1px solid #ddd",
          background: filter === "done" ? "#f4f4f4" : "transparent",
        }}
      >
        Done
      </button>
      <RenderCountBadge label="Filters" count={renderCount} />
    </section>
  );
}
