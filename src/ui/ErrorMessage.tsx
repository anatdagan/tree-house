import useUser from "../hooks/useUser";

const ErrorMessage = () => {
  const { error } = useUser();
  console.debug("error", error);
  return error && <p className="error">{error}</p>;
};
export default ErrorMessage;
