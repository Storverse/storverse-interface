<template>
     <router-view></router-view>
     <Dialog :type="1"></Dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import Dialog from "@/components/dialog/dialogLogin.vue";


import local from './utils/local';
import { UserState } from "@/store/modules/users";
import { LoginState } from "@/store/modules/login";
import { useRouter, useRoute } from "vue-router";
const $router = useRouter();
const $store = UserState()

onMounted(async () => {
     // window.addEventListener('beforeunload', (e) => beforeunloadHandler(e))

     // window.addEventListener('unload', (e) => unloadHandler())

     window.addEventListener("keplr_keystorechange", () => {
          $router.push("/");
          // $router.go(0);
          setTimeout(() => {
               $store.removeLogin();
               $store.removeLogin();
          $router.go(0);

          }, 200)
     });
  
     
})
// const beforeunloadHandler = () => {
//      local.REMOVE('keplrAddress')
//      local.REMOVE('sid')
//      local.REMOVE('KeplrUser')
//      local.REMOVE('modelManager')
//      local.REMOVE('provider')
// }
const beforeUnloadTime = ref()
const beforeunloadHandler = (event) => {
     console.log('this.beforeUnloadTime', beforeUnloadTime.value);

     beforeUnloadTime.value = new Date().getTime();
     //    console.log('this.beforeUnloadTime', beforeUnloadTime.value);
     //    event = event || window.event;
     //    console.log(event);
     //    if (event) {

     //    }

}
// const unloadHandler = () => {
//      console.log('this.beforeUnloadTime--', beforeUnloadTime.value);
//      console.log(new Date().getTime() - beforeUnloadTime.value);
//      let time = new Date().getTime() - beforeUnloadTime.value;
//      if (time <= 5) {
//           localStorage.setItem('close', 1); // close
//           local.CLEAR()
//      } else {
//           localStorage.setItem('Refresh', 2); // refresh
//      }
// }
// onBeforeUnmount(() => {
//      window.removeEventListener('beforeunload', (e) => beforeunloadHandler(e));
//      window.removeEventListener('unload', () => unloadHandler());
// })
</script>
<style>
#app {
     font-family: "inter_Regular";
}

.successMessage {
     background-color: #161616 !important;
     border: 1px solid #21C143 !important;
     border-radius: 10px !important;
     padding: 17px 40px !important;
     color: #fff !important;

}

.el-message__content {
     color: #fff !important;
}
</style>
<style lang="scss">
.example-showcase .el-loading-mask {
     z-index: 9;
}
</style>