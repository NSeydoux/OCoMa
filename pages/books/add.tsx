import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import AddBookForm from '../../src/components/AddBookForm';
import { getSession } from "../../src/lib/session";



export default function Add() {
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
        <h1>Add a book to your library, {getSession().info.webId}</h1>
        <Link href="/">Go back to homepage</Link>
        <AddBookForm />
      </main>
    </>
  )
}
