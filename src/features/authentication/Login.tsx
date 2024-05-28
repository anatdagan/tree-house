import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../firebase";
import BasicLogin from "./BasicLogin";
import classes from "./auth.module.css";

interface LoginProps {
  catchErrors: (error: unknown) => void;
}
const Login = ({ catchErrors }: LoginProps) => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      catchErrors(error);
    }
  };
  return (
    <div className={classes["login-page"]}>
      <button onClick={handleGoogleSignIn} className="btn">
        Login with Google
      </button>
      <div className={classes.or}>Or</div>
      <BasicLogin catchErrors={catchErrors} />
    </div>
  );
};
export default Login;
