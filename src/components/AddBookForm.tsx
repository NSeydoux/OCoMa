import { BARCODE_CONTAINER_ID } from "../../src/components/domConstants";
import { Field, FieldArray, Formik } from "formik";
import dynamic from "next/dynamic";
import { ChangeEventHandler, useState } from "react";

// The barcode component must be loaded client-side only
const BarcodeReader = dynamic(
  () => import("./barcode"),
  { ssr: false }
);

const BookTitleField = ({
  handleChange,
  title
}: {
  handleChange: ChangeEventHandler,
  title: string
}) => {
  return (
    <label htmlFor="title">
      Title:
      <input
        type="text"
        name="title"
        id="title"
        onChange={handleChange}
        value={title}
      />
    </label>
  )
}

const IsbnField = ({
  handleChange,
  isbn,
  handleBarCode
}: { 
  handleChange: ChangeEventHandler,
  isbn: number | undefined,
  handleBarCode: () => void}
) => {
  return (
    <label htmlFor="isbn">
      <button type="button" onClick={() => handleBarCode()}>ISBN: </button>
      <input
        type="isbn"
        name="isbn"
        id="isbn"
        onChange={handleChange}
        value={isbn}
      />
    </label>
  )
}

const AuthorsField = ({
  authors
}: {
  authors: string[]
}) => {
  return (
    <FieldArray name="authors">
      {({ remove, push }) => (
        <div>
          {authors.map((_author, index) => {
            return (
              <label htmlFor={`authors.${index}`} key={index}>
              Author:
              <Field
                type="text"
                name={`authors.${index}`}
                id={`authors.${index}`}
              >
              </Field>
              {index !== 0 ? <button type="button" onClick={() => {remove(index)} }>x</button> : <></>}
              <br/>
              </label>
            )
          })}
          <button type="button" onClick={() => push("") }>+</button>
        </div>)
      }
    </FieldArray>
  )
}

export default function AddBookForm() {
  const [barcode, setBarcode] = useState<boolean>(false);
  const [isbn, setIsbn ] = useState<number>();
  
  const handleBarCode = () => { setBarcode((prevValue) => !prevValue) };

  return (<div>
    <Formik
      initialValues={{
        title: "",
        isbn: undefined,
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
          <BookTitleField
            handleChange={props.handleChange}
            title={props.values.title}
          />
          { props.errors.title && props.touched.title }
          <br />
          <IsbnField
            handleChange={props.handleChange}
            isbn={isbn}
            handleBarCode={handleBarCode}
          />
          {props.errors.isbn && props.touched.isbn}
          <br />
          <AuthorsField
            authors={props.values.authors}
          />
          <br />
          <button type="submit" disabled={props.isSubmitting}>
            Submit
          </button>
        </form>
        )}
    </Formik>
    {/* The following must be present for the BarcodeReader component to anchor into. */}
    <div id={BARCODE_CONTAINER_ID}></div>
    <BarcodeReader enabled={barcode} onDetectedCallback={setIsbn}/>)
  </div>)
}
