<template>
    <div class="comment" v-for="(item, index) in props.commentList" :key="index">
        <div class="comment-head flx-justify-between">
            <div class="user-info flx-justify-between" @click="gotoProfile(item)" style="cursor: pointer;">
                <el-avatar style="border: 1px solid rgba(71, 71, 71, 1);" :size="40" :src="item.avatar" v-if="item.avatar" />
                <img style="width: 40px; height: 40px" v-else src="@/assets/images/avatar.png" alt="" />

                <div class="flx-c-star infos">
                    <div>
                        <span class="username sle">{{ decodeURIComponent(item.userName) }}</span>
                        <span class="userDesc sle">
                            @{{
                                item.owner.substring(0, 13)
                            }}</span>
                    </div>
                    <div class="verse-time">{{ utils.formatTime(item.uploadTime) }}</div>
                </div>
            </div>
            <div class="flx-justify-between comment-right">
                <div class="unFollow-status flx-align-center">
                    <img style="cursor: pointer" v-if="item.hasLiked" src="@/assets/images/liked.svg" alt=""
                        @click="likeComment(false, item.commentId)" />
                    <img style="cursor: pointer" v-else src="@/assets/images/like.svg" alt=""
                        @click="likeComment(true, item.commentId)" />
                    <span class="comment-number">{{ item.likeCount }}</span>
                </div>

                <img class="mote" src="@/assets/images/comment.svg" alt="" @click="showThisReply(item)" />
                <img @click="deleteComment(index)" v-if="item.owner == userInfo.id" class="delete-btn"
                    src="@/assets/images/delete-comment.svg" alt="" />
            </div>
        </div>
        <div class="comment-content">
            <span @click="gotoPprofile(item)" v-if="item.Pcomment !== ''" style="
          color: #56e868;
          margin-right: 5px;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
          cursor: pointer;
        ">
                @{{ decodeURIComponent(item.PuserName) }}
            </span>
            <span>
                {{ item.comment }}
            </span>
        </div>
        <div class="comment-old" v-if="item.Pcomment !== ''">
            <div class="old-avatar" style="cursor: pointer;" @click="gotoPprofile(item)">
                <el-avatar style="border: 1px solid rgba(71, 71, 71, 1);" :size="40" :src="item.Pavatar" v-if="item.Pavatar" />
                <img style="width: 40px; height: 40px" v-else src="@/assets/images/avatar.png" alt="" />
            </div>
            <div class="comment-pcomment">
                <span class="pcomment-name">{{ decodeURIComponent(item.PuserName) }}</span>
                <span>{{ item.Pcomment }}</span>
            </div>
        </div>
        <div v-if="item.showReply && checkAddress">
            <div class="reply">
                <div class="reply-head">
                    <span> {{ $t('VerseDetails.Replyingto') }}</span>
                    <span class="reply-to">@{{ decodeURIComponent(item.replyTo) }} </span>
                </div>
                <div class="reply-content">
                    <el-input v-model="reply" resize="none" type="textarea" :placeholder="$t('VerseDetails.Compose')" />
                    <img @click="exportEmoji" style="cursor: pointer" src="@/assets/images/emoji.svg" alt="" />

                    <el-button :loading="postStatus" class="post-btn" @click.prevent="postReply(item)" color="#21c143" >
                POST
            </el-button>
                    <!-- <div class="post-btn" @click.prevent="postReply(item)">{{ $t('postVerse.POST') }}</div> -->
                </div>
            </div>

            <EmojiPicker v-if="showEmoji" :options="{
                imgSrc: '/img/',
                native: true,
                locals: 'en',
                hasGroupIcons: true,
                hasSearch: false,
                hasGroupNames: false,
                stickyGroupNames: false,
                hasSkinTones: false,
                recentRecords: false,
            }" @select="selectEmoji" style="height: 300px; width: 550px" />
        </div>
    </div>
    <dialogText :Visible="deleteVisible" :data="deleteText" @handleClose="handleDelete"></dialogText>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, defineEmits } from 'vue';
import { EmojiPicker } from 'vue3-twemoji-picker-final'
import utils from '@/utils/utils';
import { getVerseCommentsByVerseId, saveVerseComment, VerseComment, saveVerseCommentLike, deleteVerseCommentLike, deleteVerseComment } from '@/libs/verseComment'
import { downloadFileOfOthers } from "@/libs/file"
import { formatDistanceToNow } from 'date-fns';
import { useRoute, useRouter } from 'vue-router';
import { UserState } from '@/store/modules/users';
import dialogText from '@/components/dialog/dialogText.vue';
import { ElLoading, ElMessage } from "element-plus";
import i18n from '@/lang/index'

