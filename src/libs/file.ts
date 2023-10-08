import { FileService } from "storverse-sao-api";
import {UserState} from "@/store/modules/users";

import { ConnectWallet, generatePeerInfo, getMultiAddress } from "./keplr";

var connectWallet: ConnectWallet = {
    modelManager: undefined,
    provider: undefined,
    sid: ""
};
export type FileInfo = {

    id: string;
    createdAt: number;
    fileDataId: string;
    contentType: string;
    owner: string;
    filename: string;
    fileCategory: string;
    verseId: string;
};

var fileService: any = {};



export function initService(wallet: ConnectWallet) {
    connectWallet = wallet;
    
    
    fileService = new FileService(connectWallet.modelManager);
}

export async function getFileInfo(id: string) {

    return fileService.GetFileInfo(id);
}


export async function uploadFileDataModel(file: File, fileInfo: FileInfo, isPublic = true) {
    let peerInfo = await generatePeerInfo();
    let multiAddr = await getMultiAddress();
    let address = multiAddr[0];
    console.log(address);

    try {
        const uploadResult = await fileService.UploadFile(file, address, peerInfo);
        console.log("Content CID: " + uploadResult.cid);
        console.log("Content length: " + uploadResult.fileSize);

        var timeString = Date.now();
        fileInfo.createdAt = timeString;

        const postFileResult = await fileService.PostFile(file.name, uploadResult.fileSize, uploadResult.cid, fileInfo);
        return postFileResult;

    } catch (error: unknown) {
        console.error(error);
    
        if (typeof error === "object" && error !== null && "message" in error) {
            const err = error as { message: string };
    
            if (err.message.includes("Opening handshake failed")) {
                // Fallback to UploadFileDataModel
                const fallbackResult = await fileService.UploadFileDataModel(file, fileInfo, isPublic);
                return fallbackResult;
            }
        }
    
        throw error;
    }
}


export async function createFileDataModel(file: File) {
    return fileService.CreateFileDataModel(file);
}



export async function downloadFile(dataId: string,useLibp2p:boolean,getFromFileInfo:boolean,getBase64=false) {
    return fileService.DownloadFile(dataId,useLibp2p,getFromFileInfo,getBase64);
}

export async function downloadFileOfOthers(id: string, userDataId?: string, getBase64 = false) {
    const token = localStorage.getItem('token') || undefined;
    const GetUserDataId = userDataId?userDataId:''
    return FileService.DownloadFileOfOthers(id, GetUserDataId, getBase64, token);
    
}


export async function getFileInfoOfOthers(id: string, userDataId?: string) {
    const token = localStorage.getItem('token') || undefined;
    const GetUserDataId = userDataId?userDataId:''
    return FileService.GetFileInfoOfOthers(id, GetUserDataId, token);
}


export async function deleteFile(id: string) {
    return fileService.Delete(id);
}




export async function uploadFile(file: File) {
    let peerInfo = generatePeerInfo();
    let multiAddr = getMultiAddress();
    return fileService.UploadFile(file, multiAddr, peerInfo);
}


export async function createFile(fileName: string, fileSize: number, cid: string) {
    return fileService.CreateFile(fileName, fileSize, cid);
}

export async function getFileInfosByVerseIds(verseIds: string[], userDataId: string) {
    return FileService.GetFileInfosByVerseIds(verseIds, userDataId);
}
/**
 * getProfileFileInfos
 */

export async function getProfileFileInfos(userDataId: string, limit?: number, offset?: number,caller?:string) {
    const token = localStorage.getItem('token') || undefined;

    return FileService.GetFileInfos(userDataId, limit,offset,token,caller);
}
