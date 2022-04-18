import Three0 from '../three0';

import { deleteTweet } from "./DeleteTweet";


export const deleteAccount = async (userID) => {
  let db = Three0.DB.orbitdb;

  // Delete user doc from "users" collection
  let usersDB = await db.docs(
    // TODO USERS COLLECTION  
    "three0.tweeterdemo.users"
  );
  
  usersDB.del(userID)
    .then(console.log("Deleted User Doc"))
    .catch((e) => console.log(e));

  // Get all tweets that has authorID = user.uid in "tweets" collection
  const tweetsSnapShot = await db
    .docs(
      // TODO TWEETS COLLECTION
      "three0.tweeterdemo.tweets"
    )
    
  tweetsSnapShot.query(doc => doc.authorID === userID)
    .forEach((tweetsDoc) => {
    // Delete those tweets
    deleteTweet(tweetsDoc._id);
  });

  // Delete all connections
  let connectionList = [];
  let connectionsCollection = await db
    .docs(
     // TODO CONNECTION COLLECTION
     "three0.tweeterdemo.connections"
    )
    
  connectionsCollection.query(doc => doc.followerID === userID || doc.followeeID === userID)
    .forEach((connectionDoc) => 
      connectionList.push(connectionsCollection.del(connectionDoc._id)))
  
  Promise.all(connectionList).then(() => console.log("Deleted Connections")).catch((e) => console.log(e));
};
