import React from "react";
import AdPreview from "./AdPreview";

type AdItemProps = {
  adTitle: string;
  adLink?: string;
  imageURL?: string;
};

const AdItem: React.FC<AdItemProps> = ({ adTitle, adLink }) => {
  return <AdPreview notPreview adTitle={adTitle} adLink={adLink} />;
};
export default AdItem;
