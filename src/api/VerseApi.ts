import { UserFollowingService } from "storverse-sao-api";
import { ConnectWallet } from "@/libs/keplr";

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

// init service
export function initService(modelManager: any) {
  // connectWallet = wallet;
  userFollowingService = new UserFollowingService(modelManager);
}
