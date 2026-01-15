type RenderCountBadgeProps = {
  label: string;
  count: number;
};

export function RenderCountBadge({ label, count }: RenderCountBadgeProps) {
  return (
    <span style={{ fontSize: "12px", color: "#999" }}>
      {label} renders: {count}
    </span>
  );
}
