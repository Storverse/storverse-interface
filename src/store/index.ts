import { defineStore, createPinia } from "pinia";
// import { GlobalState, ThemeConfigProps, AssemblySizeType } from "./interface";
// import { DEFAULT_PRIMARY } from "@/config/config";
import piniaPersistConfig from "@/config/piniaPersist";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";


export const GlobalStore = defineStore({
	
	id: "GlobalState",
	
	state: () => ({
		
	}),
	getters: {},
	actions: {
		
	},
	persist: piniaPersistConfig("GlobalState")
});


const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
