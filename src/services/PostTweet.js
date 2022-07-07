import { DB } from 'three0-js-sdk';

const postTweet = async (
  authorId,
  text,
  imgLink = null,
  parentTweet = null,
) => {
  const db = await DB.getDocStore(
    'three0.tweeterdemo.tweets',
  );

  const tweetObj = {
    authorId,
    text,
    parentTweet,
    imgLink,
    createdAt: (new Date()).getTime(),
  };

  const id = await db.add(tweetObj);
  return {
    _id: id,
    ...tweetObj,
  };
};

export default postTweet;
