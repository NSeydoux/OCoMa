import React, { useState } from "react";
import { deriveUriFromIsbn, lookupWorldcatOclc } from '../lib/worldcat'
import {GetServerSideProps} from "next"
import {
  SessionProvider,
} from "@inrupt/solid-ui-react";
import {
  redirectUrl
} from "./index"
import { Layout } from './_layouts/layout';

export const getServerSideProps: GetServerSideProps = async context => {
  console.log(`Looking up ${context.req.url}`);
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
      }).then((title) => {
        return {
          props: { comicTitle: title ?? "No title found" }
        }
      });
    }
  }
  return {
    props: {comicTitle: "No title found"},
  }
}

// 9782365774406

const Add: React.FC<{comicTitle: string}> = ({comicTitle}) => {
  return (
    <SessionProvider>
      <Layout oidcIssuer={ "https://pod.inrupt.com" } redirectUrl={redirectUrl}>
        <h1>Add a book to your library!</h1>
        <p>{comicTitle}</p>
      </Layout>
    </SessionProvider>
  )
}

export default Add;