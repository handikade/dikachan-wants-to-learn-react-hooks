import type { FormEvent } from "react";
import { RenderCountBadge } from "./RenderCountBadge";
import { useRenderCount } from "./useRenderCount";

type TodoFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function TodoForm({ value, onChange, onSubmit }: TodoFormProps) {
  const renderCount = useRenderCount();
  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", gap: "8px", alignItems: "center" }}
    >
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Add a new todo..."
        style={{ flex: 1, padding: "8px 12px", borderRadius: "8px" }}
      />
      <button type="submit" style={{ padding: "8px 12px" }}>
        Add
      </button>
      <RenderCountBadge label="Form" count={renderCount} />
    </form>
  );
}
