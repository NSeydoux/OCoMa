import { SessionProvider } from "@inrupt/solid-ui-react";
import { redirectUrl } from "./index";
import { Layout } from "./_layouts/layout";

const Browse: React.FC = () => {
  return (
    <SessionProvider>
      <Layout oidcIssuer={ "https://pod.inrupt.com" } redirectUrl={redirectUrl}>
        <h1>Browse your collection</h1>
      </Layout>
    </SessionProvider>
  )
}

export default Browse;