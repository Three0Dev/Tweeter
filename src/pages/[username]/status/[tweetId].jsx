import Head from "next/head";
import React, { useContext } from "react";
import CommentInput from "../../../components/CommentInput/CommentInput";
import Comments from "../../../components/Comments/Comments";
import Post from "../../../components/Post/Post";
import Suggestions from "../../../components/Suggestions/Suggestions";
import UserContext from "../../../context/UserContext";
import Layout from "../../../layouts";
import { fetchTweet, fetchUser } from "../../../services/FetchData";

const Tweet = ({ tweet }) => {
  const { user } = useContext(UserContext);

  return (
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

export async function getServerSideProps(context) {
  const tweetID = context.params.tweetId;
  const tweet = await fetchTweet(tweetID);
  const user = await fetchUser({ userID: tweet.authorId });

  return {
    props: {
     tweet
    }
  };
}

export default Tweet;
