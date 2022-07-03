import { DB } from '../three0lib';

export const deleteTweet = (tweetID) => {
  DB.getDocStore(

    'three0.tweeterdemo.tweets',
  ).then((tweets) => {
    tweets.delete(tweetID)
      .then(() => console.log('Deleted Tweet'))
      .catch((e) => console.log(e));
  }).catch((e) => console.log(e));

  DB.getDocStore(

    'three0.tweeterdemo.likes',

  ).then((likes) => {
    const promises = [];
    likes.where((doc) => doc.tweetID === tweetID)
      .forEach((doc) => promises.push(likes.delete(doc._id)));

    Promise.all(promises).then(() => console.log('Deleted Likes')).catch((e) => console.log(e));
  }).catch((e) => console.log(e));

  DB.getDocStore(

    'three0.tweeterdemo.saves',
  ).then((likes) => {
    const promises = [];
    likes.where((doc) => doc.tweetID === tweetID)
      .forEach((doc) => promises.push(likes.delete(doc._id)));

    Promise.all(promises).then(() => console.log('Deleted Saves')).catch((e) => console.log(e));
  }).catch((e) => console.log(e));
};