const t = i18n.global.t
const checkAddress = utils.getSaoAddress()
const router = useRouter()

console.log(checkAddress);
const route = useRoute()
const { verseId, userDataId } = JSON.parse(JSON.stringify(route.query))
const userInfo = UserState().getUserInfo;

interface ReplayInfo {
    replayTo: string
    commentList: Comment[]
}

const reply = ref('')
const showEmoji = ref(false)
const props = defineProps<ReplayInfo>()
console.log(props.replayTo);


const parentId = ref<string | null>(null);
const parentComment = ref<Comment>();

let avatarCache: { [key: string]: string } = {};

const downLoadAvatar = async (ownerAvatar: any) => {
    if (avatarCache[ownerAvatar]) {
        return avatarCache[ownerAvatar];
    }
    const res = await downloadFileOfOthers(ownerAvatar, userInfo.id, true);
    console.log('head-avatar', res);
    const avatarData = 'data:image/png;base64,' + res;
    avatarCache[ownerAvatar] = avatarData;
    return avatarData;
};


const selectEmoji = (e: any) => {
    reply.value = reply.value + e.i
    console.log(e, 'e')

}
const exportEmoji = () => {
    showEmoji.value = !showEmoji.value
}
const emits = defineEmits(['reply-posted']);
const postStatus = ref(false)
const postReply = async (item: any) => {
    postStatus.value =true
    if (reply.value.trim()) {

        try {
            console.log(props.replayTo);
            const newComment: VerseComment = {
                createdAt: Date.now(),
                updatedAt: Date.now(),
                comment: encodeURIComponent(reply.value),
                parentId: parentId.value,
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
                Pcomment: parentComment.value?.comment || '',
                Pavatar: parentComment.value?.avatar || '',
                PuserName: parentComment.value?.userName || '',
                showReply: false,
                owner: userInfo.id,
                likeCount: 0
            };

            // props.commentList.unshift(commentItem);
            emits('reply-posted', commentItem);
            showThisReply(item)
            reply.value = ''
            postStatus.value =false
            // emits('reply-posted', commentItem);
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

    }

};
const replyTo = ref('')
const showThisReply = (item: any) => {
    console.log(item);
    item.replyTo = item.userName

    props.commentList.forEach(item1 => {
        if (item1.commentId != item.commentId) {
            item1.showReply = false
        }

    })
    item.showReply = !item.showReply

    parentId.value = item.commentId;
    parentComment.value = item;
}
const likeCommentStatus = ref(true)
const likeComment = (val: boolean, commentId: string) => {
    if(likeCommentStatus.value == true){
        likeCommentStatus.value = false
    let commentLike = {
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        commentId: commentId,
        status: 1,
        owner: userInfo.id
    }

    // Find the comment in commentList.
    const comment = props.commentList.find((item) => item.commentId === commentId);
    if (comment) {
        
        if (val) {
            saveVerseCommentLike(commentLike, userInfo.did).then(res => {
                // Increase the like count and set the like status.
                comment.likeCount++;
                comment.hasLiked = true;
                console.log(res);
                likeCommentStatus.value = true
            });
        } else {
            deleteVerseCommentLike(commentId, userInfo.did).then(res => {
                // Decrease the like count and set the like status.
                if (comment.likeCount > 0) {
                    comment.likeCount--;
                }
                comment.hasLiked = false;
                console.log(res);
                likeCommentStatus.value = true
            }).catch(res => {
                console.log(res);
            });
        }
    }
}else{
    likeCommentStatus.value = false
    return
}

}
const deleteVisible = ref(false)
const deleteText = ref('')
const deleteIndex = ref()

const deleteComment = (index: number) => {
    console.log(index);
    deleteIndex.value = index
    deleteVisible.value = true
    deleteText.value = props.commentList[index].comment
}

const handleDelete = () => {
    deleteVisible.value = false

    deleteVerseComment(props.commentList[deleteIndex.value].commentId).then(res => {
        props.commentList.splice(deleteIndex.value, 1)

    })
}
interface Comment {
    commentId: string;
    avatar: string;
    userName: string;
    desc: string;
    uploadTime: string;
    comment: string;
    likeCount: number;
    hasLiked: boolean;
    Pcomment: string;
    Pavatar: string;
    PuserName: string;
    showReply: boolean;
    owner: string
}

onMounted(async () => {
    // try {
    //     const comments = await getVerseCommentsByVerseId(verseId, userInfo.id);

    //     // Start loading avatars for comments and their parents
    //     const avatarPromises = comments.flatMap(comment => [
    //         downLoadAvatar(comment.ownerAvatar),
    //         comment.parent ? downLoadAvatar(comment.parent.ownerAvatar) : Promise.resolve('')
    //     ]);
    //     const avatars = await Promise.all(avatarPromises);

    //     // Map the data in the format you need for your commentList
    //     commentList.value = comments.map((comment, i) => {
    //         let Pcomment = '';
    //         let Pavatar = '';
    //         let PuserName = '';

    //         // Check if parent comment exists
    //         if (comment.parent) {
    //             Pcomment = comment.parent.comment;
    //             Pavatar = avatars[i * 2 + 1];
    //             PuserName = comment.parent.ownerUsername;
    //         }

    //         return {
    //             commentId: comment.id,
    //             avatar: avatars[i * 2],
    //             userName: comment.ownerUsername,
    //             desc: comment.ownerBio,
    //             uploadTime: formatDistanceToNow(comment.createdAt) + ' ago',
    //             comment: decodeURIComponent(comment.comment),
    //             likeCount: comment.likeCount,
    //             hasLiked: comment.hasLiked,
    //             Pcomment: Pcomment,
    //             Pavatar: Pavatar,
    //             PuserName: PuserName,
    //             showReply: false
    //         };
    //     });
    // } catch (error) {
    //     console.error(error);
    // }
});
const gotoProfile = (val: any) => {
    console.log(val);

    if (val.owner !== userInfo.id) {
        router.push({
            name: 'Verse-UserProfile',
            query: {
                key: val.owner,
            },
        })
    } else {
        router.push({
            name: 'Verse-Profile',
        })
    }
}
const gotoPprofile = (val: any) => {
    if (val.Powner !== userInfo.id) {
        router.push({
            name: 'Verse-UserProfile',
            query: {
                key: val.Powner,
            },
        })
    } else {
        router.push({
            name: 'Verse-Profile',
        })
    }
}
</script>

<style scoped lang="scss">
.comment {
    width: 100%;
    padding: 20px 30px 30px;
    box-sizing: border-box;
    border-top: 1px solid #474747;
    overflow-x: hidden;

    .comment-head {
        .infos {
            margin-left: 10px;

            .username {
                font-weight: 700;
                font-size: 16px;
                display: inline-block;
                max-width: 150px;
            }

            .userDesc {
                font-weight: 400;
                font-size: 14px;
                margin-left: 16px;
                display: inline-block;
                max-width: 100px;
            }

            .verse-time {
                font-weight: 400;
                font-size: 14px;
                color: #909791;
            }
        }

        .mote {
            cursor: pointer;
            margin-left: 40px;
        }

        .delete-btn {
            cursor: pointer;
            margin-left: 40px;
        }

        .comment-right {
            // width: 110px;
            box-sizing: border-box;

            .comment-number {
                margin-left: 20px;
            }
        }
    }

    .comment-content {
        margin-top: 10px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        word-break: break-word;
    }

    .comment-old {
        width: 610px;
        display: flex;
        align-items: flex-start;
        padding: 14px 20px 12px 20px;
        box-sizing: border-box;
        background: #191919;
        border-radius: 10px;
        margin-top: 10px;

        .comment-pcomment {
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            color: #909791;
            font-weight: 400;
            font-size: 16px;
            word-break: break-word;

            .pcomment-name {
                font-size: 12px;
                padding-bottom: 5px;
                max-width: 200px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }
}

.reply {
    padding: 20px 0;
    box-sizing: border-box;

    .reply-head {
        display: flex;
        align-items: center;

        .reply-to {
            max-width: 200px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #21c143;
        }
    }

    .reply-content {
        position: relative;
        width: 100%;
        height: 168px;
        background: #191919;
        border: 1px solid #474747;
        border-radius: 10px;
        margin-top: 12px;
        box-sizing: border-box;
        padding: 16px;

        ::v-deep(.el-input__inner) {
            color: #fff;
        }

        ::v-deep(.el-textarea__inner) {
            min-height: 116px !important;
            max-height: 116px;
            background-color: #191919;
            box-shadow: none;
            color: #fff;

        }

        .post-btn {
            position: absolute;
            cursor: pointer;
            right: 16px;
            bottom: 18px;
            width: 100px;
            height: 36px;
            text-align: center;
            line-height: 36px;
            background: #21c143;
            border-radius: 80px;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
        }
    }
}
</style>
