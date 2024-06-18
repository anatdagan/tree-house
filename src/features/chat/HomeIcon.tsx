import useChat from "../../hooks/useChat";

const HomeIcon = () => {
  const { switchRoom, defaultRoom } = useChat();
  return (
    <>
      <a href="#home">
        <img
          src="images/home-icon.png"
          alt="Home"
          onClick={() => switchRoom(defaultRoom)}
        />
      </a>
    </>
  );
};
export default HomeIcon;
