import { auth } from "../../../firebase";

const Logout = () => {
  return (
    <button onClick={() => auth.signOut()} className="btn right">
      Logout
    </button>
  );
};
export default Logout;
