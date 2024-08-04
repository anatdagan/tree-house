import { FirebaseApp } from "firebase/app";
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

export function getAvatar(app: FirebaseApp, avatar?: string, email?: string) {
  const folder = email && avatar ? email : "default";

  if (avatar && avatar.startsWith("http")) return avatar;
  return getDownloadURL(
    ref(
      getStorage(app),
      `gs://treehouse-chat-app.appspot.com/b/treehouse-chat-app.appspot.com/o/images/${folder}/${
        avatar || "avatar.png"
      }`
    )
  );
}

export async function updateKidInfo(kid: Kid, newData: Partial<Kid>) {
  return await updateDocData("kids", kid.email, { ...kid, ...newData });
}
export async function updateKidStatus(kid: Kid, status: KidStatus) {
  return await updateKidInfo(kid, { status });
}

export async function getKidParent(kid: Kid) {
  return await getDocDataById("parents", kid.parentId);
}

export async function getKidInfoByUid(app: FirebaseApp, uid?: string | null) {
  if (!uid) {
    return null;
  }
  console.log("Getting kid info", uid);
  const kidInfo = await getDocDataFromCollection<Kid>("kids", "uid", uid);
  if (!kidInfo) {
    return null;
  }
  kidInfo.avatar = await getAvatar(app, kidInfo.avatar, kidInfo.email);
  return kidInfo;
}

// todo: add fuzzy spelling search
export async function getKidByDisplayName(
  app: FirebaseApp,
  displayName: string
) {
  const kidInfo = (await getDocDataFromCollection(
    "kids",
    "displayName",
    displayName
  )) as Kid;
  if (!kidInfo) {
    return null;
  }
  kidInfo.avatar = await getAvatar(app, kidInfo.avatar, kidInfo.email);
  return kidInfo;
}
