import classes from "@/components/authentication/auth.module.css";
interface ProfilePicProps {
  avatar: string;
  displayName: string;
  width: string;
  height: string;
}
const ProfilePic = ({
  avatar,
  displayName,
  width,
  height,
}: ProfilePicProps) => (
  <img
    className={classes.avatar}
    src={avatar}
    alt={displayName}
    height={width}
    width={height}
  ></img>
);
export default ProfilePic;
