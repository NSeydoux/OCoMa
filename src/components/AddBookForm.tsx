"use client";

import { BARCODE_CONTAINER_ID } from "../../src/components/domConstants";
import { Field, FieldArray, Formik, useFormikContext } from "formik";
import { ChangeEventHandler, useContext, useState } from "react";
import type { Book } from "../lib/data/books";
import { addBookToDataset, bookToRdf } from "../lib/data/books";
import { getSourceIri, getThingAll, setThing } from "@inrupt/solid-client";
import { LibraryContext } from "../contexts/libraryContext";
import BarcodeReader from "./barcode";

import style from "./AddBookForm.module.css";

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

const LangTagField = ({
  handleChange,
  langTag
}: {
  handleChange: ChangeEventHandler,
  langTag: string
}) => {
  return (
    <label htmlFor="langTag">
      Langue:
      <select
        name="langTag"
        id="langTag"
        onChange={handleChange}
        value={langTag}
      >
        <option value={"fr"}>fr</option>
        <option value={"en"}>en</option>
        <option value={"es"}>es</option>
        <option value={"ru"}>ru</option>
      </select>
    </label>
  )
}

const IsbnField = ({
  handleChange,
  isbn,
}: { 
  handleChange: ChangeEventHandler,
  isbn: number | undefined,
}) => {
  const [scanEnabled, setScanEnabled] = useState<boolean>(false);
  const {
    setFieldValue,
  } = useFormikContext()
  return (
    <label htmlFor="isbn">
      <button type="button" onClick={() => setScanEnabled((prev) => !prev)}>ISBN: </button>
      <BarcodeReader enabled={scanEnabled} onDetectedCallback={(value) => { setFieldValue("isbn", value) }}/>
      <input
        type="text"
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

const SeriesField = ({
  series,
  handleChange
}: {
  series?: {
    name: string,
    index?: number
  },
  handleChange: ChangeEventHandler
}) => {
  return (
    <div>
      <label htmlFor="series.name">
        Series name: 
        <Field name="series.name" onChange={handleChange} />
      </label>
      <br />
      <label htmlFor="series.index">
        Series index:
        <Field name="series.index" onChange={handleChange} />
      </label>
    </div>
  )
}

const initalValues: Book = {
  title: "",
  langTag: "fr",
  isbn: 0,
  authors: [""],
  series: {
    name: "",
    index: 0
  }
}

export default function AddBookForm() {
  const {library, setLibrary} = useContext(LibraryContext);
  
  const handleSubmit = (book: Book) => {
    if(library === undefined || setLibrary === undefined) {
      return;
    }
    setLibrary(addBookToDataset(book, library));
  }

  return (<div className={ style.addBookFormContainer }>
    <Formik
      initialValues={initalValues}
      onSubmit={(book, { setSubmitting, resetForm }) => {
        handleSubmit(book); 
        setSubmitting(false);
        resetForm();
      }}
    >
      {props => (
        <form onSubmit={props.handleSubmit} className={ style.addBookForm }>
          <BookTitleField
            handleChange={props.handleChange}
            title={props.values.title}
          />
          { props.errors.title && props.touched.title }
          <LangTagField
            handleChange={props.handleChange}
            langTag={props.values.langTag}
          />
          <br />
          <IsbnField
            handleChange={props.handleChange}
            isbn={props.values.isbn}
          />
          {props.errors.isbn && props.touched.isbn}
          <br />
          <AuthorsField
            authors={props.values.authors}
          />
          <br />
          <SeriesField 
            series={props.values.series}
            handleChange={props.handleChange}
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
  </div>)
}
