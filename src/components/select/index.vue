<template>
    <div class="content" id="select">
        <div class="select">
            <p>{{$t('selectIndex.Network')}}</p>
            <el-select v-model="NetworkVal" class="m-2" :suffix-icon="CaretBottom" popper-class="option" @change="onchange"
                :teleported="false">
                <template #prefix>
                    <img src="@/assets/images/BSCIcon.svg" alt="" class="icon"
                        style="width: 20px;height: 20px;margin-right: 10px;border-radius: 50%;">
                </template>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    <div style="display: flex;align-items: center;">
                        <img src="@/assets/images/BSCIcon.svg"
                            style="width: 20px;height: 20px;margin-right: 10px;border-radius: 50%;" alt="">
                        <span>{{ item.label }}</span>
                    </div>
                </el-option>
            </el-select>
        </div>
        <div class="select">
            <p>{{$t('selectIndex.Token')}}</p>
            <el-select v-model="TokenVal" class="m-2" :suffix-icon="CaretBottom" placeholder="" :teleported="false"
                @change="changeToken">
                <el-option v-for="item in children[numIndex]" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>

    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import CaretBottom from "@/components/select/icon.vue"
import { require } from '@/utils/require';


const myEmit = defineEmits(['changeSelect'])
const NetworkVal = ref('1')
const TokenVal = ref('0')
const numIndex = ref(0)
const options = [
    // {
    //     value: '0',
    //     label: 'Polygon',
    //     icon: require('@/assets/images/Polygon.svg'),
    // },
    {
        value: '1',
        label: 'BSC',
        icon: require('@/assets/images/BSCIcon.svg'),
    },


]
const children = [
    //     [{
    //     value: '0',
    //     label: 'Matic',
    // }, {
    //     value: '1',
    //     label: 'USDT',
    // }], 
    [{
        value: '0',
        label: 'BNB',
    },
        //  {
        //     value: '1',
        //     label: 'USDT',
        // }
    ]]


const onchange = (val: number) => {
    numIndex.value = val
    TokenVal.value = children[val][0].value
    myEmit('changeSelect', { Network: NetworkVal.value })
}
const changeToken = (val: number) => {
    myEmit('changeSelect', { Network: NetworkVal.value, Token: TokenVal.value })
}
</script>
<style  scoped lang="scss">
#select {
    :deep(.el-popper) {
        background-color: #292929;
        border-color: #909791;
        border-radius: 10px;

        .el-select-dropdown__item.hover {
            background: rgba(0, 0, 0, 0.3);
            color: #fff;
        }

        .el-select-dropdown__list {
            margin: 0 !important;
        }

        li {
            height: 43px;
            display: flex;
            align-items: center;
            padding: 0 32px 0 10px;
        }

        li:nth-child(1) {
            border-bottom: 1px solid #909791;
        }

        .el-popper__arrow::before {
            content: none;
            display: none;
        }

        .selected {
            color: #fff;
            font-weight: 400;
            background-color: #161616;
        }

    }

    :deep(.el-scrollbar__wrap) {

        border-radius: 10px;
    }

    :deep(.el-input__wrapper) {
        height: 37px;
        width: 213px;
        box-sizing: border-box;
        background-color: #161616;
        border: 1px solid #474747;
        box-shadow: 0 0 0 !important;
        border-radius: 8px;

        .el-input__inner {
            color: #FFFFFF;
            font-size: 14px;
            line-height: 21px;
        }

    }

    :deep(.is-focus) {
        border-color: #909791;
        box-shadow: 0 0 0;
    }

    :deep(.el-select__caret.is-reverse) {
        transform-origin: center
    }

    :deep(.el-select__caret) {
        transform-origin: center
    }

}

.content {
    display: flex;
    align-items: center;

    .select {
        margin-right: 22px;

        >P {
            margin-bottom: 10px;
            color: #fff;
        }
    }
}
</style>