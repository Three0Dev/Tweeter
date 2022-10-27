import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BookmarksTweetsContext from "../context/BookmarksTweetsContext";
import ExploreTweetsContext from "../context/ExploreTweetsContext";
import HomeTweetsContext from "../context/HomeTweetsContext";
import UserContext from "../context/UserContext";
import "../styles/global.css";
import "../styles/reset.css";
import {init, Database as DB, Auth as AUTH} from '@three0dev/js-sdk';
import env from "../env";

function MyApp({ Component, pageProps }) {
  const Router = useRouter();
  const protectedRoutes = ["/home", "/bookmarks"];

  const [user, setUser] = useState(null);
  const [homeTweetsContext, setHomeTweetsContext] = useState(null);
  const [exploreTweetsContext, setExploreTweetsContext] = useState(null);
  const [bookmarksTweetsContext, setBookmarksTweetsContext] = useState(null);

  useEffect(() => {
    init(env.three0Config).then(initBody)

    function initBody(){
      if (!AUTH.isLoggedIn()) {
        if (protectedRoutes.includes(Router.pathname)) Router.push("/");
        setUser(null);
      } else {
        DB.DocStore(env.usersDB).then(db => {
          const data = db.get(AUTH.getAccountId());

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
            
            db.set(AUTH.getAccountId(), me).then(() => {
              console.log('saved');
              setUser({...me, uid: AUTH.getAccountId()});
            });

            DB.DocStore(env.connectionsDB).then(db => {
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
