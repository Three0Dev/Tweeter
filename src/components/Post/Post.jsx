import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import {DB} from "../../three0lib";
import { deleteTweet } from "../../services/DeleteTweet";
import { fetchTweetLikes, fetchTweetSaves } from "../../services/FetchData";
import Avatar from "../Avatar/Avatar";

const Post = ({ tweet }) => {
  const { user } = useContext(UserContext);
  const [localTweet, setLocalTweet] = useState(tweet);

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeDocID, setLikeDocID] = useState("");

  const [saves, setSaves] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [saveDocID, setSaveDocID] = useState("");

  const [comments, setComments] = useState(0);

  const [myTweet, setMyTweet] = useState(false);

  const likeTweet = async () => {
    if (!user) {
      alert("You need to sign in for that");
      return;
    }

    const likesCollection = await DB.getDocStore(
      
      "three0.tweeterdemo.likes"
    );

    let id = await likesCollection.add({
      userID: user.uid,
      tweetID: tweet.id,
    });

    setLikes((prev) => prev + 1);
    setLikeDocID(id);
    setIsLiked(true);
  };

  const dislikeTweet = () => {
    if (!user) {
      alert("You need to sign in for that");
      return;
    }

    DB.getDocStore(
      
      "three0.tweeterdemo.likes"
    ).then(likesCollection => {
      likesCollection.delete(likeDocID).then(() => {
        setLikes((prev) => prev - 1);
        setIsLiked(false);
      });
    })
  };

  const saveTweets = () => {
    if (!user) {
      alert("You need to sign in for that");
      return;
    }

    DB.getDocStore(
      
      "three0.tweeterdemo.saves"
    ).then(savesCollection => {
      savesCollection.add({
        tweetID: tweet.id,
        userID: user.uid,
      }).then((id) => {
        setSaves((prev) => prev + 1);
        setSaveDocID(id);
        setIsSaved(true);
      });
    });
  };

  const unsaveTweets = () => {
    if (!user) {
      alert("You need to sign in for that");
      return;
    }

    DB.getDocStore(
      
      "three0.tweeterdemo.saves"
    ).then(savesCollection => {
      savesCollection.delete(
        saveDocID
      ).then(() => {
        setSaves((prev) => prev - 1);
        setIsSaved(false);
      });
    });
  };

  useEffect(() => {
    async function fetchData() {
    setLikes((await fetchTweetLikes(localTweet._id)).length);
    if (user) {
      function isValidTweet(tweetComp) {
        return tweetComp.userID == user.uid && tweet._id == tweetComp.tweetID;
      }

      async function checkForLikes() {
        let docs = await DB.getDocStore(
          
          "three0.tweeterdemo.likes"
        )
        
        docs = docs.where(isValidTweet);

        if (docs.length === 1) {
          setIsLiked(true);
          setLikeDocID(docs[0]._id);
        }
      }
      checkForLikes();

      async function checkForSaves() {
        let docs = await DB.getDocStore(
         
         "three0.tweeterdemo.saves"
        )
        
        docs = docs.where(isValidTweet);

        if (docs.length === 1) {
          setIsSaved(true);
          setSaveDocID(docs[0]._id);
        }
      }
      checkForSaves();

      async function getCommentsCount() {
        let res = await DB.getDocStore(
          
          "three0.tweeterdemo.tweets"
        )

        res = res.where(doc => doc.parentTweet == tweet._id);
        setComments(res.length);
      }

      getCommentsCount();
      if (user.uid === tweet.author.uid) {
        setMyTweet(true);
      }
    }
    setSaves((await fetchTweetSaves(localTweet._id)).length);
    }
    fetchData();
  }, []);

  return (
    <div className="p-5 bg-white rounded-lg hover:bg-gray-100 cursor-pointer">
      <div className="flex items-center content-evenly">
        <div className="w-16 h-16 overflow-hidden rounded-lg m-4">
          <Avatar src={localTweet.author.profilePicture} />
        </div>
        <div className="w-full">
          <Link href={`/${tweet.author.username}`}>
            <p className="font-poppins font-medium text-base my-1 hover:underline">
              {localTweet.author.name}
            </p>
          </Link>
          <p className="font-poppins text-sm font-medium my-1 text-gray-700  ">
            @{localTweet.author.username}
          </p>
          <p className="font-noto text-gray-500 text-base my-1">
            {localTweet.createdAt}
          </p>
        </div>
        {myTweet && (
          <div
            className="w-16 h-16 flex flex-col justify-center items-center"
            onClick={(e) => {
              e.stopPropagation();
              const answer = confirm(
                "Are you sure you want to delete this tweet?"
              );
              if (answer) {
                deleteTweet(tweet._id);
              }
            }}>
            <DeleteIcon htmlColor={"red"} fontSize="medium" />
          </div>
        )}
      </div>
      <span>
        <div className="font-noto text-base font-normal pt-4">
          {localTweet.text}
        </div>
        {tweet.imgLink && (
          <div
            className="my-5 overflow-hidden rounded-lg"
            style={{
              height: "350px",
            }}>
            <a
              href={localTweet.imgLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}>
              <img
                className="w-full h-full object-cover"
                src={localTweet.imgLink}
                alt="POST IMG HERE"
              />
            </a>
          </div>
        )}
        <div className="flex flex-row justify-end my-5">
          <p className="mx-1 text-gray-500 font-noto font-medium">
            {comments} Comments
          </p>
          <p className="mx-1 text-gray-500 font-noto font-medium">
            {likes} Likes
          </p>
          <p className="mx-1 text-gray-500 font-noto font-medium">
            {saves} Saved
          </p>
        </div>
      </span>
      <hr />
      <div className="flex flex-row my-2 items-stretch">
        <button
          className="flex-1 mx-4 font-noto font-medium rounded-lg hover:bg-gray-400 cursor-pointer py-6"
          type="submit">
          <span className="">
            <ChatBubbleOutlineIcon style={{ color: "#828282" }} />
          </span>
          <span className="hidden lg:block">Comments</span>
        </button>
        {isLiked ? (
          <button
            className="flex-1 mx-4 font-noto font-medium text-red-600 rounded-lg hover:bg-gray-400 cursor-pointer py-6"
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
              dislikeTweet();
            }}>
            <span className="">
              <FavoriteIcon style={{ color: "#e53e3e" }} />
            </span>
            <span className="hidden lg:block">Liked</span>
          </button>
        ) : (
          <button
            className="flex-1 mx-4 font-noto font-medium rounded-lg hover:bg-gray-400 cursor-pointer py-6"
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
              likeTweet();
            }}>
            <span className="">
              <FavoriteBorderIcon style={{ color: "#828282" }} />
            </span>
            <span className="hidden lg:block">Likes</span>
          </button>
        )}
        {isSaved ? (
          <button
            className="flex-1 mx-4 font-noto font-medium rounded-lg text-blue-600 hover:bg-gray-400 cursor-pointer py-6"
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
              unsaveTweets();
            }}>
            <span className="">
              <BookmarkIcon style={{ color: "#2D9CDB" }} />
            </span>
            <span className="hidden lg:block">Saved</span>
          </button>
        ) : (
          <button
            className="flex-1 mx-4 font-noto font-medium rounded-lg hover:bg-gray-400 cursor-pointer py-6"
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
              saveTweets();
            }}>
            <span className="">
              <BookmarkBorderIcon style={{ color: "#828282" }} />
            </span>
            <span className="hidden lg:block">Save</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
