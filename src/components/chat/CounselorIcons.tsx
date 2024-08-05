import CounselorIcon from "./CounselorIcon";
import classes from "./chat.module.css";
const CounselorIcons = () => {
  return (
    <ul className={classes["counselor-icons"]}>
      <li>
        <CounselorIcon counselorId="jimmy" />
      </li>
      <li>
        <CounselorIcon counselorId="minnie" />
      </li>
    </ul>
  );
};
export default CounselorIcons;
