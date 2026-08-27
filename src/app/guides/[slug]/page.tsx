import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/articles";

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | DurianMarket`,
    description: article.description,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
    },
  };
}

function jsonLd(article: { title: string; description: string; date: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: { "@type": "Organization", name: "DurianMarket" },
    mainEntityOfPage: `https://durianmarket.vercel.app/guides/${article.slug}`,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const others = getArticles().filter((a) => a.slug !== slug).slice(0, 6);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(article)) }}
      />

      <div className="mb-6">
        <div className="text-[10px] font-mono text-text-muted mb-2">
          <Link href="/guides" className="hover:text-neon-green">
            GUIDES
          </Link>{" "}
          / {article.date}
        </div>
        <h1 className="text-2xl font-bold font-mono text-text-primary">{article.title}</h1>
      </div>

      <article
        className="article-prose"
        dangerouslySetInnerHTML={{ __html: article.html }}
      />

      {others.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3 border-b border-surface-border pb-2">
            More guides
          </h2>
          <div className="flex flex-col gap-2">
            {others.map((a) => (
              <Link
                key={a.slug}
                href={`/guides/${a.slug}`}
                className="text-sm text-neon-blue/80 hover:text-neon-blue"
              >
                {a.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
