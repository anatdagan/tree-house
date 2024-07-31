import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import classes from "./auth.module.css";
import useUser from "@/hooks/useUser";

const BasicLogin = () => {
  const { catchErrors } = useUser();
  const login = (email: string, password: string) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password).catch(catchErrors);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
