import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { Layout } from "./_layouts/layout";
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
export const oidcIssuer = "https://pod.inrupt.com";

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

// @ts-ignore
export default function Home() {
  // const [idp, setIdp] = useState("https://solid.zwifi.eu");
  return (
    <SessionProvider>
      <Layout oidcIssuer={ oidcIssuer } redirectUrl={redirectUrl}>
        <main className={styles.main}>
          <h1 className={styles.title}>OCoMa</h1>
          {/* <input type="url" value={idp} onChange={(e) => setIdp(e.target.value)} /> */}

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
        </Layout>
    </SessionProvider>
  )
}
