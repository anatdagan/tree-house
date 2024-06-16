import useChat from "../hooks/useChat";

const ErrorMessage = () => {
  const { error } = useChat();
  return error && <p className="error">{error}</p>;
};
export default ErrorMessage;
