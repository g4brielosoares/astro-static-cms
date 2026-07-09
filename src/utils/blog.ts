import { getCollection, type CollectionEntry } from "astro:content";
import slugify from "slugify";

export type Post = CollectionEntry<"blog">;

export interface PostData {
  title: string;
  slug: string;
  status: string;
  description?: string;
  author?: string;
  tags: string[];
  createdTime: Date;
  lastEditedTime?: Date;
  cover?: Post["data"]["heroImage"] | null;
  coverAlt?: string;
}

export interface TagArchive {
  name: string;
  slug: string;
  posts: Post[];
}

export function isPublishedPost(post: Post) {
  return post.data.status.trim().toLowerCase() === "publicado";
}

export function getPostSlug(post: Post) {
  return post.data.slug?.trim() || post.id.replace(/\/index$/, "");
}

export function getPostData(post: Post): PostData {
  return {
    title: post.data.title,
    slug: getPostSlug(post),
    status: post.data.status,
    description: post.data.description,
    author: post.data.author,
    tags: post.data.tags,
    createdTime: post.data.pubDate,
    lastEditedTime: post.data.updatedDate,
    cover: post.data.heroImage,
    coverAlt: post.data.coverAlt ?? post.data.title,
  };
}

export function sortPostsByDate(posts: Post[]) {
  return [...posts].sort((a, b) => {
    const aTime = getPostData(a).createdTime.getTime();
    const bTime = getPostData(b).createdTime.getTime();

    return bTime - aTime;
  });
}

export async function getPublishedPosts() {
  const posts = await getCollection("blog");

  return sortPostsByDate(posts.filter(isPublishedPost));
}

export function getTagSlug(tag: string) {
  return slugify(tag, {
    lower: true,
    strict: true,
    trim: true,
    locale: "pt",
  });
}

export function getTagPath(tag: string) {
  return `/blog/tags/${getTagSlug(tag)}/`;
}

export function getTagArchives(posts: Post[]) {
  const tags = new Map<string, TagArchive>();

  for (const post of posts) {
    for (const tag of new Set(getPostData(post).tags)) {
      const slug = getTagSlug(tag);
      const existing = tags.get(slug);

      if (existing) {
        existing.posts.push(post);
        continue;
      }

      tags.set(slug, {
        name: tag,
        slug,
        posts: [post],
      });
    }
  }

  return [...tags.values()].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
  );
}
