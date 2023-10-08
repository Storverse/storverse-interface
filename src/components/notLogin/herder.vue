<template>
  <div id="box">
    <div class="header" @click="onDialog">
      <p>
        {{$t('notLogin.fullTips')}},
        <span> {{$t('notLogin.Connectwallet')}}</span><img src="@/assets/notification/iconRight.svg" alt="" />
      </p>
    </div>
    <Dialog></Dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { LoginState } from "@/store/modules/login"
const loginState = LoginState();

import Dialog from "../dialog/dialogLogin.vue";
let dialogVisible = ref(false);
let type = ref(0)

const onDialog = () => {
  loginState.dialogVisible = !loginState.dialogVisible;
};
</script>
<style scoped lang="scss">
.header {
  height: 102px;
  border: 1px solid #56e868;
  border-radius: 10px;
  background: url("@/assets/notification/notloginHeader.png");
  background-size: cover;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: end;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;

  p {
    width: 303px;
    line-height: 27px;
    margin-right: 54px;
    cursor: pointer;

    span {
      color: #56e868;
    }

    img {
      width: 15px;
      height: 12px;
      margin-left: 5px;
    }
  }
}
</style>