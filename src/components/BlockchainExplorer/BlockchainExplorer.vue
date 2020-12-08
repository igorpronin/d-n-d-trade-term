<template>
  <div>
    <div class="manage-panel">
      <div
        class="manage-panel-button"
        @click="subscribe"
      >
        Run
      </div>
      <div
        class="manage-panel-button red"
        @click="unsubscribe"
      >
        Stop
      </div>
      <div
        @click="reset"
        class="manage-panel-button yellow"
      >
        Reset
      </div>
    </div>
    <div class="sum">
      Sum: {{ sum / 100000000 }} BTC
    </div>
    <table class="transactions">
      <tr
        v-for="(transaction, i) in transactions"
        :key="i"
      >
        <td>
          <div
            v-for="(item, i) in transaction.inputs"
            :key="item.prev_out.addr + i"
          >
            {{ item.prev_out.addr }}
          </div>
        </td>
        <td>
          <div
            v-for="(item, i) in transaction.out"
            :key="item.addr + i"
          >
            {{ item.addr }}
          </div>
        </td>
        <td>
          {{ transaction.outSum / 100000000 }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      socket: null,
      transactions: [],
      sum: 0,
    };
  },
  methods: {
    subscribe() {
      this.socket.send(JSON.stringify({ op: 'unconfirmed_sub' }));
    },
    unsubscribe() {
      this.socket.send(JSON.stringify({ op: 'unconfirmed_unsub' }));
    },
    reset() {
      this.transactions = [];
      this.sum = 0;
    },
    async handleReceiveTransactionData(data) {
      const transaction = {
        inputs: data.x.inputs,
        out: data.x.out,
        outSum: 0,
      };
      /* eslint-disable */
      transaction.out.map((item) => {
        transaction.outSum += item.value;
      });
      this.transactions.push(transaction);
      this.sum += transaction.outSum;
      // await this.$nextTick();
      // window.scrollBy(0,300);
    },
  },
  created() {
    this.socket = new WebSocket('wss://ws.blockchain.info/inv');
    this.socket.onopen = () => {
      // console.log('[open] Соединение установлено');
    };
    this.socket.onmessage = (event) => {
      // console.log(`[message] Данные получены с сервера: ${event.data}`);
      this.handleReceiveTransactionData(JSON.parse(event.data));
    };
  },
  destroyed() {
    this.socket.close();
  },
};
</script>

<style scoped lang="scss">
.manage-panel {
  display: flex;
  margin-bottom: 4px;
  justify-content: center;
}
.manage-panel-button {
  height: 22px;
  background-color: lightgreen;
  border: 1px solid gray;
  text-align: center;
  margin: 0 2px;
  padding: 0 2px;
  cursor: pointer;
  &.red {
    background-color: coral;
  }
  &.yellow {
    background-color: goldenrod;
  }
}
.sum {
  text-align: center;
}
.transactions {
  margin: auto;
}
table {
  border-collapse: collapse;
  td {
    border: 1px solid gray;
  }
}
</style>
