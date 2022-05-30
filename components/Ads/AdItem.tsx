import React from "react";
import AdPreview from "./AdPreview";

type AdItemProps = {
  adTitle: string;
  adLink?: string;
  imageURL?: string;
  videoURL?: string;
};

const AdItem: React.FC<AdItemProps> = ({
  adTitle,
  adLink,
  imageURL,
  videoURL,
}) => {
  return (
    <AdPreview
      notPreview
      adTitle={adTitle}
      adLink={adLink}
      imageURL={imageURL}
      videoURL={videoURL}
    />
  );
};
export default AdItem;
