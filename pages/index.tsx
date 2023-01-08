import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>OCoMa</title>
        <meta name="description" content="An Open Comic books Manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>Welcome to OCoMa</h1>
        <ul>
          <li><Link href="/books/add">Add a book</Link></li>
          <li><Link href="/books/view">View your books</Link></li>
        </ul>
      </main>
    </>
  )
}
