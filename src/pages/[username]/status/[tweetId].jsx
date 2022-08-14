import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import CommentInput from "../../../components/CommentInput/CommentInput";
import Comments from "../../../components/Comments/Comments";
import Post from "../../../components/Post/Post";
import Suggestions from "../../../components/Suggestions/Suggestions";
import UserContext from "../../../context/UserContext";
import Layout from "../../../layouts";
import { fetchTweet } from "../../../services/FetchData";
import { useRouter } from 'next/router'
import init from 'three0-js-sdk';
import { env } from "../../../env";

const Tweet = () => {
  const { user } = useContext(UserContext);
  const [tweet, setTweet] = useState(null);

  const router = useRouter()
  const { tweetId } = router.query

  init(env.three0Config).then(
    useEffect(() => {
        fetchTweet(tweetId).then(tweetObj => {
          console.log(tweetObj)
          setTweet(tweetObj)
        })
      }, [router.pathname])
  );

  return !tweet ? (<div></div>) : (
    <div>
      <Head>
        <title>
          {tweet.author.name} on Tweeter "{tweet.text}"
        </title>
      </Head>
      <Layout>
        <div>
          <div className="flex flex-col lg:grid lg:grid-cols-3 lg:col-gap-5 my-5 lg:mx=24 xl:mx-48">
            <div className="col-span-2">
              <Post tweet={tweet} />
              {user && <CommentInput tweetID={tweet.id} />}
              <Comments tweetID={tweet.id} />
            </div>
            <div className="hidden lg:block">
              <Suggestions type="relavant" userID={tweet.authorId} />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Tweet;
