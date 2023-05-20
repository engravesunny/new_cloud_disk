<template>
    <div class="status-wrapper unselectable">
        <img src="@/assets/img/404.png">
        <p>未找到</p>
        <router-link to="/">
            <el-button type="primary">
                回到首页
            </el-button>
        </router-link>
    </div>
</template>

<style lang="less" scoped>
.status-wrapper {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    img {
        margin-bottom: 10px;
    }

    .el-button {
        margin-top: 10px;
    }
}
</style>