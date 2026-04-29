type IconProps = {
  name: string;
  className?: string;
};

export function Icon({ name, className = "h-6 w-6" }: IconProps) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": "true",
  };

  const icons: Record<string, React.ReactElement> = {
    chart: <svg {...common}><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 5-7" /></svg>,
    building: <svg {...common}><path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16" /><path d="M9 21v-5h4v5" /><path d="M8 7h1" /><path d="M12 7h1" /><path d="M8 11h1" /><path d="M12 11h1" /><path d="M19 21V9h1a2 2 0 0 1 2 2v10" /></svg>,
    check: <svg {...common}><path d="M20 6L9 17l-5-5" /></svg>,
    clipboard: <svg {...common}><path d="M9 4h6" /><path d="M9 2h6v4H9z" /><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" /><path d="M8 12h8" /><path d="M8 16h6" /></svg>,
    search: <svg {...common}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>,
    landmark: <svg {...common}><path d="M3 21h18" /><path d="M5 21V10" /><path d="M9 21V10" /><path d="M15 21V10" /><path d="M19 21V10" /><path d="M2 10h20" /><path d="M12 3L3 8h18z" /></svg>,
    line: <svg {...common}><path d="M3 18h18" /><path d="M4 15l5-5 4 3 7-8" /><path d="M20 5v5h-5" /></svg>,
    mail: <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>,
    pie: <svg {...common}><path d="M21 12A9 9 0 1 1 12 3v9z" /><path d="M12 3a9 9 0 0 1 9 9h-9z" /></svg>,
    shield: <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-5" /></svg>,
    users: <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    arrow: <svg {...common}><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></svg>,
    lock: <svg {...common}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>,
    file: <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h6" /></svg>,
  };

  return icons[name] ?? icons.chart;
}
