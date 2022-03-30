function Books({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://oku.club/api/users/profile/gndclouds`);
  const data = await res.json();

  // Pass data to the page via props
  return (
    <>
      <Layout>
        Books!
        <OkuClub />
      </Layout>
    </>
  );
}

export default Books;
