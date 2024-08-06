import { auth } from "../../../firebase";
import classes from "../../App.module.css";
const Logout = () => {
  return (
    <button onClick={() => auth.signOut()} className={classes.btn}>
      Logout
    </button>
  );
};
export default Logout;
