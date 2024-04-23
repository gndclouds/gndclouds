import Link from "next/link";
import { fetchFilteredContent } from "@/app/queries/all";

export default async function FeedListView({
  query,
  currentPage,
  filter,
  selectedTypes,
}: {
  query: string;
  currentPage: number;
  filter: string;
  selectedTypes: Set<string>;
}) {
  const feed = await fetchFilteredContent(query, currentPage, filter); // Pass the filter parameter
  const filteredData = feed?.items.filter((item) =>
    selectedTypes ? selectedTypes.has(item.type) : true
  );

  return (
    <div className="">
      <div className="">
        {filteredData.map((item: any) => (
          <div
            key={item.id}
            className=""
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <p style={{ textTransform: "uppercase", opacity: 0.5 }}>
              {item.type}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Link href={item.slug} passHref>
                <b>{item.title}</b>
              </Link>
              <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
