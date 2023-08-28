import Head from 'next/head'
import { NavBar } from './navbar'
import { SessionProvider, useSession } from "@inrupt/solid-ui-react"
import { useRouter } from 'next/router';

const Main = ({ children }:
  { children: any}
  ) => {
  const { session } = useSession();

  if (!session.info.isLoggedIn) {
    return <main>Please log in.</main>
  }
  return <main>{children}</main>
}
 
export default function Layout({ children }: any) {
  const router = useRouter();

  return (
    <>
    <Head>
      <title>OCoMa</title>
      <meta name="description" content="An Open Comic books Manager" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <SessionProvider 
      restorePreviousSession={ true }
      onSessionRestore={
        (url) => { router.push(url); }
    }>
      <NavBar />
      <Main>{children}</Main>
    </SessionProvider>
    </>
  )
}
