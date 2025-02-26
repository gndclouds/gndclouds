import { NextResponse } from "next/server";
import { getReadwiseBooksSummary } from "@/queries/readwise";

// Helper function to add a delay (useful for demonstrating loading states)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  try {
    // Parse URL to get query parameters
    const { searchParams } = new URL(request.url);
    const recommendedOnly = searchParams.get("recommended") === "true";

    console.log(`API route called with recommendedOnly=${recommendedOnly}`);
    console.log(
      `READWISE_ACCESS_TOKEN exists: ${!!process.env.READWISE_ACCESS_TOKEN}`
    );

    // Add a small delay to better demonstrate the loading state
    // Remove this in production if you don't want the artificial delay
    await delay(1000);

    // Pass the recommendedOnly option to filter by 'recommend' tag
    const books = await getReadwiseBooksSummary({ recommendedOnly });

    console.log(`Received ${books ? books.length : 0} books from Readwise API`);

    if (!books || books.length === 0) {
      console.log("No books found, returning 404");
      return NextResponse.json(
        {
          message: "No books found with 'recommend' tag",
          recommendedOnly,
          tokenExists: !!process.env.READWISE_ACCESS_TOKEN,
        },
        { status: 404 }
      );
    }

    // No need to filter here anymore since it's done in getReadwiseBooksSummary
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching Readwise data:", error);
    // Get searchParams again in case it wasn't available in the try block
    const recommendedOnly =
      new URL(request.url).searchParams.get("recommended") === "true";

    return NextResponse.json(
      {
        message: "Failed to fetch Readwise data",
        error: error instanceof Error ? error.message : String(error),
        recommendedOnly,
        tokenExists: !!process.env.READWISE_ACCESS_TOKEN,
      },
      { status: 500 }
    );
  }
}
