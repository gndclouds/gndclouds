import { defineDocumentType, makeSource } from "contentlayer/source-files";

const Log = defineDocumentType(() => ({
  name: "Log",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    excerpt: {
      type: "string",
      description: "The exerpt of the post",
      required: false,
    },
    publishedAt: {
      type: "date",
      description: "The date of the post",
      required: true,
    },
    coverImage: {
      type: "string",
      description: "The OG of the post",
      required: false,
    },
    externalUrl: {
      type: "string",
      description: "The orginal publication of the post",
      required: false,
    },
    tags: {
      type: "string",
      description: "The tags of the post",
      required: false,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `log/${doc._raw.flattenedPath}`,
    },
  },
}));

const Newsletter = defineDocumentType(() => ({
  name: "Newsletter",
  filePathPattern: `/newsletters/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    excerpt: {
      type: "string",
      description: "The exerpt of the post",
      required: false,
    },
    publishedAt: {
      type: "date",
      description: "The date of the post",
      required: true,
    },
    coverImage: {
      type: "string",
      description: "The OG of the post",
      required: false,
    },
    externalUrl: {
      type: "string",
      description: "The orginal publication of the post",
      required: false,
    },
    tags: {
      type: "string",
      description: "The tags of the post",
      required: false,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `newsletter/${doc._raw.flattenedPath}`,
    },
  },
}));

const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    excerpt: {
      type: "string",
      description: "The exerpt of the post",
      required: false,
    },
    publishedAt: {
      type: "date",
      description: "The date of the post",
      required: true,
    },
    coverImage: {
      type: "string",
      description: "The OG of the post",
      required: false,
    },
    externalUrl: {
      type: "string",
      description: "The orginal publication of the post",
      required: false,
    },
    tags: {
      type: "string",
      description: "The tags of the post",
      required: false,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `blog/${doc._raw.flattenedPath}`,
    },
  },
}));

const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `/projects/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    excerpt: {
      type: "string",
      description: "The exerpt of the post",
      required: false,
    },
    publishedAt: {
      type: "date",
      description: "The date of the post",
      required: true,
    },
    coverImage: {
      type: "string",
      description: "The OG of the post",
      required: false,
    },
    externalUrl: {
      type: "string",
      description: "The orginal publication of the post",
      required: false,
    },
    tags: {
      type: "string",
      description: "The tags of the post",
      required: false,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Log, Newsletter, Blog, Project],
});
