import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BookmarksTweetsContext from "../context/BookmarksTweetsContext";
import ExploreTweetsContext from "../context/ExploreTweetsContext";
import HomeTweetsContext from "../context/HomeTweetsContext";
import UserContext from "../context/UserContext";
import "../styles/global.css";
import "../styles/reset.css";
import {init, AUTH, DB} from '../three0lib';

function MyApp({ Component, pageProps }) {
  const Router = useRouter();
  const protectedRoutes = ["/home", "/bookmarks"];

  const [user, setUser] = useState(null);
  const [homeTweetsContext, setHomeTweetsContext] = useState(null);
  const [exploreTweetsContext, setExploreTweetsContext] = useState(null);
  const [bookmarksTweetsContext, setBookmarksTweetsContext] = useState(null);

  useEffect(() => {
    const config = {
        "contractName": "dev-1654358258368-10220982874835",
        "projectId": "project_0",
        "chainType": "NEAR_TESTNET",
    };

    init(config).then(otherStuff);

    function otherStuff(){
      if (!AUTH.isLoggedIn()) {
        if (protectedRoutes.includes(Router.pathname)) Router.push("/");
        setUser(null);
      } else {
        DB.getDocStore(
          // TODO USERS COLLECTION
          "three0.tweeterdemo.users"
        ).then(db => {
          const data = db.get(AUTH.getAccountId());

          console.log(data);

          if(data) {
            let me = {
              ...data,
              uid: data._id,
            }
            me.profilePicture = !data.profilePicture ? 'https://picsum.photos/200' : data.profilePicture,

            setUser(me);
          }else{
            const me = {
              username: AUTH.getAccountId(),
              name: AUTH.getAccountId(),
              email: "",
              profilePicture: `https://picsum.photos/seed/${AUTH.getAccountId()}/200`,
              bio: "",
            }
            DB.getDocStore(
              // TODO USERS COLLECTION
              "three0.tweeterdemo.users"
            ).then(db => {
              db.set(AUTH.getAccountId(), me).then(() => {
                console.log('saved');
                setUser({...me, uid: AUTH.getAccountId()});
              });
            });

            DB.getDocStore(
              // TODO CONNECTIONS COLLECTION
              "three0.tweeterdemo.connections"
            ).then(db => {
              db.add({
                followerID: AUTH.getAccountId(),
                followeeID: AUTH.getAccountId(),
              }).then(() => {
                console.log('saved connections');
              });
            })
          }
        })
      }
  } 
  }, [Router.pathname]);

  return (
    <>
      <title>Tweeter</title>
      <UserContext.Provider value={{ user, setUser }}>
        <HomeTweetsContext.Provider
          value={{ homeTweetsContext, setHomeTweetsContext }}>
          <ExploreTweetsContext.Provider
            value={{ exploreTweetsContext, setExploreTweetsContext }}>
            <BookmarksTweetsContext.Provider
              value={{ bookmarksTweetsContext, setBookmarksTweetsContext }}>
              <Component {...pageProps} />
            </BookmarksTweetsContext.Provider>
          </ExploreTweetsContext.Provider>
        </HomeTweetsContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default MyApp;
