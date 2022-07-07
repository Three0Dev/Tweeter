import { DB } from 'three0-js-sdk';

import { deleteTweet } from './DeleteTweet';

export const deleteAccount = async (userID) => {
  // Delete user doc from "users" collection
  const usersDB = DB.getDocStore(

    'three0.tweeterdemo.users',
  );

  usersDB.delete(userID)
    .then(console.log('Deleted User Doc'))
    .catch((e) => console.log(e));

  // Get all tweets that has authorID = user.uid in "tweets" collection
  const tweetsSnapShot = await DB.getDocStore(

    'three0.tweeterdemo.tweets',
  );

  tweetsSnapShot.where((doc) => doc.authorID === userID)
    .forEach((tweetsDoc) => {
    // Delete those tweets
      deleteTweet(tweetsDoc._id);
    });

  // Delete all connections
  const connectionList = [];
  const connectionsCollection = await DB.getDocStore(

    'three0.tweeterdemo.connections',
  );

  connectionsCollection.where((doc) => doc.followerID === userID || doc.followeeID === userID)
    .forEach((connectionDoc) => connectionList.push(connectionsCollection.delete(connectionDoc._id)));

  Promise.all(connectionList).then(() => console.log('Deleted Connections')).catch((e) => console.log(e));
};
