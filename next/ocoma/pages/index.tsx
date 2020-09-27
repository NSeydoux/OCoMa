import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

import {
  SessionProvider,
  LoginButton,
  LogoutButton,
  useSession,
  DatasetProvider,
  ThingProvider,
  Text
} from "@inrupt/solid-ui-react";
import React, { useState } from 'react';

export const redirectUrl = "http://localhost:3000/";

export function Name() {
  const { session, sessionRequestInProgress } = useSession();
  if (sessionRequestInProgress) return <p>Loading...</p>;
  const webId = session.info.webId;
  if (webId) {
    return (
      <DatasetProvider datasetUrl={webId}>
        <ThingProvider thingUrl={webId}>
          <Text
            edit={false}
            property="http://xmlns.com/foaf/0.1/name"
          />
        </ThingProvider>
      </DatasetProvider>
    );
  } else {
    return <span>Anon</span>
  }
}

function openNav(e) {
  document.getElementById("sideNav").style.width = "250px";
}

function closeNav(e) {
  document.getElementById("sideNav").style.width = "0";
}

// @ts-ignore
export default function Home() {
  const [idp, setIdp] = useState("https://solid.zwifi.eu");
  return (
    <SessionProvider sessionId="ocoma-session">
      <div className={styles.container}>
        <Head>
          <title>OCoMa</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>OCoMa</h1>
          <input type="url" value={idp} onChange={(e) => setIdp(e.target.value)} />
          <span onClick={openNav}>Menu</span>
          <nav id="sideNav" className="sidenav">
            <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
            <Link href="/about"><a href="#">About</a></Link>
            <Link href="/services"><a href="#">Services</a></Link>
            <a href="#">Clients</a>
            <a href="#">Contact</a>
          </nav>
          <LoginButton oidcIssuer={idp} redirectUrl={redirectUrl} />
          <LogoutButton />

          <div className={styles.grid}>
            <Link href="/add">
              <div className={styles.card}>
              <h3><Name></Name>, extend your collection</h3>
              <p>Add a book or a series.</p>
              </div>
            </Link>

            <a href="https://nextjs.org/learn" className={styles.card}>
              <h3>Test</h3>
            </a>

            <a
              href="https://github.com/vercel/next.js/tree/master/examples"
              className={styles.card}
            >
            </a>

            <a
              href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              className={styles.card}
            >
              <h3>Deploy &rarr;</h3>
              <p>
                Instantly deploy your Next.js site to a public URL with Vercel.
              </p>
            </a>
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
          </a>
        </footer>
      </div>
    </SessionProvider>
  )
}
