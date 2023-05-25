import type { Metadata } from "next";
import { GetStaticProps, NextPage } from "next";
import fetch from "isomorphic-unfetch";

// Define your page component props
interface MyPageProps {
  data: any; // Replace 'any' with the appropriate type for your data
}

// Your Next.js page component
const MyPage: NextPage<MyPageProps> = ({ data }) => {
  // Use the fetched data here
  return <div>{/* Render your page content */}</div>;
};

export default MyPage;

export const getStaticProps: GetStaticProps<MyPageProps> = async () => {
  // Make the API request to Are.na
  const response = await fetch(
    "https://api.are.na/v2/channels/log-2rhbr5edb3k"
  );

  if (!response.ok) {
    console.error("Failed to fetch data from Are.na");
    return { props: {} };
  }

  const data = await response.json();

  return {
    props: { data },
  };
};
