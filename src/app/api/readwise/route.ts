import { NextResponse } from "next/server";
import { getReadwiseBooksSummary } from "@/queries/readwise";

// Add export config for static generation
export const dynamic = "force-static";

// Helper function to add a delay (useful for demonstrating loading states)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  try {
    // For static generation, we can't use dynamic parameters
    // Instead, we'll fetch all books and filter on the client side if needed
    console.log(`API route called`);
    console.log(
      `READWISE_ACCESS_TOKEN exists: ${!!process.env.READWISE_ACCESS_TOKEN}`
    );

    // Add a small delay to better demonstrate the loading state
    // Remove this in production if you don't want the artificial delay
    await delay(1000);

    // Get all books - filtering will happen on client side
    const books = await getReadwiseBooksSummary({ recommendedOnly: false });

    console.log(`Received ${books ? books.length : 0} books from Readwise API`);

    if (!books || books.length === 0) {
      console.log("No books found, returning 404");
      return NextResponse.json(
        {
          message: "No books found",
          tokenExists: !!process.env.READWISE_ACCESS_TOKEN,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching Readwise data:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch Readwise data",
        error: error instanceof Error ? error.message : String(error),
        tokenExists: !!process.env.READWISE_ACCESS_TOKEN,
      },
      { status: 500 }
    );
  }
}
