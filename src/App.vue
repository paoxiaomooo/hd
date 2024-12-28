<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
/* 可以在这里设置全局样式 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<!-- <template>
  <div id="app">
    <MyProducts />
  </div>
</template>

<script>
import MyProducts from './pages/MyProductPage.vue';

export default {
  name: 'App',
  components: {
    MyProducts,
  },
};
</script> -->
