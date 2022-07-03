import CircularProgress from "@mui/material/CircularProgress";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ExploreFilters from "../components/ExploreFIlters/ExploreFilters";
import Post from "../components/Post/Post";
import ExploreTweetsContext from "../context/ExploreTweetsContext";
import {DB} from '../three0lib';
import Layout from "../layouts";
import { fetchUser } from "../services/FetchData";

const Explore = () => {
  const [exploreTweets, setExploreTweets] = useState([]);
  const { exploreTweetsContext, setExploreTweetsContext } = React.useContext(
    ExploreTweetsContext
  );

  useEffect(() => {
    async function fetchExploreTweets() {
    if (!exploreTweetsContext) {
      let tweetRef = await DB.getDocStore(
        
        "three0.tweeterdemo.tweets"
      )
      
      tweetRef = tweetRef.where(doc => doc.parentTweet == null);
      
      const exploreUserTweets = [];

      for (let i = 0; i < tweetRef.size; i++) {
        const userInfo = await fetchUser({
          userID: tweetRef[i].authorId,
        });
        let data = tweetRef[i];

        exploreUserTweets.push({
          ...data,
          createdAt: (new Date(data.createdAt)).toString(),
          id: tweetRef[i]._id,
          author: userInfo,
        });
      }
      setExploreTweets(exploreUserTweets);
      setExploreTweetsContext(exploreUserTweets);
        
    } else {
      setExploreTweets(exploreTweetsContext);
    }
    }
    fetchExploreTweets();
  }, []);

  return (
    <div>
      <Head>
        <title>Explore | Tweeter</title>
      </Head>
      <Layout>
        <div className="mx-4 sm:mx-12 md:mx-24 lg:mx-48 mt-5">
          <div className="flex flex-col lg:grid lg:grid-cols-3 lg:col-gap-5">
            <div className="hidden lg:block lg:col-span-1">
              <div className="mb-5">
                <ExploreFilters />
              </div>
            </div>
            <div className="lg:col-span-2">
              {exploreTweets ? (
                exploreTweets.map((tweet) => (
                  <span key={tweet.id}>
                    <Link href={`${tweet.author.username}/status/${tweet.id}`}>
                      <div className="mb-5">
                        <Post tweet={tweet} />
                      </div>
                    </Link>
                  </span>
                ))
              ) : (
                <div className="flex justify-center">
                  <CircularProgress />
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Explore;
