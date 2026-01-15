import { useState } from "react";
import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { FilterTabs } from "./FilterTabs";
import { RenderCountBadge } from "./RenderCountBadge";
import { TodoFooter } from "./TodoFooter";
import { TodoForm } from "./TodoForm";
import { TodoHeader } from "./TodoHeader";
import { TodoList } from "./TodoList";
import { useRenderCount } from "./useRenderCount";
import type { Filter, Todo } from "./todoTypes";

const UseCallbackExample = () => {
  return (
    <div style={{ margin: "0 auto", maxWidth: "600px" }}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="base" replace />} />
          <Route path="base" element={<Base />} />
          <Route path="*" element={<p>Not found</p>} />
        </Route>
      </Routes>
    </div>
  );
};

export default UseCallbackExample;

function Layout() {
  return (
    <div style={{ margin: "0 auto", maxWidth: "600px" }}>
      <nav
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "16px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link to="/state/base">Base</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function Base() {
  const renderCount = useRenderCount();
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Read the hooks docs", done: false },
    { id: 2, text: "Build a small Todo list", done: true },
    { id: 3, text: "Refactor with useCallback", done: false },
  ]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.done;
    if (filter === "done") return todo.done;
    return true;
  });

  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, done: false },
    ]);
    setText("");
  };

  const handleToggle = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const totalCount = todos.length;
  const activeCount = todos.filter((todo) => !todo.done).length;
  const doneCount = todos.filter((todo) => todo.done).length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        border: "1px solid #e6e6e6",
        borderRadius: "12px",
      }}
    >
      <RenderCountBadge label="Base" count={renderCount} />
      <TodoHeader
        title="Todo List"
        subtitle="Non-optimized version for useCallback practice."
      />

      <TodoForm value={text} onChange={setText} onSubmit={handleAdd} />

      <FilterTabs filter={filter} onChange={setFilter} />

      <TodoList todos={filteredTodos} onToggle={handleToggle} />

      <TodoFooter total={totalCount} active={activeCount} done={doneCount} />
    </div>
  );
}
