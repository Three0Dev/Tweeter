import CircularProgress from "@mui/material/CircularProgress";
import { handleSignIn } from "../../services/Authentication";
import { useState } from "react";

const AuthForm = () => {
  const [authLoading, setAuthLoading] = useState(false);
  const Auth = () => (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setAuthLoading(true);
          handleSignIn();
          setAuthLoading(false);
        }}>
        <div className="flex flex-row flex-wrap items-center">
          <button
            className={`relative text-white font-bold py-4 px-8 rounded focus:outline-none focus:shadow-outline ${
              authLoading ? "cursor-not-allowed bg-blue-300" : "bg-primary"
            } `}
            type="submit">
            Sign In
            {authLoading && (
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: " translate(-50%, -50%)",
                }}>
                <CircularProgress />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="w-full">
      <Auth />
    </div>
  );
};

export default AuthForm;
