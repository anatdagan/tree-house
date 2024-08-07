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
      {/* 
// @ts-ignore */}
      <button popovertarget="user-details" style={{ padding: 0, margin: 0 }}>
        <ProfilePic
          avatar={avatar}
          displayName={displayName}
          width="45px"
          height="45px"
        />
      </button>
      {/* 
// @ts-ignore */}
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
