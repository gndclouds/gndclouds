import Image from "next/image";

async function getChannelData(slug: string) {
  // console.log(slug);
  const res = await fetch(
    `https://api.are.na/v2/channels/ui-design-zyv0uejxmxs`
  );
  return res.json();
}

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  // Initiate both requests in parallel
  const channelData = getChannelData(slug);
  //const channelData = getChannelData(slug);

  // Wait for the promises to resolve
  const [channel] = await Promise.all([channelData]);
  // console.log(channel);
  return (
    <>
      <h1>{channel.title}</h1>
      <div className="grid grid-cols-4 gap-4">
        {channel.contents.map((d: any) => (
          <div key={d.id} className="flex flex-col space-y-1 mb-4">
            <div className="w-full flex flex-col">
              {!d.image.display ? (
                <>{d.content}</>
              ) : (
                <>
                  <Image
                    src={d.image.square.url}
                    width={500}
                    height={500}
                    alt="Picture of the author"
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
