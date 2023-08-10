<template>
    <h1 class="title">app</h1>
    <el-row class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
  </el-row>
  <div class="mb-2 flex items-center text-sm">
    <el-radio-group v-model="radio1" class="ml-4">
      <el-radio label="1" size="large">Option 1</el-radio>
      <el-radio label="2" size="large">Option 2</el-radio>
    </el-radio-group>
  </div>
    <router-link to="/home">home</router-link><br/>
    <router-link to="/about">about</router-link>
    <router-view></router-view>666
</template>

<script setup>
import {} from 'vue-router'
import { } from 'vue'
import { ref } from 'vue'

const radio1 = ref('1')

</script>
<style lang='less' scoped>
.title{
  color: rgb(204, 156, 25);
}

</style>