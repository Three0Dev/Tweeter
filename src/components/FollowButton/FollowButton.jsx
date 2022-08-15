import PersonAddIcon from "@mui/icons-material/PersonAdd";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import * as DB from '@three0dev/js-sdk/database';
import env from "../../env";

const FollowButton = ({ userID }) => {
  const { user } = useContext(UserContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [connectionDocID, setFollowingDocID] = useState("");

  const startFollowing = () => {
    if (!user) {
      alert("You need to sign in for that");
      return;
    }

    DB.getDocStore(env.connectionsDB).then(connectionsCollection => {
      connectionsCollection.add({
        followerID: user.uid,
        followeeID: userID,
      }).then((val) => {
        console.log(val);
        setIsFollowing(true);
        // setFollowingDocID(id);
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  const stopFollowing = () => {
    console.log("stop following");
    if (!user) {
      alert("You need to sign in for that");
      return;
    }

    DB.getDocStore(env.connectionsDB).then(connectionsCollection => {
      const result = connectionsCollection.where(doc => doc.followeeID == userID && doc.followerID == user.uid);
      try {
        for(let i=0; i < result.length; i++) {
          connectionsCollection.delete(result[i]._id).then(() => {
            setIsFollowing(false);
          }).catch(err => {
            console.log(err);
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
  }

  useEffect(() => {
    if (user) {
      async function checkFollowing() {
        const result = (await DB.getDocStore(env.connectionsDB)).where(doc => doc.followeeID == userID && doc.followerID == user.uid);
          
        if (result.length > 0) {
          setIsFollowing(true);
          // setFollowingDocID(result[0]._id);
        }
      }
      checkFollowing();
    }
  }, [user]);

  return (
    <div>
      <button
        className="lg:mr-0 lg:ml-auto bg-primary text-white px-2 py-4  lg:px-8 lg:py-4 rounded-md"
        type="submit"
        onClick={() => (isFollowing ? stopFollowing() : startFollowing())}>
        <span className="mx-2">
          <PersonAddIcon />
        </span>
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
};

export default FollowButton;
