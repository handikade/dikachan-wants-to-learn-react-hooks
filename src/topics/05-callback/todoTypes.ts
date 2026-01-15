export type Filter = "all" | "active" | "done";

export type Todo = {
  id: number;
  text: string;
  done: boolean;
};
