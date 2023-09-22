import Link from "next/link";

   {/*
async function getData() {
  const res = await fetch("http://localhost:3000/api/timeline", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

type PostType = {
  id: number;
  updatedAt: string;
  createdAt: string;
  date: string;
  title: string;
  content: string;
};

function groupByWeek(posts: PostType[]) {
  const weeks: { [key: string]: PostType[] } = {};

  posts.forEach((post) => {
    const date = new Date(post.updatedAt);
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const weekKey = startOfWeek.toISOString().split("T")[0];

    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    weeks[weekKey].push(post);
  });

  return weeks;
}
*/}
export default async function Page() {
  {/* const data = await getData();
  const groupedPosts = groupByWeek(data.posts);*/}
  // console.log(data.posts);
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
      {/* {Object.entries(groupedPosts).map(([weekStartDate, postsInWeek]) => (
        <div key={weekStartDate} className="pb-9 border-t-4">
          <h2 className="uppercase">Week {weekStartDate}</h2>
          {postsInWeek.map((post: PostType) => (
            <Link key={post.id} href="#">
              <div className="">
                <div className="uppercase">{post.date}</div>
                <div className="font-bold">{post.title}</div>
              </div>
            </Link>
          ))}
        </div>
      ))} */}
    </div>
  );
}
