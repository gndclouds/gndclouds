import Link from "next/link";
async function getChannel(collection: string) {
  const res = await fetch(
    `https://api.are.na/v2/channels/collections-r3pfcbxeb_q`
  );
  // console.log(res);
  return res.json();
}

export default async function Page({
  params: { collection },
}: {
  params: { collection: string };
}) {
  // Initiate both requests in parallel
  const channelData = getChannel(collection);

  // Wait for the promises to resolve
  const [channel] = await Promise.all([channelData]);

  return (
    <>
      <h1>Collection</h1>
      <div className="">
        <div className="">✨ Inspiration</div>
        <div className="">🔬 Research</div>
      </div>
      {channel.contents.map((d: any) => (
        <Link
          key={d.id}
          className="flex flex-col space-y-1 mb-4"
          href={`/collection/${d.slug}`}
        >
          <div className="w-full flex flex-col">
            <p>{d.title}</p>
          </div>
        </Link>
      ))}
    </>
  );
}
