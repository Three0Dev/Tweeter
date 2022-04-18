import Three0 from "../three0";

const postTweet = async (
  authorId,
  text,
  imgLink = null,
  parentTweet = null
) => {
  console.log(authorId, text, imgLink, parentTweet);
  let db = await Three0.DB.orbitdb.docs(
    // TODO TWEETS COLLECTION
    "three0.tweeterdemo.tweets"
  )

  console.log(db);
  await db.put({
    _id: Three0.DB.create_UUID(),
    authorId,
    text,
    parentTweet,
    imgLink,
    createdAt: (new Date()).getTime(),
  });
};

export default postTweet;
