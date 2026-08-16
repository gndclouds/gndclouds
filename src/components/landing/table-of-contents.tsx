import Link from "next/link";

export interface TocSection {
  number: string;
  title: string;
  href: string;
  children?: string[];
}

const sections: TocSection[] = [
  {
    number: "01",
    title: "About",
    href: "/about",
    children: ["Bio", "CV"],
  },
  {
    number: "02",
    title: "Projects",
    href: "/projects",
  },
  {
    number: "03",
    title: "Journals",
    href: "/journals",
  },
  {
    number: "04",
    title: "Feed",
    href: "/feed",
  },
  {
    number: "05",
    title: "Library",
    href: "/library",
  },
  {
    number: "06",
    title: "Logs",
    href: "/logs",
  },
  {
    number: "07",
    title: "Research & studies",
    href: "/studies",
    children: ["Research", "Studies"],
  },
  {
    number: "08",
    title: "Newsletter",
    href: "/newsletters",
  },
  {
    number: "09",
    title: "Notes & fragments",
    href: "/notes",
    children: ["Notes", "Fragments"],
  },
  {
    number: "10",
    title: "People & links",
    href: "/people",
    children: ["People", "Links"],
  },
  {
    number: "11",
    title: "Collections",
    href: "/collections",
  },
  {
    number: "12",
    title: "Tags",
    href: "/tags",
  },
  {
    number: "13",
    title: "Terms and further reading",
    href: "/tags",
  },
];

function TocItem({ section }: { section: TocSection }) {
  return (
    <div className="group">
      <Link
        href={section.href}
        className="hover:opacity-70 transition-opacity"
      >
        <span className="text-primary-black font-normal">{section.number}</span>{" "}
        <span className="font-bold text-primary-black">{section.title}</span>
      </Link>
      {section.children && section.children.length > 0 && (
        <ul className="mt-1 ml-0 list-none">
          {section.children.map((child) => (
            <li
              key={child}
              className="text-primary-gray font-normal text-[0.95em] pl-[2ch]"
            >
              {child}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TableOfContentsLanding() {
  const currentYear = new Date().getFullYear();
  const leftColumn = sections.slice(0, 8);
  const rightColumn = sections.slice(8, 13);

  return (
    <main className="min-h-screen bg-primary-white text-primary-black font-inter">
      <div className="w-full px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-black mb-16 sm:mb-20">
          Table of contents
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-10 sm:gap-y-12">
          <div className="flex flex-col gap-y-8 sm:gap-y-10">
            {leftColumn.map((section) => (
              <TocItem key={section.number} section={section} />
            ))}
          </div>
          <div className="flex flex-col gap-y-8 sm:gap-y-10">
            {rightColumn.map((section) => (
              <TocItem key={section.number} section={section} />
            ))}
          </div>
        </div>

        <footer className="mt-20 sm:mt-28 pt-6 border-t border-primary-black">
          <div className="flex flex-wrap justify-between items-center gap-4 text-primary-black font-normal text-sm">
            <span>gndclouds</span>
            <span>{currentYear}</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
