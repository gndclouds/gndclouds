import { defineDocumentType, makeSource } from "contentlayer/source-files";

const Log = defineDocumentType(() => ({
  name: "Log",
  filePathPattern: `/logs/*.md`,
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
    published: {
      type: "boolean",
      description: "Should the Log be published",
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
      resolve: (doc) => {
        let path = doc._raw.flattenedPath.replace("publish/logs", "").trim();
        return `log/${path}`;
      },
    },
  },
}));

const Newsletter = defineDocumentType(() => ({
  name: "Newsletter",
  filePathPattern: `/newsletters/*.md`,
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
    published: {
      type: "boolean",
      description: "Should the Newsletter be published",
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
      resolve: (doc) => {
        let path = doc._raw.flattenedPath
          .replace("publish/newsletters", "")
          .trim();
        return `newsletter/${path}`;
      },
    },
  },
}));

const Note = defineDocumentType(() => ({
  name: "Note",
  filePathPattern: `**/*.md`,
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
    published: {
      type: "boolean",
      description: "Should the Note be published",
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
      resolve: (doc) => {
        let path = doc._raw.flattenedPath.replace("publish/notes", "").trim();
        return `note/${path}`;
      },
    },
  },
}));

const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `/projects/*.md`,
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
    published: {
      type: "boolean",
      description: "Should the Project be published",
      required: false,
    },
    tags: {
      type: "string",
      description: "The tags of the post",
      required: false,
    },
    url: {
      type: "string",
      description: "The url of the post",
      required: false,
    },
    aliases: {
      type: "string",
      description: "The aliases of the post",
      required: false,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => {
        let path = doc._raw.flattenedPath
          .replace("publish/projects", "")
          .trim();
        return `newsletter/${path}`;
      },
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Log, Newsletter, Note, Project],
});
