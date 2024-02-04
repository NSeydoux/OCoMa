import HomePage from "../src/pages/HomePage";

export default async function Home() {
  // NB: Props are resolved server-side, as this is a Server component.
  return <HomePage deployUrl={ `https://${process.env.VERCEL_URL}` ?? "http://localhost:3000/" }/>
};
