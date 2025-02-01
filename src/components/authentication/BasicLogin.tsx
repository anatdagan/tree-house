import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import classes from "./auth.module.css";
import useUser from "@/hooks/useUser";

function formatLoginError(error: any) {
  console.debug("formatLoginError", error.message);
  function getMessage(error: Error) {
    switch (error.message) {
      case "Firebase: Error (auth/user-not-found).":
        return "User not found";
      case "Firebase: Error (auth/wrong-password).":
        return "Wrong password";
      default:
        return "Login failed";
    }
  }
  return new Error(getMessage(error));
}
const BasicLogin = () => {
  const { catchErrors } = useUser();
  const login = (email: string, password: string) => {
    console.debug("login");
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password).catch((error) => {
      return catchErrors(formatLoginError(error));
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.debug("handleSubmit");
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default BasicLogin;
