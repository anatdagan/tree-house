import useChat from "../../hooks/useChat";

const HomeIcon = () => {
  const { switchRoom, defaultRoom } = useChat();
  return (
    <>
      <img
        src="images/home-icon.png"
        alt="Home"
        onClick={() => {
          switchRoom(defaultRoom);
        }}
      />
    </>
  );
};
export default HomeIcon;
