import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import ScrollReveal from "@/components/story/ScrollReveal";
import { ArticleBody, References, RelatedLinks } from "@/components/news/ArticleBody";
import { getPost, getRelated, headingId, posts } from "@/lib/news";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", images: [post.image] },
  };
}

export default function ArticlePage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const toc = post.blocks
    .filter((b): b is { t: "h2"; text: string } => b.t === "h2" && b.text.toLowerCase() !== "kết luận")
    .map((b) => ({ id: headingId(b.text), text: b.text }));
  const more = getRelated(post);

  return (
    <>
      <ScrollReveal />

      <article className="bg-background pt-28 pb-16 md:pt-36">
        <div className="container-custom">
          <Link
            href="/tin-tuc"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} /> Tin tức &amp; kiến thức
          </Link>

          <header className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{post.group}</span>
            <h1 className="mt-3 font-playfair text-3xl leading-[1.2] text-foreground md:text-5xl">{post.title}</h1>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-text-muted">
              <Clock size={15} /> {post.readMinutes} phút đọc
            </p>
          </header>

          <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-[32px] shadow-brand">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
          </div>

          <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="prose prose-lg max-w-3xl prose-headings:font-playfair prose-headings:text-foreground prose-h2:mt-12 prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:text-xl prose-p:text-text-muted prose-li:text-text-muted prose-strong:text-foreground prose-a:text-primary">
              <ArticleBody blocks={post.blocks} />

              {post.related.length > 0 && (
                <>
                  <h3>Gợi ý đọc thêm</h3>
                  <RelatedLinks titles={post.related} />
                </>
              )}
              {post.refs.length > 0 && (
                <>
                  <h3>Tài liệu tham khảo</h3>
                  <References items={post.refs} />
                </>
              )}
            </div>

            {toc.length > 0 && (
              <aside className="hidden lg:block">
                <nav className="sticky top-28 rounded-2xl bg-surface p-6" aria-label="Mục lục">
                  <p className="mb-3 font-playfair text-lg text-foreground">Nội dung bài viết</p>
                  <ul className="space-y-2 text-sm">
                    {toc.map((t) => (
                      <li key={t.id}>
                        <a href={`#${t.id}`} className="text-text-muted transition-colors hover:text-primary">
                          {t.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
            )}
          </div>
        </div>
      </article>

      {/* Bài viết khác */}
      <section className="bg-surface section-padding">
        <div className="container-custom">
          <h2 data-reveal className="mb-10 text-center font-playfair text-3xl text-foreground">
            Bài viết khác
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {more.map((p, i) => (
              <article
                key={p.slug}
                data-reveal={i * 0.1}
                className="group rounded-3xl bg-white/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-brand"
              >
                <Link href={`/tin-tuc/${p.slug}`} className="block">
                  <div className="relative aspect-video overflow-hidden rounded-2xl">
                    <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="px-2 pb-2 pt-5">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{p.group}</span>
                    <h3 className="mt-2 line-clamp-3 font-playfair text-lg font-bold leading-snug text-foreground">{p.title}</h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                      Đọc thêm <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
