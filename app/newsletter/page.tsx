import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allNewsletters, Newsletter } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

function NewsletterCard(newsletter: Newsletter) {
  const Content = getMDXComponent(newsletter.body.code);

  return (
    <div className="mb-8">
      <h2 className="text-xl">
        <Link
          href={newsletter.url}
          className="text-blue-700 hover:text-blue-900"
          legacyBehavior
        >
          {newsletter.title}
        </Link>
      </h2>
      <time
        dateTime={newsletter.publishedAt}
        className="block mb-2 text-xs text-gray-600"
      >
        {format(parseISO(newsletter.publishedAt), "LLLL d, yyyy")}
      </time>
      {/* <div className="text-sm">
        <Content />
      </div> */}
    </div>
  );
}

export default function Home() {
  const newsletters = allNewsletters.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );

  return (
    <div className="max-w-xl py-8 mx-auto">
      <h1 className="">Newsletters</h1>

      {newsletters.map((newsletter, idx) => (
        <NewsletterCard key={idx} {...newsletter} />
      ))}
    </div>
  );
}
