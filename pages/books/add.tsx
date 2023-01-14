import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import { getSession } from "../../src/lib/session";
import { BARCODE_CONTAINER_ID } from "../../src/components/domConstants";
import { Field, FieldArray, Formik } from "formik";

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
        <Formik
          initialValues={{
            title: "",
            isbn: "",
            authors: [""]
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              console.log(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {props => (
          <form onSubmit={props.handleSubmit}>
            <label htmlFor="title">
              Title:
              <input
                type="text"
                name="title"
                id="title"
                onChange={props.handleChange}
                value={props.values.title}
              />
            </label> 
            { props.errors.title && props.touched.title }
            <br />
            <label htmlFor="isbn">
              <button onClick={() => { setBarcode((prevValue) => !prevValue) }}>ISBN: </button>
              <input
                type="isbn"
                name="isbn"
                id="isbn"
                onChange={props.handleChange}
                value={props.values.isbn}
              />
            </label>
            {props.errors.isbn && props.touched.isbn}
            <br />
            <FieldArray name="authors">
              {({ remove, push }) => (
                <div>
                  {props.values.authors.map((author, index) => {
                    return (<label htmlFor={`autors.${index}`} key={index}>
                    Author:
                    <Field
                      type="text"
                      name={`autors.${index}`}
                      id={`autors.${index}`}
                    >
                    </Field>
                    {index !== 0 ? <button onClick={() => {remove(index)} }>x</button> : <></>}
                    <br/>
                  </label>)
                  })}
                  <button onClick={() => push("") }>+</button>
                </div>)
              }
            </FieldArray>
            <br />
            <button type="submit" disabled={props.isSubmitting}>
              Submit
            </button>
          </form>
          )}
        </Formik>
        {/* The following must be present for the BarcodeReader component to anchor into. */}
        <div id={BARCODE_CONTAINER_ID}></div>
        <BarcodeReader enabled={barcode} onDetectedCallback={setIsbn}/>
      </main>
    </>
  )
}
