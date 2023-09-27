import Link from "next/link";

export default async function Page() {
  return (
    <div className="">
      <div className="pb-9">
        <div className="uppercase text-h1 font-bold">👋🏻</div>
        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-2 text-h3">
            Most of what I work on today is focused on exploring new ways to see
            ourselves in nature instead of adjacent to it. This happens through
            collaboration, fantastic teams, and a mix of serious and silly
            projects.
          </div>
        </div>{" "}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          className="w-full flex flex-col border-2 rounded p-4"
          href="/thoughts"
        >
          <div className="font-bold">Thoughts</div>
          <div className="text-p">sd</div>
        </Link>
        <Link
          className="w-full flex flex-col border-2 rounded p-4"
          href="/things"
        >
          <div className="font-bold">Things</div>
          <div className="text-p">sd</div>
        </Link>
      </div>
    </div>
  );
}
