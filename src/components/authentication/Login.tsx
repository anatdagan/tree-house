import BasicLogin from "./BasicLogin";
import classes from "./auth.module.css";
import LoginWithGoogle from "./LoginWithGoogle";
import Intro from "./Intro";

const Login = () => {
  return (
    <>
      <Intro />
      <main className={classes["login-container"]}>
        <div className={classes["login-page"]} data-testid="login">
          <BasicLogin />
          <div className={classes.or}>Or</div>
          <LoginWithGoogle />
        </div>
      </main>
    </>
  );
};
export default Login;
