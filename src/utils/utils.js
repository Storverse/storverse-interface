// import config from "./config";
import local from "./local";
import { ElMessage } from 'element-plus'
import i18n from '@/lang/index'
import {UserState} from "@/store/modules/users";

const t = i18n.global.t
export default {
	// getUUID: () => {
	// 	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	// 		var r = Math.random() * 16 | 0,
	// 			v = c == 'x' ? r : (r & 0x3 | 0x8);
	// 		return v.toString(16);
	// 	});
	// },

	// getUser: () => {
	// 	return JSON.parse(localStorage.getItem(config.localStorageUserKey)) || null;
	// },

	// getHeadserConfig: () => {
	// 	let saoSign = JSON.parse(localStorage.getItem(config.localStorageSignKey)) || null;
	// 	if (saoSign) {
	// 		return {
	// 			address: saoSign.address,
	// 			signaturemessage: encodeURI(saoSign.signaturemessage),
	// 			signature: saoSign.signature
	// 		}
	// 	}
	// 	return null;
	// },

	// setSignList(sign) {
	// 	let signList = JSON.parse(localStorage.getItem(config.localStorageSignKeyList)) || [];
	// 	let i = signList.findIndex(item => item.address === sign.address)
	// 	if (i >= 0) signList[i] = sign;
	// 	else signList.push(sign);
	// 	localStorage.setItem(config.localStorageSignKeyList, JSON.stringify(signList));
	// },

	// getCurrentSign(address) {
	// 	let signList = JSON.parse(localStorage.getItem(config.localStorageSignKeyList)) || [];
	// 	let currentSign = signList.find(item => item.address === address);
	// 	if (currentSign) {
	// 		localStorage.setItem(config.localStorageSignKey, JSON.stringify(currentSign));
	// 	}
	// 	return currentSign;
	// },

	getFileBase64: (file) => {
		return new Promise((resolve, reject) => {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function (e) {
				resolve(e.target.result.split("base64,")[1])
			};
		})
	},
	getFileAvatarBase64: (file) => {
		return new Promise((resolve, reject) => {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function (e) {
				resolve(e.target.result)
			};
		})
	},
	getImgBase64(url) {
		return new Promise((resolve, reject) => {
			var img = new Image()
			img.setAttribute('crossOrigin', 'Anonymous')
			img.onload = function () {
				var canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				var ctx = canvas.getContext("2d");
				img.setAttribute("crossOrigin", 'Anonymous')
				ctx.drawImage(img, 0, 0, img.width, img.height);
				var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
				var base64 = canvas.toDataURL("image/" + ext).split("base64,")[1];
				resolve(base64)
			}
			img.src = url + '?v=' + Math.random()
		})
	},
	getAvatarBase64(url) {
		return new Promise((resolve, reject) => {
			var img = new Image()
			img.setAttribute('crossOrigin', 'Anonymous')
			img.onload = function () {
				var canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				var ctx = canvas.getContext("2d");
				img.setAttribute("crossOrigin", 'Anonymous')
				ctx.drawImage(img, 0, 0, img.width, img.height);
				var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
				var base64 = canvas.toDataURL("image/" + ext);
				resolve(base64)
			}
			img.src = url + '?v=' + Math.random()
		})
	},
	randomNumBoth: (min, max) => {
		var range = max - min;
		var rand = Math.random();
		var num = min + Math.round(rand * range);
		return num;
	},
	getFileSize(val) {
		console.log("val", val);
		if (!val) return "";
		if (val < 102.4) {
			return val + " B";
		}
		let num = val / 1024;
		if (num > 1024) {
			num = num / 1024;
			return num.toFixed(2) + " M";
		} else {
			return num.toFixed(2) + " K";
		}
	},

	generateUUID() {
		if (typeof crypto === "object") {
			if (typeof crypto.randomUUID === "function") {
				return crypto.randomUUID();
			}
			if (typeof crypto.getRandomValues === "function" && typeof Uint8Array === "function") {
				const callback = (c) => {
					const num = Number(c);
					return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16);
				};
				return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, callback);
			}
		}
		let timestamp = new Date().getTime();
		let performanceNow = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0;
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
			let random = Math.random() * 16;
			if (timestamp > 0) {
				random = (timestamp + random) % 16 | 0;
				timestamp = Math.floor(timestamp / 16);
			} else {
				random = (performanceNow + random) % 16 | 0;
				performanceNow = Math.floor(performanceNow / 16);
			}
			return (c === "x" ? random : (random & 0x3) | 0x8).toString(16);
		});
	},
	getNumber(str) {
		return Number(str).toLocaleString()
	},
	getSaoAddress() {
		const address = local.GET('keplrAddress')
		if (address) {
			return true
		} else {
			return false
		}
	},
	formatDateTime(inputTime) {
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? "0" + m : m;
		var d = date.getDate();
		d = d < 10 ? "0" + d : d;
		var h = date.getHours();
		h = h < 10 ? "0" + h : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? "0" + minute : minute;
		second = second < 10 ? "0" + second : second;
		return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
	},
	ElMessage(type, msg) {

		const message = type == "success" ? t('utils.message') : msg
		ElMessage({
			dangerouslyUseHTMLString: true,
			customClass: 'successMessage',
			type: type,
			message: `<p style="color: #fff;">${message} </p>`,
		})
		UserState().SetKeplrBalanceNumber()

	},
	// arrayBufferToBase64(buffer:any) {
	// 	var binary = '';
	// 	var bytes = new Uint8Array(buffer);
	// 	var len = bytes.byteLength;
	// 	for (var i = 0; i < len; i++) {
	// 		binary += String.fromCharCode(bytes[i]);
	// 	}
	// 	return btoa(binary);
	// }
	formatTime(time) {
		if (('' + time).length === 10) {
			time = parseInt(time) * 1000
		} else {
			time = +time
		}
		const d = new Date(time)
		const now = Date.now()

		const diff = (now - d) / 1000
		let month = ''
		if(d.getMonth()==0){
			month=t('utils.January')
		}else if(d.getMonth()==1){
			month=t('utils.February')
			
		}else if(d.getMonth()==2){
			month=t('utils.March')
			
		}else if(d.getMonth()==3){
			month=t('utils.April')
			
		}else if(d.getMonth()==4){
			month=t('utils.May')
			
		}else if(d.getMonth()==5){
			month=t('utils.June')
			
		}else if(d.getMonth()==6){
			month=t('utils.July')
			
		}else if(d.getMonth()==7){
			month=t('utils.August')
			
		}else if(d.getMonth()==8){
			month=t('utils.September')
			
		}else if(d.getMonth()==9){
			month=t('utils.October')
			
		}else if(d.getMonth()==10){
			month=t('utils.November')
			
		}else{
			month=t('utils.December')
			
		}
		if(diff < 60){
			return t('utils.minago')
		}else if (diff < 3600) {
			// less 1 hour
			return Math.ceil(diff / 60) + t('utils.minsAgo')
		} else if (diff < 3600 * 24) {
			return Math.ceil(diff / 3600) + t('utils.hoursAgo')
		}else if(diff >= 3600 * 24 && diff < 3600 * 25){
			return t('utils.dayago')
		} 
		else if (diff < 3600 * 24 * 7) {
			return Math.ceil(diff / 3600 / 24) +  t('utils.daysAgo')
		} else {
			return (
				// console.log(d.getMonth())
			
				month+' ' +d.getDate()+', '+d.getFullYear()
				
			)
		}
	},
	 nFormatter(num, digits) {
		num = num*Math.pow(10, -6)
		return num.toFixed(2)
		// const si = [
		// 	{ value: 1, symbol: "" },
		// 	{ value: 1E3, symbol: "K" },
		// 	{ value: 1E6, symbol: "M" },
		// 	{ value: 1E9, symbol: "B" },
		// ];
		// const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
		// let i;
		// for (i = si.length - 1; i > 0; i--) {
		// 	if (num >= si[i].value) {
		// 		break;
		// 	}
		// }
		// return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
	}






}
