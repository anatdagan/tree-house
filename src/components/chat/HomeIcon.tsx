import useUser from "@/hooks/useUser";

const HomeIcon = () => {
  const { switchRoom, defaultRoom } = useUser();
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
