<template>
    <div class="home_container unselectable">
        
        <!-- 页头 -->
        <pageTop></pageTop>
        <!-- 页头 -->

        <!-- 页面内容 -->
        <pageContainer></pageContainer>
        <!-- 页面内容 -->

    </div>
</template>

<script setup>
import pageTop from '../../components/pageTop.vue';
import pageContainer from '../../components/pageContainer.vue'




</script>
<style lang="less" scoped>
    .home_container{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>