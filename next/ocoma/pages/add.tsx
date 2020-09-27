import styles from '../styles/Home.module.css'
import React, { useState } from "react";
import dynamic from 'next/dynamic'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deriveUriFromIsbn, lookupWorldcatOclc } from '../lib/worldcat'
import {GetServerSideProps} from "next"
import {
  SessionProvider,
  LoginButton,
  LogoutButton, 
  useSession, 
  Text, 
  DatasetProvider, ThingProvider
} from "@inrupt/solid-ui-react";
import {
  Name, 
  redirectUrl
} from "./index"
import { getSession } from '../lib/auth';

// The barcode component must be loaded client-side only
const BarcodeReader = dynamic(
  () => import("react-webcam-barcode-scanner"),
  { ssr: false }
);

export const getServerSideProps: GetServerSideProps = async context => {
  if(context.req.url) {
    const iri = new URL(context.req.url, redirectUrl)
    if(iri.searchParams.get("isbn") !== null) {
      return deriveUriFromIsbn(iri.searchParams.get("isbn") as string)
      .then(url => {
        console.log(`found url ${url}`);
        if(url) {
          return lookupWorldcatOclc(url);
        }
        return undefined;
      }).then(title => { 
        console.log(`Looked up: ${title}`); 
        return title
      }).then(title => {
        return {
          props: { comicTitle: title }
        }
      });
    }
  }
  return {
    props: {comicTitle: "No title found"},
  }
}

// 9782365774406

function Add({ comicTitle }) {

    const [ isbn, setIsbn ] = useState('Not Found');
    const [idp, setIdp] = useState("https://solid.zwifi.eu");
    const [barcode, setBarcode] = useState(false);

    // @ts-ignore
    const handleAdd = (e) => {
      // The default behaviour of the button is to resubmit. 
      // This prevents the page from reloading.
      // e.preventDefault();
      console.log(`Looking up ISBN ${isbn}`);
      
    }

    function barcodeReader(showBarcode: boolean) {
      if (showBarcode) {
        return <BarcodeReader
          width={250}
          height={250}
          onUpdate={(err, result) => {
            if (result) {
              setIsbn(result.getText())
            }
          }}
        />
      }
      return <div></div>
    }

    return (
      <SessionProvider sessionId="ocoma-session" session={getSession()}>
        <main className={styles.main}>
        <h1 className={styles.title}>OCoMa</h1>
        <h3><Name></Name>, extend your collection</h3>
        <p>Add a book or a series. <FontAwesomeIcon icon={faBarcode} onClick={() => setBarcode(!barcode)} size="3x"/></p>
        {barcodeReader(barcode)}
        <form>
          <label>
            ISBN: <input
                type="text"
                value={isbn}
                name="isbn"
                onChange={e => {
                  setIsbn(e.target.value);
                }}
              />
          </label>
          {/* <button onClick={(e) => handleAdd(e)}>Add</button> */}
          <input type="submit" value="Submit" />
        </form>
      </main>
      {comicTitle}
    </SessionProvider>
  )}
  
  export default Add
  