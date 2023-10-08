<template>
  <div class="square">
    <el-scrollbar height="100%">
      <div class="square-left">
        <notLogin></notLogin>
        <div class="content">
          <p>Notification</p>
          <div class="flx-center">
            <img src="@/assets/notification/notLogin.png" alt="" />
          </div>
        </div>
      </div>
    </el-scrollbar>

    <div class="square-right">
      <suggestions></suggestions>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
import suggestions from "@/components/suggestions.vue";
import notLogin from "@/components/notLogin/herder.vue"
import { reactive } from "vue";

</script>
  
  <style scoped lang="scss">
.square {
  width: 1040px;
  height: 100%;
  display: flex;

  .square-left {
    // height: 708px;
    margin-right: 20px;

   
    .content {
      height: 646px;

      width: 671px;
      background-color: #292929;
      border-radius: 10px;
      margin-top: 15px;
      box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
      p {
        height: 60px;
        width: 100%;
        line-height: 60px;
        padding-left: 30px;
        box-sizing: border-box;
        border-bottom: 1px solid #474747;
      }
      div {
        height: 646px;

        width: 671px;
      }
      img {
        width: 345px;
        height: 345px;
        mix-blend-mode: lighten;
      }
    }
  }

}
</style>