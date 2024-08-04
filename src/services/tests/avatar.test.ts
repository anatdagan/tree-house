import { beforeEach, describe, expect, it, Mock } from "vitest";
import { getAvatar, getKidInfoByUid } from "../apiKids";
import { getDownloadURL } from "firebase/storage";
import { getDocDataFromCollection } from "../db";

describe("Avatar", {}, () => {
  const app = {
    name: "[DEFAULT]",
    automaticDataCollectionEnabled: false,
    options: {
      storageBucket: "treehouse-chat-app.appspot.com",
    },
  };
  const fakeStorageUrl =
    "gs://treehouse-chat-app.appspot.com/b/treehouse-chat-app.appspot.com/o/images/default/avatar.png";

  beforeEach(() => {
    (getDownloadURL as Mock).mockResolvedValue(fakeStorageUrl);
  });
  describe("getAvatar", {}, async () => {
    it("should return the avatar of the user", async () => {
      const avatar = await getAvatar(app, "avatar.png", "kid@test.com");
      expect(avatar).toBe(fakeStorageUrl);
    });
  });
  describe("getKidInfoByUid", {}, () => {
    it("should call getAvatar", async () => {
      (getDocDataFromCollection as Mock).mockResolvedValue({
        uid: "123",
        avatar: "avatar.png",
        displayName: "Kid",
        email: "kid@test.com",
        parentId: "456",
        status: "active",
      });
      const kid = await getKidInfoByUid(app, "123");
      expect(kid).toBeDefined();
      expect(kid?.avatar).toBe(fakeStorageUrl);
    });
  });
});
