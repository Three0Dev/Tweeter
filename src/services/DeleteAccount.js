import Three0 from '../three0';

import { deleteTweet } from "./DeleteTweet";

let db = Three0.DB.orbitdb;

export const deleteAccount = async (userID) => {
  // Delete user doc from "users" collection
  let usersDB = await db.docs(
    // TODO USERS ADDRESS  
  );
  
  usersDB.del(userID)
    .then(console.log("Deleted User Doc"))
    .catch((e) => console.log(e));

  // Get all tweets that has authorID = user.uid in "tweets" collection
  const tweetsSnapShot = await db
    .docs(
      // TODO TWEETS ADDRESS
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
     // TODO CONNECTION ADDRESS
    )
    
  connectionsCollection.query(doc => doc.followerID === userID || doc.followeeID === userID)
    .forEach((connectionDoc) => 
      connectionList.push(connectionsCollection.del(connectionDoc._id)))
  
  Promise.all(connectionList).then(() => console.log("Deleted Connections")).catch((e) => console.log(e));
};
