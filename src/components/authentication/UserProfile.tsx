import { Kid } from "@/services/apiKids";
import Logout from "./Logout";
import ProfilePic from "./ProfilePic";
interface UserProfileProps {
  kidInfo: Kid;
}
const UserProfile = ({ kidInfo }: UserProfileProps) => {
  const { avatar, displayName } = kidInfo;
  return (
    <>
      <button popovertarget="user-details">
        <ProfilePic
          avatar={avatar}
          displayName={displayName}
          width="45px"
          height="45px"
        />
      </button>
      <div id="user-details" popover="true">
        <section>
          <ProfilePic
            avatar={avatar}
            displayName={displayName}
            width="45px"
            height="45px"
          />
          <h2>Display Name: {kidInfo.displayName}</h2>
          <Logout />
        </section>
      </div>
    </>
  );
};
export default UserProfile;
