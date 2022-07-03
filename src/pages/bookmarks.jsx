import CircularProgress from "@mui/material/CircularProgress";
import Head from "next/head";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Filters from "../components/Filters/Filters";
import Post from "../components/Post/Post";
import BookmarksTweetsContext from "../context/BookmarksTweetsContext";
import UserContext from "../context/UserContext";
import {DB} from '../three0lib';
import Layout from "../layouts";
import { fetchTweet } from "../services/FetchData";

const Bookmarks = () => {
  const { user } = useContext(UserContext);
  const [bookmarkTweets, setBookmarkTweets] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const { bookmarksTweetsContext, setBookmarksTweetsContext } = useContext(
    BookmarksTweetsContext
  );

  useEffect(() => {
    if (user) {
      if (!bookmarksTweetsContext) {
        async function getSavedTweets() {
          const localBMTweets = [];
          let savesSnapShot = await DB.getDocStore(
            
            "three0.tweeterdemo.saves"
          )
          
          savesSnapShot = savesSnapShot.where(doc => doc.userID === user.uid);

          if (savesSnapShot.length == 0) {
            setIsEmpty(true);
            setBookmarkTweets([]);
            setIsLoading(false);
          } else {
            for (let i = 0; i < savesSnapShot.length; i++) {
              const tweet = await fetchTweet(
                savesSnapShot[i].tweetID
              );
              localBMTweets.push(tweet);
            }
            setBookmarkTweets(localBMTweets);
            setBookmarksTweetsContext(localBMTweets);
            setIsEmpty(false);
            setIsLoading(false);
          }
        }
        getSavedTweets(user.uid);
      } else {
        setBookmarkTweets(bookmarksTweetsContext);
        setIsEmpty(false);
        setIsLoading(false);
      }
    }
  }, [user]);

  return (
    <div>
      <Head>
        <title>Bookmarks | Tweeter</title>
      </Head>
      <Layout>
        <div className="mx-4 sm:mx-12 md:mx-24 lg:mx-24 mt-5">
          <div className="flex flex-col lg:grid lg:grid-cols-3 lg:col-gap-5">
            <div className="hidden lg:block lg:col-span-1">
              <div className="mb-5">
                <Filters />
              </div>
            </div>
            <div className="lg:col-span-2">
              {loading && (
                <div className="flex justify-center">
                  <CircularProgress />
                </div>
              )}
              {isEmpty ? (
                <h1 className="text-center">You have no Saved Tweets</h1>
              ) : (
                bookmarkTweets.map((tweet) => (
                  <Link href={`${tweet.author.username}/status/${tweet.id}`}>
                    <div className="mb-5">
                      <Post tweet={tweet} />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Bookmarks;
