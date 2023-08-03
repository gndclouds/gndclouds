import { format, parseISO } from "date-fns";
import { allBlogs } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

export const generateStaticParams = async () =>
  allBlogs.map((blog) => ({ slug: blog._raw.flattenedPath }));

export const generateMetadata = ({
  params: { slug, title },
}: {
  params: { slug: string; title: string };
}) => {
  const blog = allBlogs.find((blog) => blog._raw.flattenedPath === slug);
  const blogTitle = blog?.title ?? "Default Title";
  return { title: blogTitle };
};

const BlogLayout = ({ params }: { params: { slug: string } }) => {
  const blog = allBlogs.find(
    (blog) => blog._raw.flattenedPath === params.slug
  ) as (typeof allBlogs)[number];

  const Content = getMDXComponent(blog.body.code);

  return (
    <article className="py-8 mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <time
          dateTime={blog.publishedAt}
          className="mb-1 text-xs text-gray-600"
        >
          {format(parseISO(blog.publishedAt), "yyyy-MM-d, ")}
        </time>
        <h1>{blog.title}</h1>
      </div>
      <Content />
    </article>
  );
};

export default BlogLayout;
