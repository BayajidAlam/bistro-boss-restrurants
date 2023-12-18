import { useContext } from "react";
import { FaGoogle } from "react-icons/fa6";
import { AuthContext } from "../../providers/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
const SocialLogIn = () => {
  const { signInWithGoogle } = useContext(AuthContext);

  let navigate = useNavigate();
  let location = useLocation();
  let from = location.state?.from?.pathname || "/";

  // google sign in
  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        console.log(result,'result');
        const userInfo = {
          user_name: result?.user?.displayName,
          user_email: result?.user?.email,
        };
        if (result) {
          fetch("http://localhost:5000/users", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(userInfo),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              navigate(from, { replace: true });
            });
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
      });
  };

  return (
    <div>
      <div className="divider"></div>
      <div className="flex justify-center items-center">
        <button
          onClick={() => handleGoogleSignIn()}
          className="btn btn-circle btn-outline"
        >
          <FaGoogle />
        </button>
      </div>
    </div>
  );
};

export default SocialLogIn;
