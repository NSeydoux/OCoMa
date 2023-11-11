import HomePage from "../src/pages/HomePage";

export default async function Home({ deployUrl }: { deployUrl: string }) {
  return <HomePage deployUrl={ deployUrl }/>
};
