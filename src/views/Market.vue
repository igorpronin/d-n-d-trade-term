<template>
  <div class="market-page">
    <h1>Market</h1>
    <Market />
  </div>
</template>
<script>
import Market from '@/components/Market/Market.vue';

export default {
  components: {
    Market,
  },
};
</script>

<style scoped lang="scss">
.market-page {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
