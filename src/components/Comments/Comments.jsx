import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import * as DB from '@three0/js-sdk/database';
import { fetchUser } from "../../services/FetchData";
import Avatar from "../Avatar/Avatar";
import env from "../../env";

const Comments = ({ tweetID }) => {
  const [comments, setComments] = useState([]);
  // console.log("getting comments")

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await DB.getDocStore(env.tweetsDB)

        const tweets = res.where(doc => doc.parentTweet == tweetID);
        
        const localComments = [];

        for (let i = 0; i < tweets.length; i++) {
          const tweet = tweets[i];
          const id = tweet._id;
          const userInfo = await fetchUser({
            userID: tweet.authorId,
          });
          localComments.push({
            ...tweet,
            id,
            createdAt: (new Date(tweet.createdAt)).toString(),
            author: userInfo,
          });
        }
        setComments(localComments);

      } catch (err) {
        console.log(err);
      }
    };

    getComments();
  }, []);

  return (
    <div className="bg-white rounded-b-lg">
      {comments &&
        comments.length > 0 &&
        comments.map((comment) => (
          <div className="rounded-lg" key={comment.id}>
            <div className="flex flex-row">
              <div className="m-2 w-12 h-12">
                <Avatar src={comment.author.profilePicture} />
              </div>
              <div className="flex flex-col  w-full">
                <div className="bg-gray-200 p-4">
                  <div className="p-2">
                    <p className="inline-block font-poppins font-medium">
                      {comment.author.name}
                    </p>
                    <p className="inline-block font-noto font-medium text-xs text-gray-600">
                      {comment.createdAt}{" "}
                    </p>
                  </div>
                  <div className="p-2">
                    <p className="font-noto text-gray-700">{comment.text}</p>
                  </div>
                </div>
                <div className="flex flex-row py-4">
                  <button type="submit">
                    <span>
                      <FavoriteBorderIcon />
                    </span>
                    Like
                  </button>
                  <p className="px-2">.</p>
                  <p className="font-noto font-semibold text-gray-400">
                    12k Likes
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Comments;
