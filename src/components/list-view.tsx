import Link from "next/link";

export default function ListView({ data }: { data: any[] }) {
  return (
    <div>
      {data.map((item, i) => (
        <div key={item.slug}>
          <Link href={`/log/${item.slug}`}>{item.title}</Link>
        </div>
      ))}
    </div>
  );
}
