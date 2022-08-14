import CircularProgress from "@mui/material/CircularProgress";
import Head from "next/head";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Post from "../components/Post/Post";
import Suggestions from "../components/Suggestions/Suggestions";
import Trends from "../components/Trends/Trends";
import TweetInput from "../components/TweetInput/TweetInput";
import HomeTweetsContext from "../context/HomeTweetsContext";
import UserContext from "../context/UserContext";
import * as DB from 'three0-js-sdk/database';
import * as AUTH from 'three0-js-sdk/auth';
import Layout from "../layouts";
import { fetchUser } from "../services/FetchData";
import env from "../env";

const Home = () => {
  const { user } = useContext(UserContext);
  const [homeTweets, setHomeTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  const { homeTweetsContext, setHomeTweetsContext } = useContext(
    HomeTweetsContext
  );

  useEffect(() => {
    async function fetchHomeTweets() {
    try {
      if (user) {
        if (!homeTweetsContext) {
          setLoading(true);
          let connectionsRef = await DB.getDocStore(env.connectionsDB)

          connectionsRef = connectionsRef.where(doc => doc.followerID === user.uid);

          if (connectionsRef.length == 0) {
            setIsEmpty(true);
            setHomeTweets([]);
            setLoading(false);
          } else {
            const followerIDs = connectionsRef.map((connection) => connection.followeeID);

            let tweetRef = await DB.getDocStore(env.tweetsDB)
            
            tweetRef = tweetRef.where(doc => followerIDs.includes(doc.authorId) && doc.parentTweet == null)
              .sort((a, b) => b.createdAt - a.createdAt);
             
            const homeUserTweets = [];

            for (let i = 0; i < tweetRef.length; i++) {
              const userInfo = await fetchUser({
                userID: tweetRef[i].authorId,
              });
              let data = tweetRef[i];

              homeUserTweets.push({
                ...data,
                createdAt: (new Date(data.createdAt)).toString(),
                author: userInfo,
              });
            }
            setHomeTweets(homeUserTweets);
            setLoading(false);
            setHomeTweetsContext(homeUserTweets);
          }
        } else {
          setLoading(false);
          setHomeTweets(homeTweetsContext);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  fetchHomeTweets();
  }, [user]);

  return (
    <div>
      <Head>
        <title>Home | Tweeter</title>
      </Head>

      <Layout>
        <div className="mx-4 sm:mx-12 md:mx-24 lg:mx-24 xl:mx-24 mt-5">
          <div className="flex flex-col lg:grid lg:grid-cols-3 lg:col-gap-5">
            <div className="lg:col-span-2 mr-5">
              <div className="mb-5">
                <TweetInput />
              </div>
              {loading && (
                <div className="flex justify-center">
                  <CircularProgress />
                </div>
              )}

              {isEmpty ? (
                <h1>You are following no one</h1>
              ) : (
                homeTweets.map((tweet) => (
                  <span key={tweet._id}>
                    <Link href={`${tweet.authorId}/status/${tweet._id}`}>
                      <div className="mb-5">
                        <Post tweet={tweet} />
                      </div>
                    </Link>
                  </span>
                ))
              )}
            </div>
            <div className="hidden lg:block lg:col-span-1">
              <div className="mb-5">
                <Trends />
              </div>
              <div className="mb-5">
                {user && <Suggestions userID={AUTH.getAccountId()} />}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
