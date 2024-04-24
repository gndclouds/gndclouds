import Link from "next/link";
import { getAllMarkdownFiles } from "@/queries/all";

export default async function Home() {
  const data = await getAllMarkdownFiles();

  return (
    <main>
      <h1>Newsletters</h1>
      <ul>
        {data.map((d, i) => (
          <li key={d.slug}>
            <Link href={`/log/${d.slug}`}>{d.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
