import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import postTweet from "../../services/PostTweet";
import Avatar from "../Avatar/Avatar";

const TweetInput = () => {
  const { user } = useContext(UserContext);
  const [tweet, setTweet] = useState("");
  const [tweeting, setTweeting] = useState(false);

  return (
    <div className=" bg-white rounded-lg h-auto overflow-hidden ">
      <div className="p-5">
        <div className="flex flex-row my-5">
          <div className="w-20 h-20 rounded-lg overflow-hidden">
            {user && <Avatar src={user.profilePicture} />}
          </div>

          <div className="w-full mx-5">
            <div className="flex flex-col">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  async function postTweetHandler() {
                    setTweeting(true);
                    await postTweet(user.uid, tweet.trim());
                    setTweeting(false);
                    setTweet("");
                  }
                  postTweetHandler();
                }}>
                <textarea
                  className="w-full h-16 font-noto font-medium text-base text-gray-500"
                  name="tweet-input"
                  placeholder="What's Happening?"
                  type="text"
                  value={tweet}
                  onChange={(e) => setTweet(e.target.value)}
                  required></textarea>
                <div className="flex items-center mt-3">
                  <div className="mr-0 ml-auto">
                    <button
                      className={`bottom-0 relative text-white px-8 py-4 rounded-md ${
                        tweeting
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-primary"
                      }`}
                      type="submit">
                      {tweeting ? "Tweeting...." : "Tweet"}
                      {tweeting && (
                        <span
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: " translate(-50%, -50%)",
                          }}>
                          <CircularProgress />
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetInput;
