import useUser from "@/hooks/useUser";
import { getCounselor } from "@/services/chatbots/apiCounselors";
import classes from "@/components/chat/chat.module.css";
interface CounselorIconProps {
  counselorId: string;
}
const CounselorIcon = ({ counselorId }: CounselorIconProps) => {
  const counselor = getCounselor(counselorId);
  if (!counselor?.avatar) {
    return null;
  }
  const counselorIcon = counselor.avatar;
  const { setActiveCounselorId, kidInfo, selectedChatRoom } = useUser();
  if (!selectedChatRoom) {
    return null;
  }
  const onCounselorIconClick = () => {
    console.log("Counselor icon clicked", counselorId);
    setActiveCounselorId(counselorId);
    counselor?.onKidMessage(
      `${kidInfo?.displayName} is inviting you to join the chat.`,
      selectedChatRoom.id
    );
  };
  return (
    <div className={classes["counselor-icon"]}>
      <a href="#">
        <img
          src={counselorIcon}
          width="45px"
          height="45px"
          alt={counselorId}
          onClick={onCounselorIconClick}
        />
      </a>
    </div>
  );
};
export default CounselorIcon;
