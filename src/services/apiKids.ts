import {
  getDocById as getDocDataById,
  getDocDataFromCollection,
  updateDocData,
} from "./db";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

export enum KidStatus {
  NEW = "new",
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
}

export interface Kid {
  displayName: string;
  email: string;
  parentId: string;
  avatar: string;
  status: string;
  uid: string;
}

export async function getKidInfo(email?: string | null) {
  if (!email) throw new Error("getKidInfo error: Email is required");
  console.log("Getting kid info", email);
  const kidInfo = (await getDocDataFromCollection(
    "kids",
    "email",
    email
  )) as Kid;
  if (!kidInfo) return null;
  kidInfo.avatar = await getAvatar(kidInfo?.avatar, email);
  return kidInfo;
}

export function getAvatar(avatar?: string, email?: string) {
  const folder = email && avatar ? email : "default";
  const storage = getStorage();
  if (avatar && avatar.startsWith("http")) return avatar;
  return getDownloadURL(
    ref(
      storage,
      `gs://treehouse-chat-app.appspot.com/b/treehouse-chat-app.appspot.com/o/images/${folder}/${
        avatar || "avatar.png"
      }`
    )
  );
}

export async function updateKidInfo(kid: Kid, newData: Partial<Kid>) {
  console.log("Updating kid info", kid);
  return await updateDocData("kids", kid.email, { ...kid, ...newData });
}

export async function getKidParent(kid: Kid) {
  return await getDocDataById("parents", kid.parentId);
}

// todo: add fuzzy spelling search
export async function getKidByDisplayName(displayName: string) {
  return (await getDocDataFromCollection(
    "kids",
    "displayName",
    displayName
  )) as Kid;
}
