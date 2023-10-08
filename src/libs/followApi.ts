import { UserFollowingService } from "storverse-sao-api";

import { ConnectWallet } from "@/libs/keplr";
import utils from "@/utils/utils";
var connectWallet: ConnectWallet = {
  modelManager: undefined,
  provider: undefined,
  sid: "",
};

export type UserFollowing = {
  id?: never | string | undefined;
  createdAt: number;
  updatedAt: number;
  expiredAt: number;
  follower: string;
  following: string;
  status: number;
};

var userFollowingService: any = {};


export function initService(wallet: ConnectWallet) {
  connectWallet = wallet;
  userFollowingService = new UserFollowingService(wallet.modelManager);
}


export async function getUserFollowing(id: string) {
  return userFollowingService.GetUserFollowing(id);
}


export async function getUserFollowerdList(
  followingDataId: string,
  isExpired: boolean,
  userDataId?: string,
  limit?: number,
  offset?: number
) {
  console.log(followingDataId, isExpired, userDataId, limit, offset);
  const token = localStorage.getItem("token") || undefined;
  return userFollowingService.GetUserFollowedList(
    followingDataId,
    isExpired,
    userDataId,
    limit,
    offset,
    token
  );
}


export async function saveUserFollowing(
  userFollowing: UserFollowing,
  did: string
) {
  return userFollowingService
    .SaveUserFollowing(userFollowing, did)
    .then((res: any) => {
      utils.ElMessage("success");
      return res;
    })
    .catch((err: any) => {
      utils.ElMessage("error", err.message);
      return;
    });
}


export async function shareUserFollowing(id: string, sids: string[]) {
  return userFollowingService.ShareUserFollowing(id, sids);
}


export async function deleteUserFollowing(id: string, did: string) {
  return userFollowingService
    .DeleteUserFollowingByFollowingId(id, did)
    .then((res: any) => {
      utils.ElMessage("success");
      return res;
    })
    .catch((err: any) => {
      utils.ElMessage("error", err.message);
      return;
    });
}

export async function GetUserFollowers(
  followingDataId: string,
  mutualWithId?: string,
  userDataId?: string,
  limit?: number,
  offset?: number
) {
  console.log(followingDataId, mutualWithId, userDataId, limit, offset);
  const token = localStorage.getItem("token") || undefined;
  return userFollowingService.GetUserFollowers(
    followingDataId,
    mutualWithId,
    userDataId,
    limit,
    offset,
    token
  );
}
