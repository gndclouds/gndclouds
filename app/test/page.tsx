import Image from "next/image";

async function getChannel(collection: string) {
  const res = await fetch(`https://api.are.na/v2/channels/gc-logs`, {
    next: { revalidate: 10 },
  });
  console.log(res);
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
      <h1>{channel.title}</h1>
      {channel.contents.map((d: any) => (
        <div className="flex flex-col space-y-1 mb-4">
          <div className="w-full flex flex-col">
            <p>{d.generated_title}</p>
            <p>
              {/* s {!d.content ? <>d{d.description}</> : <>{d.content}</>} */}
            </p>
            <div>{!d.image.display ? <>Found Image</> : <>No Image</>} </div>
          </div>
        </div>
      ))}
    </>
  );
}
