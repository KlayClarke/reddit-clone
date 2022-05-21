import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useCommunityData from "./useCommunityData";

const useSelectFile = () => {
  // get current community
  const router = useRouter();
  const { communityStateValue } = useCommunityData();
  const [selectedFile, setSelectedFile] = useState<string>();
  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  useEffect(() => {
    // when community changes or router.query changes, reset selectedFile
    setSelectedFile("");
  }, [communityStateValue.currentCommunity, router.query]);

  return {
    selectedFile,
    setSelectedFile,
    onSelectFile,
  };
};
export default useSelectFile;
