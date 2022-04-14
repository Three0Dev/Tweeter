import Three0 from "../three0";

const postTweet = async (
  authorId,
  text,
  imgLink = null,
  parentTweet = null
) => {
  console.log(authorId, text, imgLink, parentTweet);
  let db = Three0.DB.orbitdb.docs(
    // TODO TWEET ADDRESS
  )
  await db.put({
    authorId,
    text,
    parentTweet,
    imgLink,
    createdAt: (new Date()).getTime(),
  });
};

export default postTweet;
