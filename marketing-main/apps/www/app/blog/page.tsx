import { BlogHero } from "@/components/blog/blog-hero";
import { ClientBlogGrid } from "@/components/blog/client-blog-grid";
import { CTA } from "@/components/cta";
import {
  TopLeftShiningLight,
  TopRightShiningLight,
} from "@/components/svg/background-shiny";
import { authors } from "@/content/blog/authors";
import { type Post, allPosts } from "content-collections";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Blog | Vietcod",
  description: "Latest blog posts and news from the Vietcod team.",
  openGraph: {
    title: "Blog | Vietcod",
    description: "Latest blog posts and news from the Vietcod team.",
    url: "https://vietcod.com/blog",
    siteName: "vietcod.com",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 675,
      },
    ],
  },
  twitter: {
    title: "Blog | Vietcod",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/vietcod.ico",
  },
};

export default async function Blog() {
  const posts = allPosts.sort((a: Post, b: Post) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const featuredPost = posts[0];
  const blogGridPosts = posts.slice(1, posts.length);

  return (
    <>
      <div className="container w-full pt-48 mx-auto overflow-hidden scroll-smooth">
        <div>
          <TopLeftShiningLight />
        </div>
        <div>
          <TopRightShiningLight />
        </div>

        {featuredPost ? (
          <div className="w-full px-0 mx-0 rounded-3xl">
            <Link href={`${featuredPost.url}`} key={featuredPost.url}>
              <BlogHero
                tags={featuredPost.tags}
                imageUrl={
                  featuredPost.image ?? "/images/blog-images/defaultBlog.png"
                }
                title={featuredPost.title}
                subTitle={featuredPost.description}
                author={authors[featuredPost.author]}
                publishDate={featuredPost.date}
              />
            </Link>
          </div>
        ) : null}

        <Suspense
          fallback={
            <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
          }
        >
          <ClientBlogGrid posts={blogGridPosts} />
        </Suspense>
        <CTA />
      </div>
    </>
  );
}
