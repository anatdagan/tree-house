import { ChatAction, ChatActionTypes } from "../../reducers/chatReducer";
import { ChatRoom } from "../chatroom/types/Rooms";

interface HomeIconProps {
  dispatch: React.Dispatch<ChatAction>;
  generalRoom: ChatRoom | null;
}
const HomeIcon = ({ dispatch, generalRoom }: HomeIconProps) => {
  return (
    <div
      className="home-icon"
      onClick={() => {
        dispatch({
          type: ChatActionTypes.SWITCH_ROOM,
          payload: { room: generalRoom },
        });
      }}
    >
      <img src="images/home-icon.png" alt="Home" />
    </div>
  );
};
export default HomeIcon;
