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
        <h1>People</h1>
        <p>
          It&apos;s hard to keep track of all the incredible people I&apos;ve
          encountered—those whose conversations, work, or lives inspire me in
          countless ways. Here are some who come to mind when I ask myself whose
          work has deepened my own practice in some way.
        </p>
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
