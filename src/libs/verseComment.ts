import { VerseCommentService } from "storverse-sao-api";

import { ConnectWallet } from "./keplr";
import utils from "@/utils/utils";
var connectWallet: ConnectWallet = {
  modelManager: undefined,
  provider: undefined,
  sid: "",
};

export type VerseComment = {
  id?: never | string | undefined;
  createdAt: number;
  updatedAt: number;
  comment: string;
  parentId: string | null;
  parent: VerseComment | null;
  verseId: string;
  owner: string;
  likeCount: number;
  hasLiked: number;
  ownerEthAddr: string;
  ownerAvatar: string;
  ownerUsername: string;
  ownerBio: string;
};

export type VerseCommentLike = {
  id?: never | string | undefined;
  createdAt: number;
  updatedAt: number;
  commentId: string;
  status: number;
  owner: string;
};

var verseCommentService: any = {};

export function initService(wallet: ConnectWallet) {
  connectWallet = wallet;
  verseCommentService = new VerseCommentService(connectWallet.modelManager);
}

export async function getVerseComment(id: string) {
  return verseCommentService.GetVerseComment(id);
}

export async function getVerseCommentsByVerseId(
  verseId: string,
  userDataId?: string,
  limit?: number,
  offset?: number
) {
  console.log(verseCommentService);
  console.log(verseId, userDataId, limit, offset, "------");

  const token = localStorage.getItem('token') || undefined;
  return verseCommentService.GetVerseCommentsByVerseId(
    verseId,
    userDataId,
    limit,
    offset,
    token
  );
}

export async function saveVerseComment(verseComment: VerseComment) {
  return verseCommentService
    .SaveVerseComment(verseComment)
    .then((res: any) => {
      utils.ElMessage("success");
      return res;
    })
    .catch((err: any) => {
      utils.ElMessage("error", err.message);
      return err;
    });
}

export async function deleteVerseComment(id: string) {
  return verseCommentService
    .DeleteVerseComment(id)
    .then((res: any) => {
      utils.ElMessage("success");
      return res;
    })
    .catch((err: any) => {
      utils.ElMessage("error", err.message);
      return err;
    });
}

export async function getVerseCommentLike(id: string) {
  return verseCommentService.GetVerseCommentLike(id);
}

export async function saveVerseCommentLike(
  verseCommentsLike: VerseCommentLike,
  did: string
) {
  return verseCommentService
    .SaveVerseCommentLike(verseCommentsLike, did)
    .then((res: any) => {
      utils.ElMessage("success");
      return res;
    })
    .catch((err: any) => {
      utils.ElMessage("error", err.message);
      return err;
    });
}

export async function deleteVerseCommentLike(id: string, did: string) {
  return verseCommentService
    .DeleteVerseCommentLike(id, did)
    .then((res: any) => {
      utils.ElMessage("success");
      return res;
    })
    .catch((err: any) => {
      utils.ElMessage("error", err.message);
      return err;
    });
}
