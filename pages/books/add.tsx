import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import { getSession } from "../../src/lib/session";
import { BARCODE_CONTAINER_ID } from "../../src/components/domConstants";
import { useFormik } from "formik";

// The barcode component must be loaded client-side only
const BarcodeReader = dynamic(
  () => import("../../src/components/barcode"),
  { ssr: false }
);

export default function Add() {
  const [barcode, setBarcode] = useState<boolean>(false);
  const [isbn, setIsbn ] = useState<number>();

  useEffect(() =>  {
    getSession().handleIncomingRedirect({
      restorePreviousSession: true
    });
  });

  const bookForm = useFormik({
    initialValues: {
      title: "",
      isbn: "",
    },
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 400);
    },
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

        <form onSubmit={bookForm.handleSubmit}>
          <label htmlFor="title">
            Title:
            <input
              type="text"
              name="title"
              id="title"
              onChange={bookForm.handleChange}
              value={bookForm.values.title}
            />
          </label> 
          { bookForm.errors.title && bookForm.touched.title }
          <br />
          <label htmlFor="isbn">
            <button onClick={() => { setBarcode((prevValue) => !prevValue) }}>ISBN: </button>
            <input
              type="isbn"
              name="isbn"
              id="isbn"
              onChange={bookForm.handleChange}
              value={bookForm.values.isbn}
            />
          </label>
          {bookForm.errors.isbn && bookForm.touched.isbn}
          <br />
          <button type="submit" disabled={bookForm.isSubmitting}>
            Submit
          </button>
        </form>
        {/* The following must be present for the BarcodeReader component to anchor into. */}
        <div id={BARCODE_CONTAINER_ID}></div>
        <BarcodeReader enabled={barcode} onDetectedCallback={setIsbn}/>
      </main>
    </>
  )
}
