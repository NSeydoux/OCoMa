import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useState } from 'react';
import { getSession } from "../../src/lib/session";
import { BARCODE_CONTAINER_ID } from "../../src/components/domConstants";

// The barcode component must be loaded client-side only
const BarcodeReader = dynamic(
  () => import("../../src/components/barcode"),
  { ssr: false }
);

export default function Add() {
  const [barcode, setBarcode] = useState<boolean>(false);
  const [isbn, setIsbn ] = useState<number>(); 
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

        <form>
          <button type="button" onClick={() => setBarcode((prevState) => !prevState)}>
            {barcode ? "End scan" : "Scan"}
          </button>
          <br/>
          <label htmlFor="isbn">ISBN:
            <input type="text" name="isbn" value={isbn}></input>
          </label>
        </form>
        {/* The following must be present for the BarcodeReader component to anchor into. */}
        <div id={BARCODE_CONTAINER_ID}></div>
        <BarcodeReader enabled={barcode} onDetectedCallback={setIsbn}/>
      </main>
    </>
  )
}
