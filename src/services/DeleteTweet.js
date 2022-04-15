import Three0 from '../three0';

const db = Three0.DB.orbitdb;

export const deleteTweet = (tweetID) => {
  db.docs(
    // TODO TWEETS ADDRESS
    ).then(tweets => {
      tweets.del(tweetID)
        .then(() => console.log("Deleted Tweet"))
        .catch((e) => console.log(e));
    }).catch((e) => console.log(e));

  db.docs(
    // TODO LIKES ADDRESS
  ).then(likes => {
    let promises = [];
    likes.query(doc => doc.tweetID === tweetID)
      .forEach(doc => promises.push(likes.del(doc._id))
    );

    Promise.all(promises).then(() => console.log("Deleted Likes")).catch((e) => console.log(e));
  }).catch((e) => console.log(e));

  db.docs(
    // SAVES LIKES ADDRESS
  ).then(likes => {
    let promises = [];
    likes.query(doc => doc.tweetID === tweetID)
      .forEach(doc => promises.push(likes.del(doc._id))
    );

    Promise.all(promises).then(() => console.log("Deleted Saves")).catch((e) => console.log(e));
  }).catch((e) => console.log(e));
};
