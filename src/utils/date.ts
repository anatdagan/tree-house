import { Timestamp } from "firebase/firestore";

const timestampToDate = (timestamp: Timestamp) => {
  if (!timestamp) {
    return new Date();
  }
  return new Date(timestamp.seconds * 1000);
};
export const extractTime = (timestamp: Timestamp) => {
  const date = timestampToDate(timestamp);
  return `${date.toLocaleTimeString("en-GB", {
    // you can use undefined as first argument
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};
