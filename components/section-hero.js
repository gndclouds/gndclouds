import Link from "next/link";

export default function PageHero({ PageDescription, quickLinks }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 border-indigo-600 rounded border-2">
          <div className="text-lg relative px-4 py-4 04 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
            <div className="text-xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {pathname}
            </div>
            {PageDescription}
          </div>
        </div>
        {!quickLinks.length && "No Links Found"}
        {quickLinks.map((quickLinks) => (
          <Link key={quickLinks.name} href={quickLinks.href}>
            <a className={quickLinks.color}>
              <div className="text-base">{quickLinks.name}</div>
              <div className="text-sm">{quickLinks.description}</div>
            </a>
          </Link>
        ))}
      </div>
    </>
  );
}
