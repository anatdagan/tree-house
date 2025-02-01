import useUser from "../hooks/useUser";

const ErrorMessage = () => {
  const { error } = useUser();
  return error && <p className="error">{error}</p>;
};
export default ErrorMessage;
