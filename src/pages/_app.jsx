import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BookmarksTweetsContext from "../context/BookmarksTweetsContext";
import ExploreTweetsContext from "../context/ExploreTweetsContext";
import HomeTweetsContext from "../context/HomeTweetsContext";
import UserContext from "../context/UserContext";
import "../styles/global.css";
import "../styles/reset.css";
import Three0, {init} from '../three0';

function MyApp({ Component, pageProps }) {
  const Router = useRouter();
  const protectedRoutes = ["/home", "/bookmarks"];

  const [user, setUser] = useState(null);
  const [homeTweetsContext, setHomeTweetsContext] = useState(null);
  const [exploreTweetsContext, setExploreTweetsContext] = useState(null);
  const [bookmarksTweetsContext, setBookmarksTweetsContext] = useState(null);

  useEffect(() => {
    init().then(otherStuff)

    function otherStuff(){
      if (!Three0.AUTH.isLoggedIn()) {
        if (protectedRoutes.includes(Router.pathname)) Router.push("/");
        setUser(null);
      } else {
        Three0.DB.get(
          // TODO USERS COLLECTION
          "three0.tweeterdemo.users"
        ).then(db => Three0.DB.fetchDB(db)).then(data => {
          if(data?.length > 0) {
            let me = {
              ...data[0].payload.value,
              uid: data[0].payload.value._id,
            }
            me.profilePicture = data[0].payload.value.profilePicture == "" ? 'https://picsum.photos/200' : data[0].payload.value.profilePicture,

            setUser(me);
          }else{
            const me = {
              _id: Three0.AUTH.getAccountId(),
              username: Three0.AUTH.getAccountId(),
              name: Three0.AUTH.getAccountId(),
              email: "",
              profilePicture: 'https://picsum.photos/200',
              bio: "",
            }
            Three0.DB.orbitdb.docs(
              // TODO USERS COLLECTION
              "three0.tweeterdemo.users"
            ).then(db => {
              db.put(me).then(() => {
                console.log('saved');
                setUser({...me, uid: Three0.AUTH.getAccountId()});
              });
            });

            Three0.DB.orbitdb.docs(
              // TODO CONNECTIONS COLLECTION
              "three0.tweeterdemo.connections"
            ).then(db => {
              db.put({
                _id: Three0.DB.create_UUID(),
                followerID: Three0.AUTH.getAccountId(),
                followeeID: Three0.AUTH.getAccountId(),
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
