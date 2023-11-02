import { allNewsletters } from "@/.contentlayer/generated";
import { compareDesc, format, parseISO } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Mdx } from "@/components/mdx-components";

function hasPublishedAt(
  item: (typeof allNewsletters)[0]
): item is (typeof allNewsletters)[0] & { publishedAt: string } {
  return item.publishedAt !== undefined;
}

export default function NewsletterPage() {
  // Use the type guard in the filter
  const validNewsletters = allNewsletters.filter(hasPublishedAt);

  // Now, this should not throw any TypeScript errors
  const newsletters = validNewsletters.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
  return (
    <div className=" dark:prose-invert">
      <div className="p-4 min-w-screen flex">
        {/* Hero Section */}
        <div className="relative flex-1 h-[200px] rounded-2xl overflow-hidden">
          <Image
            src="https://source.unsplash.com/user/gndclouds"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute top-0 left-0 p-4">
            <div className="text-white  uppercase">
              <Link href="/" className="font-bold">
                gndclouds
              </Link>
            </div>
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
      {/* Newsletter Section */}

      <div className="p-4 min-w-screen">
        {newsletters.map((newsletter) => (
          <article key={newsletter._id} className="py-12 border-b-4">
            <div>
              <div className="text-large">{newsletter.title}</div>
            </div>
            <Mdx code={newsletter.body.code} />
          </article>
        ))}
      </div>
    </div>
  );
}
