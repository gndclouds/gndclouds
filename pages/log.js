import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout className={styles.container}>
      <Head>
        <title>Log</title>
        <meta name='description' content='words' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <p>
          Decarbonizing human systems{" "}
          <a href='https://anthropogenic.com'>Anthopogenic</a>, exploring
          decentralized governance at
          <a href='https://darkmatterlabs.org'> Dark Matter Labs </a> co-running
          a community of{" "}
          <a href='https://tinyfactories.space'>Tiny Factories</a>.
          <br />
          My past roles have been a mix of research, design, and front-end
          development at research labs within IDEO, PARC, Intel, Fjord, and
          Protocol Labs.
        </p>
      </main>
    </Layout>
  );
}
