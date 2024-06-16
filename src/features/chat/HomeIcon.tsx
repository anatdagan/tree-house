import useChat from "../../hooks/useChat";

const HomeIcon = () => {
  const { switchRoom, defaultRoom } = useChat();
  return (
    <div
      className="home-icon"
      onClick={() => {
        switchRoom(defaultRoom);
      }}
    >
      <img src="images/home-icon.png" alt="Home" />
    </div>
  );
};
export default HomeIcon;
