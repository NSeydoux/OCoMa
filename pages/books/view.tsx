import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react';
import { getSession } from "../../src/lib/session";

export default function View() {

  useEffect(() =>  {
    getSession().handleIncomingRedirect({
      restorePreviousSession: true
    });
  });

  return (
    <>
      <Head>
        <title>OCoMa</title>
        <meta name="description" content="An Open Comic books Manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>View all books in your library, {getSession().info.webId}</h1>
        <Link href="/">Go back to homepage</Link>
        <ul>
          <li>Les Notes T1, Boulet</li>
        </ul>
      </main>
    </>
  )
}
