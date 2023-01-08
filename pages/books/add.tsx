import Head from 'next/head'
import Link from 'next/link'

export default function Add() {
  return (
    <>
      <Head>
        <title>OCoMa</title>
        <meta name="description" content="An Open Comic books Manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>Add a book to your library</h1>
        <Link href="/">Go back to homepage</Link>
        <form>
          <label htmlFor="title">Title:</label>
          <input type="text" name="title"></input>
        </form>
      </main>
    </>
  )
}
