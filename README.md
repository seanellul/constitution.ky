# Constitution.ky

**The Constitution of the Cayman Islands, made accessible to everyone.**

[constitution.ky](https://constitution.ky) is a free, open-source, interactive reader for the Cayman Islands Constitution Order 2009. It exists because we believe that every person in the Cayman Islands — regardless of their legal background — should be able to read, search, and understand the supreme law that governs their rights and their democracy.

---

## Why Open Source?

This project is open source because the Constitution belongs to the people, and the tools to access it should too.

**Open source means:**
- Anyone can read the code, verify what it does, and trust that it works in the public interest
- Anyone can contribute improvements — whether that's fixing a typo, adding a feature, or translating content
- No single company or individual controls access to this civic resource
- The project can outlive any one contributor and continue serving the community

We believe civic technology should be transparent, community-owned, and free from commercial gatekeeping. Open source is how we put that belief into practice.

## Our Stance on Civic Empowerment

Constitutions are often treated as documents only lawyers can understand. We reject that idea.

The Cayman Islands Constitution establishes the rights of every person in the territory — the right to life, to a fair trial, to free expression, to privacy, to property. It defines how government works, how laws are made, and how power is checked. These aren't abstract legal concepts. They affect every resident, every day.

Constitution.ky exists to:
- **Democratise access** to constitutional knowledge
- **Lower the barrier** between people and their rights
- **Show civic engagement** through transparent, anonymous open data on what people are reading and searching
- **Invite participation** — this is a community project, and contributions are welcome

---

## Features

- **Full constitutional text** — All 125 sections across 9 parts, faithfully reproduced
- **Advanced search** — Full-text search with relevance scoring
- **Cross-references** — Links between related constitutional provisions
- **Amendment history** — Track how the Constitution has been amended (2016, 2020)
- **Topic pages** — Browse the Constitution by theme (human rights, judiciary, elections, etc.)
- **Glossary** — Plain-English definitions of constitutional terms
- **Blog** — Articles explaining constitutional concepts in accessible language
- **Open Data** — See what people are reading and searching, promoting civic transparency
- **Reading progress** — Track which sections you've read
- **Share & cite** — Copy formatted citations for any section
- **Text size controls** — Adjust reading text size for accessibility
- **Dark mode** — Full dark mode support
- **Mobile responsive** — Works on all devices
- **Keyboard navigation** — Arrow keys to move between sections
- **PWA** — Installable as a native app

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Analytics | [PostHog](https://posthog.com) (privacy-respecting, self-hostable) |
| Deployment | [Vercel](https://vercel.com) |
| Content | Markdown (blog), JSON (constitutional articles) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- npm

### Install and run locally

```bash
# Clone the repository
git clone https://github.com/seanellul/constitution.ky.git
cd constitution.ky

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

### Environment variables (optional)

These are only needed for analytics features. The site works fully without them.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key (client-side, for event tracking) |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL (defaults to `https://us.i.posthog.com`) |
| `POSTHOG_API_KEY` | PostHog private API key (server-side, for querying insights) |
| `POSTHOG_PROJECT_ID` | PostHog project ID (for the Open Data dashboard) |

---

## Project Structure

```
constitution.ky/
├── articles/                  # Constitutional text as JSON files
│   ├── chapter_1/             # Part I: Bill of Rights (28 articles)
│   ├── chapter_2/             # Part II: The Governor (14 articles)
│   ├── ...                    # Parts III–IX
│   └── constitution_toc.json  # Table of contents
├── content/
│   └── blog/                  # Blog posts as Markdown files
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── blog/              # Blog index and article pages
│   │   ├── constitution/      # Constitution reader pages
│   │   ├── glossary/          # Glossary term pages
│   │   ├── topics/            # Topic landing pages
│   │   ├── open-data/         # Public analytics dashboard
│   │   └── search/            # Search page
│   ├── components/            # React components
│   ├── data/                  # Topics and glossary data
│   └── lib/                   # Utilities, analytics, blog parser
└── public/                    # Static assets, robots.txt, llms.txt
```

## Constitutional Structure

The Cayman Islands Constitution Order 2009 comprises 9 parts and 125 sections:

| Part | Title | Sections |
|------|-------|----------|
| I | Bill of Rights, Freedoms and Responsibilities | 1–28 |
| II | The Governor | 29–42 |
| III | The Executive | 43–58 |
| IV | The Legislature | 59–93 |
| V | The Judicature | 94–107 |
| VI | The Public Service | 108–110 |
| VII | Finance | 111–115 |
| VIII | Institutions Supporting Democracy | 116–122 |
| IX | Miscellaneous | 123–125 |

The Constitution has been amended by:
- **SI 2016/780** — Judiciary reforms (judicial retirement age, disciplinary authority)
- **SI 2020/1283** — Governance reforms (Cabinet size, Parliament rename, Police Service Commission, removal of UK disallowance power)

---

## Contributing

Contributions are welcome. Whether you're a developer, a legal professional, a student, or just someone who cares about civic access — there's a way to help.

### Ways to contribute

- **Report bugs** — [Open an issue](https://github.com/seanellul/constitution.ky/issues)
- **Suggest features** — Ideas for making the Constitution more accessible
- **Write blog posts** — Add a `.md` file to `content/blog/` following the [template](content/blog/template.md)
- **Improve content** — Better definitions, cross-references, or topic pages
- **Fix code** — Bug fixes, performance improvements, accessibility enhancements
- **Translate** — Help make the Constitution available in other languages

### Writing a blog post

1. Copy `content/blog/template.md` to `content/blog/your-slug.md`
2. Fill in the YAML frontmatter (title, description, date, tags, slug, author)
3. Write your article in Markdown
4. Submit a pull request

### Development workflow

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run linter
```

---

## Disclaimer

Constitution.ky is an educational resource. The constitutional text is faithfully reproduced from the [official Cayman Islands Constitution Order 2009](https://www.legislation.gov.uk/uksi/2009/1379/schedule/2/made) published by the UK government. For authoritative legal reference, always consult the official source.

References to "Her Majesty" in the constitutional text now apply to His Majesty King Charles III by operation of the [Interpretation Act 1978](https://www.legislation.gov.uk/ukpga/1978/30/section/6).

## License

This project is open source. The constitutional text is Crown Copyright and is reproduced under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

---

Built with care for the Cayman Islands community.
