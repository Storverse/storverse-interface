<template>
    <div class="reply">
        <div class="reply-head">
            <span> Replying to</span> <span class="reply-to" v-if="props.replayTo">@{{ decodeURIComponent(props.replayTo) }}
            </span>
        </div>
        <div class="reply-content">
            <el-input v-model="reply" maxlength="800" resize="none" type="textarea"
                :placeholder="$t('VerseDetails.Compose')" :disabled="!checkAddress" />
            <img class="emoji-btn" @click="exportEmoji" style="cursor: pointer;" src="@/assets/images/emoji.svg" alt=""
                v-if="checkAddress">
            <img class="emoji-btn" src="@/assets/images/emoji.svg" alt="" v-else>

            <el-button :loading="postStatus" class="post-btn" @click="postReply" color="#21c143" :disabled="!checkAddress">
                POST
            </el-button>
            <!-- <div class="post-btn" @click="postReply">
                POST
            </div> -->
        </div>
    </div>

    <EmojiPicker v-if="showEmoji" :options="{
        imgSrc: '/img/', native: true, locals: 'en', hasGroupIcons: true, hasSearch: false,
        hasGroupNames: false, stickyGroupNames: false, hasSkinTones: false,
        recentRecords: false,
    }" @select="selectEmoji" style="height: 300px;width: 550px;" />
</template>

<script setup lang="ts">
import { EmojiPicker } from 'vue3-twemoji-picker-final'
import { ref, inject, defineEmits } from 'vue'
import { ElLoading, ElMessage } from "element-plus";

import local from '@/utils/local';
import utils from '@/utils/utils';
import { useRoute } from 'vue-router';
import { VerseComment, saveVerseComment } from '@/libs/verseComment';
import { UserState } from '@/store/modules/users';
import { formatDistanceToNow } from 'date-fns';
import i18n from '@/lang/index'

const t = i18n.global.t
const checkAddress = utils.getSaoAddress()
console.log(checkAddress);
const route = useRoute()
const { verseId, userDataId } = JSON.parse(JSON.stringify(route.query))
const userInfo = UserState().getUserInfo;
interface ReplayInfo {
    replayTo: string
}
const reply = ref('')
const showEmoji = ref(false)
const props = defineProps<ReplayInfo>()
console.log(props.replayTo);

const selectEmoji = (e: any) => {
    reply.value = reply.value + e.i
    console.log(e, 'e')

}
const exportEmoji = () => {
    showEmoji.value = !showEmoji.value
}

interface Comment {
    commentId: string;
    avatar: string;
    userName: string;
    desc: string;
    uploadTime: string;
    comment: string;
    owner: string;
    likeCount: number;
    hasLiked: boolean;
    Pcomment: string;
    Pavatar: string;
    PuserName: string;
    showReply: boolean;
}

const emits = defineEmits(['reply-posted']);
const postStatus = ref(false)
const postReply = async () => {
    postStatus.value =true
    if (reply.value.trim()) {
        try {
            const newComment: VerseComment = {
                createdAt: Date.now(),
                updatedAt: Date.now(),
                comment: encodeURIComponent(reply.value),
                parent: null,
                verseId: verseId,
                owner: userInfo.id,
            };

            const savedComment = await saveVerseComment(newComment);

            // Update the commentList with the new comment
            const commentItem: Comment = {
                avatar: userInfo.DownAvatar,
                userName: userInfo.username,
                desc: userInfo.bio,
                uploadTime: newComment.createdAt,
                comment: reply.value,
                // comment: newComment.comment,
                owner: userInfo.id,
                Pcomment: '',
                Pavatar: '',
                PuserName: '',
                showReply: false,
                likeCount: 0
            };

            emits('reply-posted', commentItem);
            reply.value = ''
            postStatus.value =false
        } catch (error) {
            console.error(error);
            postStatus.value =false
        }
    } else {
        reply.value = ''
        postStatus.value =false

        ElMessage({
            customClass: 'successMessage',
            type: 'error',
            message: t('VerseDetails.commentTip'),
        })
        return

    }

};
</script>

<style scoped lang="scss">
.reply {
    width: 100%;
    padding: 20px 30px 30px;
    box-sizing: border-box;
    // border-bottom: 1px solid #474747;
    overflow-x: hidden;

    ::v-deep(.el-input__inner) {
        color: #fff;
    }

    .reply-head {
        display: flex;
        align-items: center;

        .reply-to {
            color: #21C143;
            display: inline-block;
            max-width: 200px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }

    .reply-content {
        position: relative;
        width: 100%;
        height: 195px;
        background: #191919;
        border: 1px solid #474747;
        border-radius: 10px;
        margin-top: 12px;
        box-sizing: border-box;
        padding: 16px;

        ::v-deep(.el-textarea__inner) {
            min-height: 116px !important;
            max-height: 116px;
            background-color: #191919;
            box-shadow: none;
            color: #fff;
        }

        .post-btn {
            position: absolute;
            right: 16px;
            bottom: 18px;
            width: 100px;
            height: 36px;
            text-align: center;
            line-height: 36px;
            background: #21C143;
            border-radius: 80px;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
        }

        .emoji-btn {
            position: absolute;
            left: 16px;
            bottom: 18px;
        }
    }
}</style>