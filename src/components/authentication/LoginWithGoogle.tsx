import classes from "@/components/authentication/auth.module.css";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/../firebase";
import useUser from "@/hooks/useUser";
const LoginWithGoogle = () => {
  const { catchErrors } = useUser();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      catchErrors(error);
    }
  };
  return (
    <section className={classes["google-login"]}>
      <button className={classes.googleSignIn} onClick={handleGoogleSignIn}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="38px"
          height="38px"
          viewBox="0 0 38 38"
          version="1.1"
        >
          // Generator: Sketch 47.1 (45422) -
          http://www.bohemiancoding.com/sketch
          <title>j3tG-on-white</title>
          <desc>Created with Sketch.</desc>
          <defs />
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g id="G-on-white">
              <rect
                id="button-bg-copy"
                fill="#FFFFFF"
                x="0"
                y="0"
                width="38"
                height="38"
                rx="1"
              />
              <polygon id="Shape" points="10 10 28 10 28 28 10 28" />
              <g
                id="logo_googleg_48dp"
                transform="translate(10.000000, 10.000000)"
              >
                <path
                  d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
                  id="Shape"
                  fill="#4285F4"
                />
                <path
                  d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
                  id="Shape"
                  fill="#34A853"
                />
                <path
                  d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
                  id="Shape"
                  fill="#FBBC05"
                />
                <path
                  d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
                  id="Shape"
                  fill="#EA4335"
                />
              </g>
            </g>
          </g>
        </svg>
        <span className={classes.googleSignIn__text}>Sign in with Google</span>
      </button>
    </section>
  );
};
export default LoginWithGoogle;
