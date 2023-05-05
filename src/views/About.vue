<template>
    <h2>About</h2>
    <button @click="add">改变</button>
    <div>{{ a }}</div>
</template>

<script setup>
// import {  } from 'vue-router'
import { ref } from 'vue'
let a=ref(3)
const add=()=>{
    console.log(a.value);
    a.value=77
}

</script>
<style lang='less' scoped>

</style>