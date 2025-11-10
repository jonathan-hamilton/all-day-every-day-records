import { JSX } from "react";
import ReleasesGrid from "../components/ReleasesGrid";

export default function Releases(): JSX.Element {
  return (
    <ReleasesGrid 
      labelFilter="Nickel and Dime" 
      pageTitle="Nickel and Dime Releases" 
    />
  );
}
