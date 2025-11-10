import { JSX } from "react";
import ReleasesGrid from "../components/ReleasesGrid";

export default function TripleX(): JSX.Element {
  return (
    <ReleasesGrid 
      labelFilter="Triple X" 
      pageTitle="Triple X Releases" 
    />
  );
}
