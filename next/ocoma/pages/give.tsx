import { SessionProvider } from "@inrupt/solid-ui-react";
import { redirectUrl } from "./index";
import { Layout } from "./_layouts/layout";

const Give: React.FC = () => {
  return (
    <SessionProvider>
      <Layout oidcIssuer={ "https://pod.inrupt.com" } redirectUrl={redirectUrl}>
        <h1>Give a book to a friend</h1>
      </Layout>
    </SessionProvider>
  )
}

export default Give;