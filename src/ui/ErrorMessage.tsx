const ErrorMessage = ({ error }: { error: string }) => {
  return error && <p className="error">{error}</p>;
};
export default ErrorMessage;
