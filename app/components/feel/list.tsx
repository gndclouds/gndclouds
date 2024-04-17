import Link from "next/link";
import { fetchFilteredContent } from "@/app/queries/all";

export default async function FeedListView({
  query,
  currentPage,
  filter, // Add this new parameter
}: {
  query: string;
  currentPage: number;
  filter: string; // Add this new parameter
}) {
  const feed = await fetchFilteredContent(query, currentPage, filter); // Pass the filter parameter

  return (
    <div className="">
      <div className="">
        {feed?.items.map((item: any) => (
          <div key={item.id} className="">
            <Link href={item.slug} passHref>
              {item.title}
            </Link>
            <p>{new Date(item.publishedAt).toLocaleDateString()}</p>
            <p>{item.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
