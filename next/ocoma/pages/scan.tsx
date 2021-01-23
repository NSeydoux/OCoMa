import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SessionProvider } from "@inrupt/solid-ui-react";
import Link from "next/link";
import dynamic from 'next/dynamic'
import React, { useState } from "react";
import { getSession } from "../lib/auth";
import { redirectUrl } from "./index";
import { Layout } from "./_layouts/layout";

// The barcode component must be loaded client-side only
const BarcodeReader = dynamic(
  () => import("../components/barcode"),
  { ssr: false }
);

/**
 * This page scans a title, and loads the page to add the found ISBN.
 */
function Scan() {

  const [isbn, setIsbn] = useState(0);
  const [barcode, setBarcode] = useState(false);

  return (
    <SessionProvider sessionId="ocoma-session" session={getSession()}>
      <Layout oidcIssuer={ "https://pod.inrupt.com" } redirectUrl={redirectUrl}>  
        <p>Scan a book <FontAwesomeIcon icon={faBarcode} onClick={() => setBarcode(!barcode)} size="3x"/></p>
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
          <button><Link href={`/add?isbn=${isbn}`}>Add</Link></button>
        </form>
      </Layout>
    </SessionProvider>
  )}
  
  export default Scan;