<template>
  <section class="container">
    <div v-if="$apollo.loading">Loading...</div>
    <div v-if="!$apollo.loading">
      {{ userResolver.name }}
    </div>
    <el-upload
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="avatar">
      <i
        v-else
        class="el-icon-plus avatar-uploader-icon"/>
    </el-upload>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
import getUserGql from '../apollo/gql/getUser.gql'

export default {
  components: {
    Logo
  },
  data() {
    return {
      userResolver: [],
      imageUrl: ''
    }
  },
  apollo: {
    userResolver: {
      query: getUserGql
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('Avatar picture must be JPG format!')
      }
      if (!isLt2M) {
        this.$message.error('Avatar picture size can not exceed 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
