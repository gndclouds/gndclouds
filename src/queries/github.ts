import axios from "axios";

export interface GitHubActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  publishedAt: string;
  repoName: string;
  repoUrl: string;
  uri: string;
  author: {
    username: string;
    avatar?: string;
  };
}

/**
 * Formats a GitHub event into a standardized activity object
 */
function formatGitHubEvent(event: any): GitHubActivity | null {
  const username = event.actor?.login || "unknown";
  const avatar = event.actor?.avatar_url;
  const repoName = event.repo?.name || "unknown";
  const repoUrl = `https://github.com/${repoName}`;
  const publishedAt = event.created_at;
  const eventId = event.id;

  let title = "";
  let description = "";
  let uri = repoUrl;

  // Format different event types
  switch (event.type) {
    case "PushEvent":
      const commits = event.payload?.commits || [];
      const commitCount = commits.length;
      title = `Pushed ${commitCount} commit${
        commitCount === 1 ? "" : "s"
      } to ${repoName}`;
      description = commits.map((commit: any) => commit.message).join(", ");
      uri = `${repoUrl}/commit/${commits[0]?.sha}`;
      break;

    case "CreateEvent":
      const refType = event.payload?.ref_type || "branch";
      const ref = event.payload?.ref || "";
      title = `Created ${refType} ${ref} in ${repoName}`;
      description = `New ${refType} created`;
      uri = `${repoUrl}/${
        refType === "branch" ? "tree" : "releases/tag"
      }/${ref}`;
      break;

    case "PullRequestEvent":
      const prAction = event.payload?.action || "opened";
      const prNumber = event.payload?.pull_request?.number || "0";
      const prTitle = event.payload?.pull_request?.title || "";
      title = `${prAction} pull request #${prNumber} in ${repoName}`;
      description = prTitle;
      uri = event.payload?.pull_request?.html_url || repoUrl;
      break;

    case "IssuesEvent":
      const issueAction = event.payload?.action || "opened";
      const issueNumber = event.payload?.issue?.number || "0";
      const issueTitle = event.payload?.issue?.title || "";
      title = `${issueAction} issue #${issueNumber} in ${repoName}`;
      description = issueTitle;
      uri = event.payload?.issue?.html_url || repoUrl;
      break;

    case "IssueCommentEvent":
      const commentIssueNumber = event.payload?.issue?.number || "0";
      title = `Commented on issue #${commentIssueNumber} in ${repoName}`;
      description = event.payload?.comment?.body?.substring(0, 100) || "";
      if (description.length >= 100) description += "...";
      uri = event.payload?.comment?.html_url || repoUrl;
      break;

    case "WatchEvent":
      title = `Starred ${repoName}`;
      description = `Added ${repoName} to starred repositories`;
      break;

    case "ForkEvent":
      title = `Forked ${repoName}`;
      description = `Created a fork of ${repoName}`;
      uri = event.payload?.forkee?.html_url || repoUrl;
      break;

    case "ReleaseEvent":
      const releaseName =
        event.payload?.release?.name || event.payload?.release?.tag_name || "";
      title = `Released ${releaseName} for ${repoName}`;
      description = event.payload?.release?.body?.substring(0, 100) || "";
      if (description.length >= 100) description += "...";
      uri = event.payload?.release?.html_url || repoUrl;
      break;

    default:
      // Skip events we don't handle
      return null;
  }

  return {
    id: eventId,
    type: "github",
    title,
    description,
    publishedAt,
    repoName,
    repoUrl,
    uri,
    author: {
      username,
      avatar,
    },
  };
}

/**
 * Fetches recent GitHub activity for a user
 * @param username The GitHub username to fetch activity for
 * @param limit The maximum number of items to fetch (default: 30)
 * @returns An array of formatted GitHub activity items
 */
export async function getGitHubActivity(
  username: string,
  limit: number = 30
): Promise<GitHubActivity[]> {
  try {
    console.log(`Fetching GitHub activity for user: ${username}`);

    // GitHub API has a rate limit, so we'll use a token if available
    const githubToken =
      process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
    const headers: Record<string, string> = {};

    if (githubToken) {
      console.log("Using GitHub token for authentication");
      headers.Authorization = `Bearer ${githubToken}`;
    } else {
      console.log(
        "No GitHub token found, using unauthenticated requests (rate limited)"
      );
    }

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      // Fetch public events for the user
      const response = await axios.get(
        `https://api.github.com/users/${username}/events/public?per_page=${limit}`,
        {
          headers,
          timeout: 15000,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.data || !Array.isArray(response.data)) {
        console.log("No GitHub events found or invalid response");
        return [];
      }

      const events = response.data;
      console.log(`Found ${events.length} GitHub events for ${username}`);

      // Format the events
      const formattedActivities = events
        .map(formatGitHubEvent)
        .filter((activity): activity is GitHubActivity => activity !== null);

      console.log(
        `Formatted ${formattedActivities.length} GitHub activities for feed`
      );
      return formattedActivities;
    } catch (error) {
      clearTimeout(timeoutId);

      if ((error as Error).name === "AbortError") {
        console.error("GitHub API request timed out");
        return [];
      }

      console.error("Error fetching GitHub activity:", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          console.error("GitHub API rate limit exceeded");
        } else {
          console.error(
            "API response:",
            error.response.status,
            error.response.data
          );
        }
      }
      return [];
    }
  } catch (error) {
    console.error("Error in getGitHubActivity:", error);
    return [];
  }
}

/**
 * Fetches all available GitHub activity for a user (up to 300 events)
 * @param username The GitHub username to fetch activity for
 * @returns An array of formatted GitHub activity items
 */
export async function getAllGitHubActivity(
  username: string
): Promise<GitHubActivity[]> {
  const perPage = 30;
  const maxPages = 10; // GitHub API allows up to 300 events
  let allEvents: any[] = [];
  const githubToken = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {};
  if (githubToken) {
    headers.Authorization = `token ${githubToken}`;
  }
  for (let page = 1; page <= maxPages; page++) {
    const response = await axios.get(
      `https://api.github.com/users/${username}/events/public?per_page=${perPage}&page=${page}`,
      { headers }
    );
    if (
      !response.data ||
      !Array.isArray(response.data) ||
      response.data.length === 0
    ) {
      break;
    }
    allEvents = allEvents.concat(response.data);
    if (response.data.length < perPage) {
      break;
    }
  }
  // Format the events
  const formattedActivities = allEvents
    .map(formatGitHubEvent)
    .filter((activity): activity is GitHubActivity => activity !== null);
  return formattedActivities;
}
