import {Database as DB} from '@three0dev/js-sdk';
import env from '../env';

const postTweet = async (
  authorId,
  text,
  imgLink = null,
  parentTweet = null,
) => {
  const db = await DB.DocStore(env.tweetsDB);

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
