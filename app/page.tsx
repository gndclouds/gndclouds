async function getData() {
  const res = await fetch("http://localhost:3003//api/timeline");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

type PostType = {
  id: number;
  updatedAt: string; // Assuming date is in ISO string format, you can adjust as per your needs
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

export default async function Page() {
  const data = await getData();
  const groupedPosts = groupByWeek(data.posts);
  console.log(data.posts);
  return (
    <main className="">
      {Object.entries(groupedPosts).map(([weekStartDate, postsInWeek]) => (
        <div key={weekStartDate}>
          <h2>Week of {weekStartDate}</h2>
          {postsInWeek.map((post: PostType) => (
            <div key={post.id} className="">
              <div className="uppercase">{post.date}</div>
              <div className="">{post.title}</div>
              <div className="">{post.content}</div>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
