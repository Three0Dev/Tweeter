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
import Three0 from '../three0';
import Layout from "../layouts";
import { fetchUser } from "../services/FetchData";

const Home = () => {
  const { user } = useContext(UserContext);
  const [homeTweets, setHomeTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  const db = Three0.DB.orbitdb;

  const { homeTweetsContext, setHomeTweetsContext } = useContext(
    HomeTweetsContext
  );

  useEffect(async () => {
    try {
      if (user) {
        if (!homeTweetsContext) {
          setLoading(true);
          let connectionsRef = await db.docs(
            // TODO CONNECTIONS COLLECTION
            "three0.tweeterdemo.connections"
          )
          
          // await connectionsRef.load();

          connectionsRef = connectionsRef.query(doc => doc.followerID === user.uid);

          if (connectionsRef.length == 0) {
            setIsEmpty(true);
            setHomeTweets([]);
            setLoading(false);
          } else {
            const followerIDs = connectionsRef.map((connection) => connection.followeeID);

            let tweetRef = await db.docs(
              // TODO TWEETS COLLECTION
              "three0.tweeterdemo.tweets"
            )

            await tweetRef.load();
            
            tweetRef = tweetRef.query(doc => {
              return followerIDs.includes(doc.authorId) && doc.parentTweet == null;
            }).sort((a, b) => b.createdAt - a.createdAt);

            console.log(tweetRef);
             
            const homeUserTweets = [];

            for (let i = 0; i < tweetRef.length; i++) {
              const userInfo = await fetchUser({
                userID: tweetRef[i].authorId,
              });
              let data = tweetRef[i];

              homeUserTweets.push({
                ...data,
                createdAt: (new Date(data.createdAt)).toString(),
                id: tweetRef[i]._id,
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
  }, [user]);

  return (
    <div>
      <Head>
        <title>Home | Tweeter</title>
      </Head>

      <Layout>
        <div className="mx-4 sm:mx-12 md:mx-24 lg:mx-24 xl:mx-24 mt-5">
          <div className="flex flex-col lg:grid lg:grid-cols-3 lg:col-gap-5">
            <div className="lg:col-span-2">
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
                  <span key={tweet.id}>
                    <Link href={`${tweet.author.username}/status/${tweet.id}`}>
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
                {user && <Suggestions userID={Three0.AUTH.getAccountId()} />}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
