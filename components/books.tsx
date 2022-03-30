import { useState } from "react";
import { useRouter } from "next/router";
import Container from "../components/container";
import Link from "next/link";
import Layout from "../components/layout";

export default function Books() {
  return (
    <>
      <Layout>Books!</Layout>
    </>
  );


{
  /* import { Box, Link, Text } from "@chakra-ui/react";
import Avatar from "./avatar";
import { Book } from "../../types/Okuclub";


const OkuclubBooks = ({ readingBooks }: { readingBooks: Array<Book> }) => {
  return (
    <Box padding={5} bg="black" borderRadius="lg" pos="relative">
      <Link href={siteMetadata.okuclubBooks.profile} isExternal={true}>
        <Text fontSize="md" color="gray.100" pb="5" textAlign="center">
          {siteMetadata.okuclubBooks.headline}
        </Text>
      </Link>

      <Box padding={5} pos="relative" height="0" pb="80%">
        {readingBooks &&
          readingBooks.length > 0 &&
          readingBooks.map((book, index) => {
            const { left, right, top, bottom, width, zIndex, transform } =
              AVATAR_POSITION_ARRAY[index];

            return (
              <Avatar
                key={book.name}
                book={book}
                left={left}
                right={right}
                top={top}
                bottom={bottom}
                width={width}
                zIndex={zIndex}
                transform={transform}
              />
            );
          })}
      </Box>
    </Box>
  );
};

export default OkuclubBooks; */
}
