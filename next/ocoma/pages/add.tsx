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
import { runDetection } from "../lib/barcode"

// The barcode component must be loaded client-side only
const BarcodeReader = dynamic(
  () => import("../components/barcode"),
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

    const [ isbn, setIsbn ] = useState(0);
    const [idp, setIdp] = useState("https://solid.zwifi.eu");
    const [barcode, setBarcode] = useState(false);

    // @ts-ignore
    const handleAdd = (e) => {
      // The default behaviour of the button is to resubmit. 
      // This prevents the page from reloading.
      // e.preventDefault();
      console.log(`Looking up ISBN ${isbn}`); 
    }

    return (
      <SessionProvider sessionId="ocoma-session" session={getSession()}>
        <main className={styles.main}>
        <h1 className={styles.title}>OCoMa</h1>
        <h3><Name></Name>, extend your collection</h3>
        <p>Add a book or a series. <FontAwesomeIcon icon={faBarcode} onClick={() => setBarcode(!barcode)} size="3x"/></p>
        <div id="barcode-container"></div>
        <BarcodeReader enabled={barcode} onDetectedCallback={setIsbn}/>
        <form>
          <label>
            ISBN: <input
                type="text"
                value={isbn}
                name="isbn"
                onChange={e => {
                  setIsbn(parseInt(e.target.value));
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
  