import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../firebase";
import BasicLogin from "./BasicLogin";
import classes from "./auth.module.css";
import useUser from "@/hooks/useUser";

const Login = () => {
  const { catchErrors } = useUser();
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      catchErrors(error);
    }
  };
  return (
    <div className={classes["login-page"]} data-testid="login">
      <button onClick={handleGoogleSignIn} className="btn">
        Login with Google
      </button>
      <div className={classes.or}>Or</div>
      <BasicLogin />
    </div>
  );
};
export default Login;
