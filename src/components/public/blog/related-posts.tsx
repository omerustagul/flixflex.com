import { cn } from "@/lib/utils"
import { BlogCard } from "./blog-card"
import type { BlogPost } from "./blog-data"

interface RelatedPostsProps {
  posts: BlogPost[]
  className?: string
}

export function RelatedPosts({ posts, className }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className={cn("", className)}>
      <div className="flex items-center gap-4 mb-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#A134FF]">
          — İlgili Yazılar —
        </p>
        <span className="flex-1 h-px bg-[var(--border)]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
