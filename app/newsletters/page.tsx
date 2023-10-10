import { allNewsletters } from "@/.contentlayer/generated";
import { compareDesc, format, parseISO } from "date-fns";

import Link from "next/link";

export default function NewsletterPage() {
  const newsletters = allNewsletters.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
  return (
    <div className=" dark:prose-invert">
      <div className="p-4 min-w-screen flex bg-gray-100">
        {/* Hero Section */}
        <div className="relative flex-1 h-[200px] rounded-2xl overflow-hidden">
          {/* <Image
            src="/path-to-your-image.jpg"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          /> */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute top-0 left-0 p-4">
            <div className="text-white text-largest uppercase">Newsletter</div>
          </div>
          <div className="absolute bottom-0 p-4 w-full">
            <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
              <div className="flex justify-start items-center">
                Updated:{" "}
                <time dateTime={newsletters[0].publishedAt}>
                  {format(parseISO(newsletters[0].publishedAt), "yyyy-MM-dd")}
                </time>
              </div>
              <div className="flex justify-center items-center">
                Number of {allNewsletters.length}
              </div>
              <div className="flex justify-end items-center">rss</div>
            </div>
          </div>
        </div>
      </div>
      {/* Logs Section */}

      <div className="p-4 min-w-screen ">
        {newsletters.map((newsletter) => (
          <article key={newsletter._id}>
            <Link href={newsletter.slug}>
              <h2>{newsletter.title}</h2>
            </Link>
            {/* {newsletter.description && <p>{newsletter.description}</p>} */}
          </article>
        ))}
      </div>
    </div>
  );
}
