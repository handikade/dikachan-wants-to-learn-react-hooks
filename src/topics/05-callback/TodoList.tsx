import type { Todo } from "./todoTypes";
import { RenderCountBadge } from "./RenderCountBadge";
import { useRenderCount } from "./useRenderCount";

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: number) => void;
};

export function TodoList({ todos, onToggle }: TodoListProps) {
  const renderCount = useRenderCount();
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <RenderCountBadge label="List" count={renderCount} />
      {todos.length === 0 ? (
        <p style={{ margin: 0, color: "#888" }}>
          No todos match this filter.
        </p>
      ) : (
        todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
        ))
      )}
    </section>
  );
}

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
};

function TodoItem({ todo, onToggle }: TodoItemProps) {
  const renderCount = useRenderCount();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        border: "1px solid #eee",
        borderRadius: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            textDecoration: todo.done ? "line-through" : "none",
            color: todo.done ? "#999" : "#222",
          }}
        >
          {todo.text}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button type="button" onClick={() => onToggle(todo.id)}>
          {todo.done ? "Undo" : "Toggle Done"}
        </button>
        <RenderCountBadge label="Item" count={renderCount} />
      </div>
    </div>
  );
}
