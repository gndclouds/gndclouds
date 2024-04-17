import { defineDocumentType, makeSource } from "contentlayer/source-files";

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath.split('/').map(toSlug).join('/')}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
};




export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
  },
  computedFields,
}));

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
  },
  computedFields,
}));

export const Log = defineDocumentType(() => ({
  name: "Log",
  filePathPattern: `logs/**/*.md`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    publishedAt: {
      type: "date",
      description: "The date of the Log",
      required: true,
    },
    published: {
      type: "boolean",
      description: "Should the Log be published",
      required: true,
    },
    url: {
      type: "string",
      description: "Should the project be published",
      required: false,
    },
    heroImage: {
      type: "string",
      required: false,
    },
  },
  computedFields,
}));

export const Newsletter = defineDocumentType(() => ({
  name: "Newsletter",
  filePathPattern: `newsletters/**/*.md`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    publishedAt: {
      type: "date",
      description: "The date of the Newsletters",
      required: false,
    },
    published: {
      type: "boolean",
      description: "Should the Newsletter be published",
      required: true,
    },
  },
  computedFields,
}));

export const Note = defineDocumentType(() => ({
  name: "Note",
  filePathPattern: `notes/**/*.md`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    publishedAt: {
      type: "date",
      description: "Date first published",
      required: true,
    },
    updatedAt: {
      type: "date",
      description: "Date of most recent edits",
      required: true,
    },
    published: {
      type: "boolean",
      description: "Should the project be published",
      required: true,
    },
    url: {
      type: "string",
      description: "Should the project be published",
      required: false,
    },
    heroImage: {
      type: "string",
      required: false,
    },
  },
  computedFields,
}));

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/**/*.md`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: false,
    },
    publishedAt: {
      type: "date",
      description: "Date first published",
      required: true,
    },
    updatedAt: {
      type: "date",
      description: "Date of most recent edits",
      required: true,
    },
    published: {
      type: "boolean",
      description: "Should the project be published",
      required: true,
    },
    url: {
      type: "string",
      description: "Should the project be published",
      required: true,
    },
    heroImage: {
      type: "string",
      required: false,
    },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: "./db/content",
  documentTypes: [Log, Page, Post, Newsletter, Note, Project],
});

