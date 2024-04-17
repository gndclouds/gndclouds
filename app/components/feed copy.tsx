import Image from "next/image";
import Link from "next/link";
import { fetchFilteredContent } from "@/app/queries/all";

export default async function FeedListView({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const { items, totalPages } = await fetchFilteredContent(query, currentPage);
  return (
    <div className="p-8 text-small sm:text-standard bg-[#f0f0f0] dark:bg-opacity-10 overflow-y-auto">
      <dl className="">
        {items?.map((item: any, index: number) => (
          <div key={index}>
            {" "}
            {/* Add a div as a parent element and a key */}
            <Link href={item.slug} passHref>
              <h2>{item.title}</h2>
            </Link>
            <p>{new Date(item.publishedAt).toLocaleDateString()}</p>
            <p>{item.type}</p>
          </div>
        ))}
      </dl>
      {/* totalPages can be used for pagination but should not be directly rendered */}
    </div>
  );
}
