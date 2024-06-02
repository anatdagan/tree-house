import { Timestamp } from "firebase/firestore";

const timestampToDate = (timestamp: Timestamp) => {
  if (!timestamp) {
    return new Date();
  }
  return new Date(timestamp.seconds * 1000);
};
export const extractTime = (timestamp: Timestamp) => {
  const date = timestampToDate(timestamp);
  return `${date.getHours()}:${date.getMinutes()}`;
};
