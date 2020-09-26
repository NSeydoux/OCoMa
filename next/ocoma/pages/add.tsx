import styles from '../styles/Home.module.css'
import { useState } from "react";
import dynamic from 'next/dynamic'
import { lookup } from '../lib/isbn_lookup'

// The barcode component must be loaded client-side only
const BarcodeReader = dynamic(
  () => import("react-webcam-barcode-scanner"),
  { ssr: false }
)

function Add() {
    const [ isbn, setIsbn ] = useState('Not Found');

    const handleAdd = (e) => {
      // The default behaviour of the button is to resubmit. 
      // This prevents the page from reloading.
      e.preventDefault();
      console.log(`Looking up ISBN ${isbn}`);
      lookup(isbn)
      .then(record => {console.log(record)}) ;
    }

    return <main className={styles.main}>
    <h1 className={styles.title}>OCoMa</h1>
    <h3>Extend your collection</h3>
    <p>Add a book or a series.</p>

    <BarcodeReader
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (result) {
            setIsbn(result.getText())
          }
        }}
      />
      <div>
        <input
            type="text"
            value={isbn}
            onChange={e => {
              setIsbn(e.target.value);
            }}
          />
          <button onClick={(e) => handleAdd(e)}>Add</button>
      </div>
  </main>
  }
  
  export default Add
  