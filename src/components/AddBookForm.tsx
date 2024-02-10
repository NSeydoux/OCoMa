"use client";

import { BARCODE_VIEWER_ID } from "../../src/components/domConstants";
import { Field, FieldArray, Formik, useFormikContext } from "formik";
import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import type { Book } from "../lib/data/books";
import { addBookToDataset, bookToRdf } from "../lib/data/books";
import { getSourceIri, getThingAll, setThing } from "@inrupt/solid-client";
import { LibraryContext } from "../contexts/libraryContext";
import BarcodeReader from "./barcode";

import style from "./AddBookForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";

const BookTitleField = ({
  handleChange,
  title
}: {
  handleChange: ChangeEventHandler,
  title: string
}) => {
  return (
    <div id={style.bookTitleField}>
      <label htmlFor="title">Titre</label><br />
      <input
        type="text"
        name="title"
        id="title"
        onChange={handleChange}
        value={title}
        placeholder="Les gaffes d'un gars gonflé"
      />
    </div>
    
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
    <div id={style.langTagField}>
      <label htmlFor="langTag">Langue</label><br />
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
    </div>
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

  useEffect(() => {
    const modal = document.getElementById("barcode-modal");
    const modalContainer = document.getElementById("barcode-container");
    if(modal === null) {
      return;
    }
    if (scanEnabled) {
      modal.style.display = "block";
      window.onclick = (event) => {
        if (event.target === modal || event.target === modalContainer) {
          setScanEnabled(false);
        }
      }
    } else {
      modal.style.display = "none";
    }
  }, [scanEnabled]);

  return (
    <div id={style.isbnField}>
      <label htmlFor="isbn">ISBN</label> <button type="button" onClick={() => setScanEnabled((prev) => !prev)}><FontAwesomeIcon icon={faBarcode} /></button><br />
      <BarcodeReader enabled={scanEnabled} onDetectedCallback={
        (value) => { 
          setFieldValue("isbn", value);
          setScanEnabled(false);
        }
      }/>
      <input
        type="text"
        name="isbn"
        id="isbn"
        onChange={handleChange}
        value={isbn}
        placeholder="9782800159102"
      />
    </div> 
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
        <div id={style.authorField}>
          <label>Auteurs</label>
          <button type="button" onClick={() => push("") }>+</button>
          <br/>
          {authors.map((_author, index) => {
            return (
              <div key={index}>
                <Field
                  type="text"
                  name={`authors.${index}`}
                  id={`authors.${index}`}
                  placeholder="Franquin"
                >
                </Field>
                {index !== 0 ? <button type="button" onClick={() => {remove(index)} }>x</button> : <></>}
                <br/>
              </div>
            )
          })}
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
    <div id={style.seriesField}>
      <div id={style.seriesTitle}>
        <label htmlFor="series.name">Série</label><br />
        <Field 
          name="series.name"
          onChange={handleChange} 
          component={
            () => <input type="text" placeholder="Gaston Lagaffe" />
          }
        />
      </div>
      <div id={style.seriesNumber}>
        <label htmlFor="series.index">Tome</label><br />
        <Field 
          name="series.index"
          onChange={handleChange}
          component={
            () => <input type="number" placeholder="6" size={"Tome".length} />
          }/>
      </div>
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
        <form onSubmit={props.handleSubmit}>
          <fieldset className={ style.addBookForm }>
            <legend>Ajoute un livre à ta collection</legend>
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
            <button type="submit" disabled={props.isSubmitting} id={style.submitButton}>
              Enregistrer
            </button>
          </fieldset>
        </form>
        )}
    </Formik>
    {/* The following must be present for the BarcodeReader component to anchor into. */}
    <div className={style["barcode-modal"]} id="barcode-modal">
      <div className={style["barcode-container"]} id="barcode-container">
        <div id={BARCODE_VIEWER_ID} className={style["barcode-viewer"]}></div>
      </div>
    </div>
  </div>)
}
