import Three0 from '../three0';

export const deleteTweet = (tweetID) => {
  const db = Three0.DB.orbitdb;

  db.docs(
    // TODO TWEETS COLLECTION
    "three0.tweeterdemo.tweets"
    ).then(tweets => {
      tweets.del(tweetID)
        .then(() => console.log("Deleted Tweet"))
        .catch((e) => console.log(e));
    }).catch((e) => console.log(e));

  db.docs(
    // TODO LIKES COLLECTION
    "three0.tweeterdemo.likes"

  ).then(likes => {
    let promises = [];
    likes.query(doc => doc.tweetID === tweetID)
      .forEach(doc => promises.push(likes.del(doc._id))
    );

    Promise.all(promises).then(() => console.log("Deleted Likes")).catch((e) => console.log(e));
  }).catch((e) => console.log(e));

  db.docs(
    // TODO SAVES COLLECTION
    "three0.tweeterdemo.saves"
  ).then(likes => {
    let promises = [];
    likes.query(doc => doc.tweetID === tweetID)
      .forEach(doc => promises.push(likes.del(doc._id))
    );

    Promise.all(promises).then(() => console.log("Deleted Saves")).catch((e) => console.log(e));
  }).catch((e) => console.log(e));
};
