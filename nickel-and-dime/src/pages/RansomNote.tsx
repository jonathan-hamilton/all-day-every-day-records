import { JSX } from "react";
import ReleasesGrid from "../components/ReleasesGrid";

export default function RansomNote(): JSX.Element {
  return (
    <ReleasesGrid 
      labelFilter="Ransom Note" 
      pageTitle="Ransom Note Releases" 
    />
  );
}
