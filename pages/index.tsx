import Head from 'next/head'
import Link from 'next/link'

import { useEffect, useState } from "react";
import { NavBar } from "../src/components/navbar";
import { getSession } from "../src/lib/session";

const Homepage = ({loggedIn}: { loggedIn: boolean}) => {
  if(loggedIn) {
    return (
      <ul>
        <li><Link href="/books/add">Add a book</Link></li>
        <li><Link href="/books/view">View your books</Link></li>
      </ul>
    )
  }
  return (
    <p>Please log in.</p>
  )
}


export default function Home() {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(getSession().info.isLoggedIn);
  useEffect(() => {
    (async () => {
      const session = getSession();
      session.onLogin(() => { setLoggedIn(true)} );
      session.onLogout(() => { setLoggedIn(false)} );
      await session.handleIncomingRedirect(window.location.href);
    })();
  })
  return (
    <>
      <Head>
        <title>OCoMa</title>
        <meta name="description" content="An Open Comic books Manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <NavBar />
        <h1>Welcome to OCoMa</h1>
        <Homepage loggedIn={isLoggedIn}/>
      </main>
    </>
  )
}
