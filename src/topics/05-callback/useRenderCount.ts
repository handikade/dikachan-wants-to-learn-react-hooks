import { useState } from "react";

const renderCountStore = new WeakMap<object, number>();

export function useRenderCount() {
  const [key] = useState(() => ({}));
  const count = (renderCountStore.get(key) ?? 0) + 1;
  renderCountStore.set(key, count);
  return count;
}
