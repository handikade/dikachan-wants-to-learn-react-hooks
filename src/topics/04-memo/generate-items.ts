export type Item = {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
};

export const CATEGORIES = [
  "Books",
  "Electronics",
  "Toys",
  "Clothing",
  "Home",
] as const;

export function generateItems(count: number): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < count; i += 1) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const price = Math.round((Math.random() * 500 + 5) * 100) / 100;
    const rating = Math.round((Math.random() * 4 + 1) * 10) / 10; // 1.0-5.0
    items.push({
      id: i + 1,
      name: `Item ${i + 1}`,
      category,
      price,
      rating,
    });
  }
  return items;
}
