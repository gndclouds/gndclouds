import friendsData from "@/data/people.json";
import CollectionHero from "@/components/collection-hero";

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function FriendsPage() {
  const shuffledFriendsData = shuffleArray([...friendsData]);

  return (
    <main>
      <CollectionHero
        name="Projects"
        projects={shuffledFriendsData}
        allProjects={shuffledFriendsData}
      />
      <section className="flex flex-col gap-4">
        <h1>People working on cool things</h1>
        <ul>
          {shuffledFriendsData.map((friend) => (
            <li key={friend.name}>
              <a href={friend.link}>{friend.name}</a> - {friend.tags.join(", ")}
            </li>
          ))}
        </ul>{" "}
      </section>
    </main>
  );
}
