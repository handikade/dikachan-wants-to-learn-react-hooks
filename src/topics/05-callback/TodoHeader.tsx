import { RenderCountBadge } from "./RenderCountBadge";
import { useRenderCount } from "./useRenderCount";

type TodoHeaderProps = {
  title: string;
  subtitle: string;
};

export function TodoHeader({ title, subtitle }: TodoHeaderProps) {
  const renderCount = useRenderCount();
  return (
    <header style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <h1 style={{ margin: 0 }}>{title}</h1>
      <p style={{ margin: 0, color: "#666" }}>{subtitle}</p>
      <RenderCountBadge label="Header" count={renderCount} />
    </header>
  );
}
