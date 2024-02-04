"use client";

import { NavBar } from './navbar'
import { SessionProvider, useSession } from "@inrupt/solid-ui-react"
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { SolidDataset, getSourceIri, saveSolidDatasetAt, hasResourceInfo } from '@inrupt/solid-client';

import { LibraryContext } from "../contexts/libraryContext";
import { DeploymentContext } from "../contexts/deploymentContext";
import LoginButton from './LoginButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#001df7",
     },
    secondary: {
      main: "#f7da00"
    }
  },
});

const Main = (
  { children }: { children: any } 
) => {
  const { session } = useSession();
  const [library, setLibrary] = useState<SolidDataset>();

  // Persist library updates to the remote resource.
  useEffect(() => {
    if (library === undefined) {
      // Case where the library is initialized from the remote resource.
      // There aren't any changes to persist remotely yet.
      return;
    }
    const targetUrl = getSourceIri(library);
    if (targetUrl === null) {
      console.error("Could not determine the target URL to save the library.")
      return;
    }
    saveSolidDatasetAt(
      targetUrl,
      library, {
        fetch: session.fetch
      }
    ).catch((e) => {
      console.error(`Saving the library to ${targetUrl} failed: `, e.toString());
    });
  }, [library, session]);

  if (!session.info.isLoggedIn) {
    return <main><LoginButton /></main>
  }
  return (
    <LibraryContext.Provider value={{ library, setLibrary }}>
      <main>{children}</main>
    </LibraryContext.Provider>
  );
}
 
export default function Layout({ children, deploymentUrl }: any) {
  const router = useRouter();
  return (
    <ThemeProvider theme={theme}>
      <DeploymentContext.Provider value={{ deploymentUrl }}>
        <SessionProvider 
          restorePreviousSession={ true }
          onSessionRestore={
            (url) => { router.push(url); }
        }>
          <NavBar />
          <Main>{children}</Main>
        </SessionProvider>
      </DeploymentContext.Provider>
    </ThemeProvider>
  )
}
