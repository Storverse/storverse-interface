import { NotificationService } from "storverse-sao-api";

import { ConnectWallet } from "./keplr";

var connectWallet: ConnectWallet = {
  modelManager: undefined,
  provider: undefined,
  sid: "",
};

var notificationService: any = {};

export type Notification = {
  [x: string]: any;
  baseDataId?: never | string | undefined;
  createdAt: number;
  updatedAt: number;
  fromUser: string;
  toUser: string;
  messageType: number;
  message: string;
  status: number;
};

type NotificationsInfo = {
  items: Notification[];
  totalCount: number;
  unreadCounts: UnreadCountInfo[];
};

type UnreadCountInfo = {
  MessageType: string;
  UnreadCount: number;
};

export type ReadNotifications = {
  time: number;
  owner: string;
  messageType: number;
};
import { UserState } from "@/store/modules/users";
export function initService(wallet: ConnectWallet) {
  connectWallet = wallet;
  notificationService = new NotificationService(connectWallet.modelManager);
}

export async function getNotifications(
  messageType: string,
  toUser: string,
  limit?: number,
  offset?: number
): Promise<NotificationsInfo> {
  const token = localStorage.getItem("token") || undefined;
  return notificationService.GetNotifications(
    messageType,
    toUser,
    limit,
    offset,
    token
  );
}

export async function saveReadNotifications(
  readNotifications: ReadNotifications,
  did: string
) {
  return notificationService.SaveReadNotifications(readNotifications, did);
}
