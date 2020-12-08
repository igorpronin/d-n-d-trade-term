<template>
  <div class="blockchain-page">
    <h1>Blockchain explorer</h1>
    <BlockchainExplorer />
  </div>
</template>

<script>
import BlockchainExplorer from '@/components/BlockchainExplorer/BlockchainExplorer.vue';

export default {
  components: {
    BlockchainExplorer,
  },
};
</script>

<style scoped lang="scss">
.blockchain-page {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
