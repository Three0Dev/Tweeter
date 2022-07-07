import { DB } from 'three0-js-sdk';

export const fetchNumUsers = async () => {
  const users = await DB.getDocStore('three0.tweeterdemo.users');
  return users.get().length;
};

export const fetchUser = async ({ username, userID }) => {
  const userQuerySnapShot = await DB.getDocStore(
    'three0.tweeterdemo.users',
  );

  if (username) {
    const userSnapshot = userQuerySnapShot.where((doc) => doc.username === username);

    if (userSnapshot.length == 0) {
      return null;
    }

    const obj = {
      uid: userSnapshot[0]._id,
      ...userSnapshot[0],
    };

    obj.profilePicture = userSnapshot[0].profilePicture == '' ? 'https://picsum.photos/200' : userSnapshot[0].profilePicture;

    return obj;
  }

  if (userID) {
    const userDoc = userQuerySnapShot.get(userID);
    return {
      uid: userDoc._id,
      ...userDoc,
    };
  }
};

export const fetchUserTweets = async (userID) => {
  const tweetsQuerySnapShot = await DB.getDocStore(
    'three0.tweeterdemo.tweets',
  );

  tweetsQuerySnapShot = tweetsQuerySnapShot.where((doc) => doc.authorId == userID && doc.parentTweet == null);

  const fetchedUser = await fetchUser({ userID });

  // tweets = tweets Array of  Objects
  const tweets = tweetsQuerySnapShot.map((tweet) => {
    const data = tweet;

    return {
      id: data._id,
      ...data,
      author: fetchedUser,
      createdAt: (new Date(data.createdAt)).toString(),
    };
  });
  // returns array of objects (tweets)
  return tweets;
};

export const fetchTweet = async (tweetID) => {
  const tweetRef = await DB
    .getDocStore(
      'three0.tweeterdemo.tweets',
    );

  const tweet = tweetRef.get(tweetID);
  const user = await fetchUser({ userID: tweet.authorId });

  return {
    id: tweet._id,
    ...tweet,
    author: user,
    createdAt: (new Date(tweet.createdAt)).toString(),
  };
};

export const fetchUserFollowers = async (userID) => {
  const db = await DB.getDocStore(
    'three0.tweeterdemo.connections',
  );

  return db.where((doc) => doc.followeeID == userID);
};

export const fetchUserFollowings = async (userID) => {
  const db = await DB.getDocStore(
    'three0.tweeterdemo.connections',
  );

  return db.where((doc) => doc.followerID == userID);
};

export const fetchTweetLikes = async (tweetID) => {
  const db = await DB.getDocStore(
    'three0.tweeterdemo.likes',
  );

  return db.where((doc) => doc.tweetID == tweetID);
};

export const fetchTweetSaves = async (tweetID) => {
  const db = await DB.getDocStore(
    'three0.tweeterdemo.saves',
  );
  return db.where((doc) => doc.tweetID == tweetID);
};

const fetchAllUserData = async (username) => {
  let fetchedUser = await fetchUser({ username });
  if (fetchedUser === null) {
    return null;
  }
  const tweets = await fetchUserTweets(fetchedUser.uid);
  const followersCount = (await fetchUserFollowers(fetchedUser.uid)).length;
  const followingsCount = (await fetchUserFollowings(fetchedUser.uid)).length;
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
