import Three0 from "../three0";

let db = Three0.DB.orbitdb;

export const fetchUser = async ({ username, userID }) => {
  let userQuerySnapShot = await db
  .docs(
    // TODO USER ADDRESS
  )

  if (username) {
    let userSnapshot = userQuerySnapShot.query(doc => doc.username === username);

    if (userSnapshot.length == 0) {
      return null;
    }
    return {
      uid: userSnapshot[0]._id,
      ...userSnapshot[0],
    };
  }

  if (userID) {
    let userDoc = userQuerySnapShot.get(userID);
    if (userQuerySnapShot.length != 0) {
      return {
        uid: userDoc[0]._id,
        ...userDoc[0],
      };
    } else {
      return null;
    }
  }
};

export const fetchUserTweets = async (userID) => {
  const tweetsQuerySnapShot = (await db
    .docs(
      // TODO TWEET ADDRESS
    )).query(doc => doc.authorId == userID && doc.parentTweet == null);

  const fetchedUser = await fetchUser({ userID });

  // tweets = tweets Array of  Objects
  const tweets = tweetsQuerySnapShot.docs.map((tweet) => {
    const data = tweet;

    return {
      id: data._id,
      ...data,
      author: fetchedUser,
      createdAt: data.createdAt.toDate().toString(),
    };
  });
  // returns array of objects (tweets)
  return tweets;
};

export const fetchTweet = async (tweetID) => {
  const tweetRef = (await db
    .docs(
      // TODO TWEET ADDRESS
    )).get(tweetID);


  if (tweetRef.length == 0) return null;

  const tweet = tweetRef[0];
  const user = await fetchUser({ userID: tweet.authorId });
  return {
    id: tweet._id,
    ...tweet,
    author: user,
    id: tweetID,
    createdAt: tweet.createdAt.toDate().toString(),
  };
};

export const fetchUserFollowers = async (userID) => {
  return (await db.docs(
    // TODO CONNECTIONS ADDRESS
  )).query(doc => doc.followeeID == userID);
};

export const fetchUserFollowings = async (userID) => {
  return (await db.docs(
    // TODO CONNECTIONS ADDRESS
  )).query(doc => doc.followerID == userID);
};

export const fetchTweetLikes = async (tweetID) => {
  return (await db.docs(
    // TODO TWEETS ADDRESS
  )).query(doc => doc._id == tweetID);
};

export const fetchTweetSaves = async (tweetID) => {
  return (await db.docs(
    // TODO SAVES ADDRESS
  )).query(doc => doc._id == tweetID);
};

const fetchAllUserData = async (username) => {
  let fetchedUser = await fetchUser({ username });
  if (fetchedUser === null) {
    return null;
  }
  const tweets = await fetchUserTweets(fetchedUser.uid);
  const followersCount = (await fetchUserFollowers(fetchedUser.uid)).size;
  const followingsCount = (await fetchUserFollowings(fetchedUser.uid)).size;
  fetchedUser = {
    ...fetchedUser,
    followersCount,
    followingsCount,
  };

  return {
    fetchedUser,
    tweets,
  };
};

export default fetchAllUserData;
