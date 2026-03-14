# Blog System Setup

## Overview

A fully SEO-optimised blog has been added to Constitution.ky on the `feature/blog-system` branch.

## Routes

| URL | File |
|-----|------|
| `/blog` | `src/app/blog/page.tsx` |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` |

## Architecture

### Content storage

Articles are plain Markdown files at `content/blog/*.md`. The file `template.md` is excluded from the blog index and exists solely as a format reference.

### Frontmatter schema

```yaml
---
title: "Article Title"
description: "One-two sentence summary shown in search results and the index."
date: "YYYY-MM-DD"
tags: ["Tag One", "Tag Two"]
slug: "url-slug-here"
author: "Author Name"
---
```

### Library (`src/lib/blog.ts`)

- `getAllPosts()` — returns all posts sorted newest-first (used at build time by index and sitemap)
- `getAllPostSlugs()` — used by `generateStaticParams` for static generation of `[slug]` pages
- `getPostBySlug(slug)` — returns full post including raw Markdown content

### Markdown rendering

`remark` + `remark-html` convert Markdown to HTML at build time. Tailwind Typography (`@tailwindcss/typography`) styles the rendered HTML via the `prose` utility class.

## Dependencies added

| Package | Purpose |
|---------|---------|
| `gray-matter` | Parses YAML frontmatter from `.md` files |
| `remark` | Markdown AST processor |
| `remark-html` | Converts Markdown AST to HTML string |

## SEO features

- **`<title>` and `<meta description>`** via Next.js `generateMetadata` on each post page
- **Open Graph tags** (`og:title`, `og:description`, `og:url`, `og:type: article`, `og:published_time`, `og:tags`)
- **Twitter Card** tags (`summary_large_image`)
- **Canonical URLs** for every page
- **JSON-LD Article schema** embedded in each post page
- **Sitemap** — `src/app/sitemap.ts` now includes `/blog` and all individual post URLs

## Navigation

`Blog` link added to the main navigation (`src/components/Navigation.tsx`) and the footer (`src/app/layout.tsx`).

## Adding new articles

1. Copy `content/blog/template.md` to `content/blog/your-slug.md`
2. Fill in the frontmatter fields (ensure `slug` matches the filename)
3. Write the article body in Markdown below the `---` separator
4. Run `npm run build` — the new article is statically pre-rendered automatically

## Build output

Both the index and individual post pages are statically pre-rendered (SSG) with no server-side runtime requirement.

```
○ /blog
● /blog/[slug]
  ├ /blog/cayman-islands-constitution-complete-guide
  ├ /blog/how-cayman-islands-government-works
  └ /blog/understanding-the-cayman-islands-constitution
```
