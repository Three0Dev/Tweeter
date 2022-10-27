import {Database as DB} from '@three0dev/js-sdk';
import env from '../env';

export const deleteTweet = (tweetID) => {
  DB.DocStore(env.tweetsDB).then((tweets) => {
    tweets.delete(tweetID)
      .then(() => console.log('Deleted Tweet'))
      .catch((e) => console.log(e));
  }).catch((e) => console.log(e));

  DB.DocStore(env.likesDB).then((likes) => {
    const promises = [];
    likes.where((doc) => doc.tweetID === tweetID)
      .forEach((doc) => promises.push(likes.delete(doc._id)));

    Promise.all(promises).then(() => console.log('Deleted Likes')).catch((e) => console.log(e));
  }).catch((e) => console.log(e));

  DB.DocStore(env.savesDB).then((likes) => {
    const promises = [];
    likes.where((doc) => doc.tweetID === tweetID)
      .forEach((doc) => promises.push(likes.delete(doc._id)));

    Promise.all(promises).then(() => console.log('Deleted Saves')).catch((e) => console.log(e));
  }).catch((e) => console.log(e));
};
