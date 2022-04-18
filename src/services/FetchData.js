import Three0 from "../three0";

export const fetchUser = async ({ username, userID }) => {
  let db = Three0.DB.orbitdb;

  let userQuerySnapShot = await db
  .docs(
    // TODO USER ADDRESS
    "three0.tweeterdemo.users"
    )
  
  await userQuerySnapShot.load();

  if (username) {
    let userSnapshot = userQuerySnapShot.query(doc => doc.username === username);

    if (userSnapshot.length == 0) {
      return null;
    }

    let obj = {
      uid: userSnapshot[0]._id,
      ...userSnapshot[0],
    };

    obj.profilePicture = userSnapshot[0].profilePicture == "" ? 'https://picsum.photos/200' : userSnapshot[0].profilePicture;

    return obj;
  }

  if (userID) {
    let userDoc = userQuerySnapShot.get(userID);
    if (userDoc.length != 0) {
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
  let db = Three0.DB.orbitdb;

  const tweetsQuerySnapShot = await db
    .docs(
      // TODO TWEET ADDRESS
      "three0.tweeterdemo.tweets"
    )
  await tweetsQuerySnapShot.load();  
    
  tweetsQuerySnapShot = tweetsQuerySnapShot.query(doc => doc.authorId == userID && doc.parentTweet == null);

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
  let db = Three0.DB.orbitdb;

  let tweetRef = await db
    .docs(
      // TODO TWEET ADDRESS
      "three0.tweeterdemo.tweets"
    )

  await tweetRef.load();
    
  tweetRef = tweetRef.get(tweetID);


  if (tweetRef.length == 0) return null;

  const tweet = tweetRef[0];
  const user = await fetchUser({ userID: tweet.authorId });

  return {
    id: tweet._id,
    ...tweet,
    author: user,
    createdAt: (new Date(tweet.createdAt)).toString(),
  };
};

export const fetchUserFollowers = async (userID) => {
  let db = await Three0.DB.orbitdb.docs(
     // TODO CONNECTIONS ADDRESS
     "three0.tweeterdemo.connections"
  );

  await db.load()

  return db.query(doc => doc.followeeID == userID);
};

export const fetchUserFollowings = async (userID) => {
  let db = await Three0.DB.orbitdb.docs(
    // TODO CONNECTIONS ADDRESS
    "three0.tweeterdemo.connections"
 );

 await db.load()

 return db.query(doc => doc.followerID == userID);
};

export const fetchTweetLikes = async (tweetID) => {
  let db = await Three0.DB.orbitdb.docs(
     // TODO TWEETS ADDRESS
     "three0.tweeterdemo.likes"
  );

  await db.load()

  return db.query(doc => doc.tweetID == tweetID);
};

export const fetchTweetSaves = async (tweetID) => {
  let db = await Three0.DB.orbitdb.docs(
    // TODO SAVES ADDRESS
    "three0.tweeterdemo.saves"
)

  await db.load()

  return db.query(doc => doc.tweetID == tweetID);
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
