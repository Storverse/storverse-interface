import { VerseService } from "storverse-sao-api";
import {UserState} from "@/store/modules/users";

import { ConnectWallet } from "./keplr";
import utils from "@/utils/utils";
var connectWallet: ConnectWallet = {
  modelManager: undefined,
  provider: undefined,
  sid: "",
};

export type Verse = {
  id?: never | string | undefined;
  createdAt: number;
  fileIds: string[];
  owner: string;
  price: string;
  digest: string;
  scope: number;
  status: number;
  nftTokenId: string;
  isPaid: boolean;
};

export type VerseLike = {
  id?: never | string | undefined;
  createdAt: number;
  updatedAt: number;
  verseId: string;
  status: number;
  owner: string;
};

export type BookMark = {
  id?: never | string | undefined;
  verseIds: string[];
};

var verseService: any = {};


export function initService(wallet: ConnectWallet) {
  connectWallet = wallet;
  verseService = new VerseService(connectWallet.modelManager);
}


export async function saveVerse(verse: Verse) {
  return verseService
    .SaveVerse(verse)
    .then((res: any) => {
      utils.ElMessage("success");
      return res;
    })
    .catch((err: any) => {
      console.log(err, "===");
      utils.ElMessage("error", err.message);
      return err;
    });
}


export async function getVerse(id: string) {
  return verseService.GetVerse(id);
}


export async function getVerseOfOthers(
  id: string,
  userDataId: string,
  bookMark?: any
) {
  const token = localStorage.getItem("token") || undefined;
  return VerseService.GetVerseOfOthers(id, userDataId, bookMark, token);
}


export async function getVersesByOwner(
  owner: string,
  userDataId?: string,
  bookMark?: any,
  limit?: number,
  offset?: number
) {
  const token = localStorage.getItem("token") || undefined;
  return VerseService.GetVersesByOwner(
    owner,
    userDataId,
    bookMark,
    limit,
    offset,
    token
  );
}


export async function GetHomeVerses(
  userDataId?: string,
  limit?: number,
  offset?: number,
  bookMark?: any
) {
  const token = localStorage.getItem("token") || undefined;
  return VerseService.GetHomeVerses(userDataId, limit, offset, bookMark, token);
}


export async function deleteVerse(id: string) {
  return verseService
    .DeleteVerse(id)
    .then((res: any) => {
      utils.ElMessage("success");
      return res;
    })
    .catch((err: any) => {
      console.log(err, "0---0-0-");
      utils.ElMessage("error", err.message);
    });
}

export async function GetBookMark(did: string) {
  return verseService.GetBookMark(did);
}


export async function getVerseLike(id: string) {
  return verseService.GetVerseLike(id);
}

export async function saveVerseLike(verseLike: VerseLike, did: string) {
  console.log(verseService);
  
  return verseService
    .SaveVerseLike(verseLike, did)
    .then((res: any) => {
      utils.ElMessage("success");

      return res;
    })
    .catch((err: any) => {
      utils.ElMessage("error", err.message);
      // return err;
    });
}

export async function deleteVerseLike(id: string, did: string) {
  return verseService
    .DeleteVerseLike(id, did)
    .then((res: any) => {
      console.log(res);

      utils.ElMessage("success");
      return res;
    })
    .catch((err: any) => {
      console.log(err);
      
      utils.ElMessage("error", err.message);
      // return err;
      
    });
}


export async function getBookMark(did: string) {
  return verseService.GetBookMark(did);
}

export async function saveBookMark(bookMark: BookMark, did: string) {
  return verseService
    .SaveBookMark(bookMark, did)
    .then((res: any) => {
      console.log(res);
      
      utils.ElMessage("success");
      return res;
    })
    .catch((err: any) => {
      console.log(err);

      utils.ElMessage("error", err.message);
      return err;
    });
}

export async function addVerseIdToBookMark(verseId: string, did: string) {
  return verseService
    .AddVerseIdToBookMark(verseId, did)
    .then((res: any) => {
      console.log(res);
      
      utils.ElMessage("success");

      return res;
    })
    .catch((err: any) => {
      console.log(err);
      
      utils.ElMessage("error", err.message);
      // return err;
    });
}

export async function removeVerseIdFromBookMark(verseId: string, did: string) {
  return verseService
    .RemoveVerseIdFromBookMark(verseId, did)
    .then((res: any) => {
      utils.ElMessage("success");
      return res;
    })
    .catch((err: any) => {
      utils.ElMessage("error", err.message);
      // return err;
    });
}
//*******************************************book-market-page

export async function getMyBookMarkVerses(
  bookMark: BookMark,
  onlyFollowed: boolean,
  userDataId: string
) {
  const token = localStorage.getItem("token") || undefined;
  return VerseService.GetBookMarkVerses(
    bookMark,
    onlyFollowed,
    userDataId,
    token
  );
}
/**
 * get liked verse
 */
export async function getLikedVerses(
  userDataId: string,
  limit: number,
  offset: number,
  bookMark: any,
  caller?: string
) {
  const token = localStorage.getItem("token") || undefined;
  return VerseService.GetLikedVerses(
    userDataId,
    limit,
    offset,
    bookMark,
    token,
    caller
  );
}
/**
 * get profile media
 */
export async function getProfileMedia(
  userDataId: string,
  limit: number,
  offset: number,
  bookMark: any
) {
  const token = localStorage.getItem("token") || undefined;
  return VerseService.GetLikedVerses(
    userDataId,
    limit,
    offset,
    bookMark,
    token
  );
}
/**
 *
 */
export async function getSubscribedVerses(
  userDataId: string,
  limit: number,
  offset: number,
  bookMark?: any
) {
  const token = localStorage.getItem("token") || undefined;
  return VerseService.GetSubscribedVerses(
    userDataId,
    limit,
    offset,
    bookMark,
    token
  );
}
