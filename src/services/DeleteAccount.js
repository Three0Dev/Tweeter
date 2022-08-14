import * as DB from 'three0-js-sdk/database';
import { deleteTweet } from './DeleteTweet';
import env from '../env';

export const deleteAccount = async (userID) => {
  // Delete user doc from "users" collection
  const usersDB = DB.getDocStore(env.usersDB);

  usersDB.delete(userID)
    .then(console.log('Deleted User Doc'))
    .catch((e) => console.log(e));

  const tweetsSnapShot = await DB.getDocStore(env.tweetsDB);

  tweetsSnapShot.where((doc) => doc.authorID === userID)
    .forEach((tweetsDoc) => {
    // Delete those tweets
      deleteTweet(tweetsDoc._id);
    });

  // Delete all connections
  const connectionList = [];
  const connectionsCollection = await DB.getDocStore(connectionsDB);

  connectionsCollection.where((doc) => doc.followerID === userID || doc.followeeID === userID)
    .forEach((connectionDoc) => connectionList.push(connectionsCollection.delete(connectionDoc._id)));

  Promise.all(connectionList).then(() => console.log('Deleted Connections')).catch((e) => console.log(e));
};
