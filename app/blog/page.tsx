import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allBlogs, Blog } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

function BlogCard(blog: Blog) {
  const Content = getMDXComponent(blog.body.code);

  return (
    <div className="mb-8">
      <h2 className="text-xl">
        <Link
          href={blog.url}
          className="text-blue-700 hover:text-blue-900"
          legacyBehavior
        >
          {blog.title}
        </Link>
      </h2>

      <div className="text-sm">{/* <Content /> */}</div>
    </div>
  );
}

export default function Home() {
  const blogs = allBlogs

  return (
    <div className="max-w-xl py-8 mx-auto">
      <h1 className="">Blogs</h1>

      {blogs.map((blog, idx) => (
        <BlogCard key={idx} {...blog} />
      ))}
    </div>
  );
}
