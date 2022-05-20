import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Timestamp } from "@google-cloud/firestore";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  increment,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Post, postState } from "../../../atoms/postsAtom";
import { auth, firestore } from "../../../firebase/clientApp";
import CommentInput from "./CommentInput";
import CommentItem, { Comment } from "./CommentItem";

type CommentsProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const setPostState = useSetRecoilState(postState);
  const onCreateComment = async () => {
    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);
      // create comment document
      const commentDocumentReference = doc(collection(firestore, "comments"));
      const newComment: Comment = {
        id: commentDocumentReference.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };
      batch.set(commentDocumentReference, newComment);

      // change comment's createdAt so that it renders on client immediately without need to re-render / fetch full comments list

      newComment.createdAt = {
        seconds: Date.now() / 1000,
      } as Timestamp;

      // update post's number of comments
      const postDocumentReference = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocumentReference, {
        numberOfComments: increment(1),
      });
      await batch.commit();
      // update recoil state
      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error) {
      console.log("onCreateComment error: ", error);
    }
    setCreateLoading(false);
  };
  const onDeleteComment = async (comment: any) => {
    // delete comment document
    try {
    } catch (error) {
      console.log("onDeleteComment error: ", error);
    }
    // update post's number of comments
    // update recoil state
  };
  const getPostComments = async () => {};
  useEffect(() => {
    getPostComments();
  }, []);
  return (
    <Box bg={"white"} borderRadius={"0px 0px 4px 4px"} p={2}>
      <Flex
        direction={"column"}
        pl={10}
        pr={4}
        mb={6}
        fontSize={"10pt"}
        width={"100%"}
      >
        <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          user={user}
          createLoading={createLoading}
          onCreateComment={onCreateComment}
        />
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding={"6"} bg={"white"}>
                <SkeletonCircle size={"10"} />
                <SkeletonText mt={"4"} noOfLines={2} spacing={"4"} />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction={"column"}
                justify={"center"}
                align={"center"}
                borderTop={"1px solid"}
                borderColor={"gray.100"}
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                    loadingDelete={false}
                    userId={user.uid}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
