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
          width="72px"
          height="72px"
        />
      </a>
    </>
  );
};
export default HomeIcon;
