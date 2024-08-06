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
          width="50rem"
          height="50rem"
        />
      </a>
    </>
  );
};
export default HomeIcon;
