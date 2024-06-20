import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../firebase";
import BasicLogin from "./BasicLogin";
import classes from "./auth.module.css";
import useChat from "../../hooks/useChat";

const Login = () => {
  const { catchErrors } = useChat();
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
