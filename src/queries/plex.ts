import fetch from "node-fetch";

async function getPublicPlexWatchList() {
  const url = "https://rss.plex.tv/97877319-944b-4b49-8504-5e72f7a9cd99";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Ensure the entire response is read by using response.text()
    const data = await response.text();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching public Plex watch list:", error);
    return null;
  }
}

export { getPublicPlexWatchList };
