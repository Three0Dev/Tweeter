import Link from "next/link";
import React from "react";
import AuthForm from "../components/AuthForm/AuthForm";
import Three0 from '../three0';

const SignUp = () => {
  React.useEffect(() => {
    // TODO migrate to SDK
    window.contract.user_exists({
      account: Three0.AUTH.getAccountId(),
    }).then(exists => {
      if (exists) return;
      Three0.DB.orbitdb.docs(
        // TODO USERS COLLECTION
        "three0.tweeterdemo.users"
      ).then(db => {
        let userPromise = db.put({
          _id: Three0.AUTH.getAccountId(),
          name: Three0.AUTH.getAccountId(),
          bio: null,
          profilePicture: "https://i.imgur.com/2YqQ7.png",
          email: null,
        });

        let connectionsPromise = db.put({
          _id: Three0.DB.create_UUID(),
          followerID: Three0.AUTH.getAccountId(),
          followingID: Three0.AUTH.getAccountId(),
        });

        Promise.all([userPromise, connectionsPromise]).then(() => {
          console.log("User created");
        }).catch(err => {
          console.log(err);
        });
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  }, []);


  return (
    <div className="h-screen flex justify-center items-center bg-blue-800">
      <div className="w-full lg:w-2/4 p-6 pb-0">
        <div className="my-4 py-2">
          <Link href="/">
            <img
              className="cursor-pointer"
              src="/images/logos/tweeter-light.svg"
              alt="logo"
            />
          </Link>
        </div>
        <div className="">
          <AuthForm type="signIn" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
