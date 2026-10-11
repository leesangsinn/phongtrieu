import Hero from "@/components/sections/Hero";
import StoryIntro from "@/components/home/StoryIntro";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ValuesGrid from "@/components/home/ValuesGrid";
import NewsPreview from "@/components/home/NewsPreview";
import { featured, getPost } from "@/lib/news";

// 3 bài tin tức thật lấy từ dữ liệu bài viết (nổi bật + 2 bài khác nhóm)
const previewSlugs = [
  featured.slug,
  "cach-pha-nuoc-mam-cham-ngon-cho-bua-com-gia-dinh",
  "nuoc-mam-cot-nghe-an-huong-vi-gan-voi-bua-com-que-nha",
];

export default function HomePage() {
  const previews = previewSlugs.flatMap((slug) => {
    const post = getPost(slug);
    return post
      ? [{ title: post.title, excerpt: post.excerpt, image: post.image, href: `/tin-tuc/${post.slug}` }]
      : [];
  });

  return (
    <>
      <Hero />
      <StoryIntro />
      <FeaturedProducts />
      <ValuesGrid />
      <NewsPreview posts={previews} />
    </>
  );
}
