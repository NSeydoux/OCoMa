import HomePage from "../src/pages/HomePage";

// NB: this will run server-side, as this is a Server component.
const getDeployUrl = () => process.env.VERCEL_URL ?? "http://localhost:3000/";

export default async function Home() {
  return <HomePage deployUrl={ getDeployUrl() }/>
};
