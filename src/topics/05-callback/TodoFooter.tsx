import { RenderCountBadge } from "./RenderCountBadge";
import { useRenderCount } from "./useRenderCount";

type TodoFooterProps = {
  total: number;
  active: number;
  done: number;
};

export function TodoFooter({ total, active, done }: TodoFooterProps) {
  const renderCount = useRenderCount();
  return (
    <footer style={{ display: "flex", gap: "12px", color: "#666" }}>
      <span>Total: {total}</span>
      <span>Active: {active}</span>
      <span>Done: {done}</span>
      <RenderCountBadge label="Footer" count={renderCount} />
    </footer>
  );
}
