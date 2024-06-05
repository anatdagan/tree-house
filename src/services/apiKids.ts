import { getDocDataFromCollection } from "./db";

export interface Kid {
  name: string;
  email: string;
  parentId: string;
  avatar: string;
  uid: string;
}

export async function getKidInfo(email?: string | null) {
  if (!email) throw new Error("getKidInfo error: Email is required");
  return (await getDocDataFromCollection("kids", "email", email)) as Kid;
}
