import { NewsItem } from "@/lib/news";

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return "TODAY";
  if (days === 1) return "1D AGO";
  if (days < 30) return `${days}D AGO`;
  const months = Math.floor(days / 30);
  return `${months}MO AGO`;
}

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-surface-border bg-surface p-4 hover:border-neon-green/40 hover:bg-surface-light transition-colors group"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[9px] font-mono uppercase tracking-wider text-neon-cyan">
          {item.source || "News"}
        </span>
        <span className="text-[9px] font-mono text-text-muted">
          {timeAgo(item.pubDate)}
        </span>
      </div>
      <h3 className="text-sm text-text-primary leading-snug group-hover:text-neon-green transition-colors">
        {item.title}
      </h3>
    </a>
  );
}
