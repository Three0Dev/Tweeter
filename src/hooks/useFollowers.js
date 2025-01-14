import React, { useContext } from 'react';
import UserContext from '../context/UserContext';
import { fetchUser, fetchUserFollowers } from '../services/FetchData';

export function useFollowers(userId) {
  const { user } = useContext(UserContext);
  const [followers, setFollowers] = React.useState([]);
  const [isFollowersLoading, setIsFollowersLoading] = React.useState(true);

  const getFollowers = async () => {
    const data = [];
    setIsFollowersLoading(true);
    if (user) {
      const followersSnapShot = await fetchUserFollowers(userId);
      console.log(followersSnapShot);
      for (let i = 0; i < followersSnapShot.length; i++) {
        data.push(
          await fetchUser({
            userID: followersSnapShot[i].followerID,
          }),
        );
      }
    }
    setFollowers(data);
    setIsFollowersLoading(false);
  };

  return { followers, isFollowersLoading, getFollowers };
}
