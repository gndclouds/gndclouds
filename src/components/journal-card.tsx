import Image from "next/image";
import Link from "next/link";
import type { Journal } from "@/queries/journals";

interface JournalWithDescription extends Journal {
  description?: string;
}

interface JournalCardProps {
  journal: JournalWithDescription;
}

export default function JournalCard({ journal }: JournalCardProps) {
  const description =
    journal.description ??
    (typeof journal.metadata?.description === "string"
      ? journal.metadata.description
      : "No description available");
  const imageSummary = description.slice(0, 200);
  const imageSrc = `/api/journals/hero-image?summary=${encodeURIComponent(imageSummary)}`;

  return (
    <Link
      href={`/journal/${journal.slug}`}
      className="group block rounded-xl overflow-hidden bg-primary-white"
    >
      <div className="relative w-full aspect-[4/3] bg-primary-gray overflow-hidden rounded-xl">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
      </div>
      <div className="px-0 py-4 sm:py-5 text-left bg-primary-white rounded-b-xl">
        <h3 className="font-normal text-primary-black text-sm line-clamp-1">
          {journal.title}
        </h3>
        <p className="text-primary-gray text-sm font-normal mt-1.5 line-clamp-3">
          {description}
        </p>
      </div>
    </Link>
  );
}
