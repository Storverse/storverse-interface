import { UserProfileService } from "storverse-sao-api";

import { ConnectWallet } from "./keplr";
import utils from "@/utils/utils";
var connectWallet: ConnectWallet = {
  modelManager: undefined,
  provider: undefined,
  sid: "",
};

var userProfileService: any = {};

export type UserProfile = {
  id?: never | string | undefined;
  createdAt: number;
  updatedAt: number;
  did: string;
  ethAddr: string;
  avatar: string;
  username: string;
  followingCount: string;
  twitter: string;
  youtube: string;
  bio: string;
  banner: string;
  followingDataId: string;
};


export function initService(wallet: ConnectWallet) {
  connectWallet = wallet;
  userProfileService = new UserProfileService(connectWallet.modelManager);
}


export async function getUserProfile(id?: string) {
  return userProfileService
    .GetUserProfile(id, id ? "" : connectWallet.sid)
    .catch((err: any) => {
      console.log(err);
    });
}


export async function saveUserProfile(profile: UserProfile) {
  return userProfileService
    .SaveUserProfile(profile)
    .then((res: any) => {
      utils.ElMessage("success");
      return res;
    })
    .catch((err: any) => {
      console.log(err.message);
      utils.ElMessage("error", err.message);
      return err;
    });
}

export async function saveUserAvatar(profileId: string, avatar: string) {
  return userProfileService.SaveUserAvatar(profileId, avatar);
}

export async function SaveUserBanner(profileId: string, banner: string) {
  return userProfileService.SaveUserBanner(profileId, banner);
}


export async function deleteUserProfile(id: string) {
  return userProfileService.DeleteUserProfile(id);
}


export async function getSuggestedUsers(id: string) {
  const token = localStorage.getItem('token') || undefined;
  return userProfileService.GetSuggestedUsers(id, token);
}



export async function updateDataModelPermission(id: string) {
  return userProfileService.ShareUserProfile(id, [
    "did:key:zQ3shrEb8QivraEDEe627YU9dyRfgBEbS5Ch4MF3KRCB8YVxw",
  ]);
}


export async function getDataId(did?: string) {
  // const modelKey = `${did ? did : connectWallet.sid}-user_profile-30293f0f-3e0f-4b3c-aff1-890a2fdf063b:`;
  return userProfileService.getDataId(connectWallet.sid);
}

export async function GetCoinPrice(symbol: string) {
  return UserProfileService.GetCoinPrice(symbol);
}
export async function GetEarningsByMonth(userDataID: string) {
  const token = localStorage.getItem('token') || undefined;
  return userProfileService.GetEarningsByMonth(userDataID, token);
}
export async function GetUserProfileOfOthers(id: string) {
  return UserProfileService.GetUserProfileOfOthers(id);
}
export async function GetPurchaseOrders(
  userDataID?: string,
  itemDataID?: string,
  limit?: number,
  offset?: number
) {
  const token = localStorage.getItem('token') || undefined;
  return userProfileService.GetPurchaseOrders(
    userDataID,
    itemDataID,
    limit,
    offset,
    token
  );
}
