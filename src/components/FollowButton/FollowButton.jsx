import PersonAddIcon from "@material-ui/icons/PersonAdd";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import Three0 from "../../three0";

const FollowButton = ({ userID }) => {
  const { user } = useContext(UserContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [connectionDocID, setFollowingDocID] = useState("");

  const startFollowing = () => {
    if (!user) {
      alert("You need to sign in for that");
      return;
    }

    let id = Three0.DB.create_UUID();

    Three0.DB.orbitdb.docs(
      // TODO CONNECTIONS COLLECTION
    ).then(connectionsCollection => {
      connectionsCollection.put({
        _id: id,
        followerID: user.uid,
        followeeID: userID,
      }).then(() => {
        setIsFollowing(true);
        setFollowingDocID(id);
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  const stopFollowing = () => {
    if (!user) {
      alert("You need to sign in for that");
      return;
    }

    Three0.DB.orbitdb.docs(
      // TODO CONNECTIONS COLLECTION
    ).then(connectionsCollection => {
      connectionsCollection.del(connectionDocID).then(() => {
        setIsFollowing(false);
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });

  };

  useEffect(() => {
    if (user) {
      async function checkFollowing() {
        const result = (await Three0.DB.orbitdb.docs(
          // TODO CONNECTIONS COLLECTION
        )).query(doc => doc.followeeID == userID && doc.followerID == user.uid);
          
        if (result.length === 1) {
          setIsFollowing(true);
          setFollowingDocID(result[0]._id);
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
