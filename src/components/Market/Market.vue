<template>
  <div class="market">
    <div class="modules-switch">
      <div
        class="module-switch"
        v-for="(item, name, i) in modules"
        :key="i"
        @click="handleSwitch(item)"
        :class="{'active': modules[name].isActive}"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="reset-settings">
      <span
        class="reset-settings-button"
        @click="resetSettings"
      >
        Reset settings
      </span>
    </div>
    <div
      class="layout"
      ref="layout"
    >
      <Module
        v-for="(item, name) in modules"
        :key="name"
        v-show="modules[name].isActive"
        class="module"
        :style="{ zIndex: modules[name].zIndex }"
        :moduleName="name"
        :width="modules[name].width"
        :minWidth="100"
        :height="modules[name].height"
        :minHeight="100"
        :left="modules[name].left"
        :top="modules[name].top"
        :active="['r','rb','b']"
        :dragSelector="`#${name}`"
        @drag:end="handleDragEnd"
        @resize:end="handleResizeEnd"
        @click="handleClick"
      >
        <div :id="name" class="module-header">
          <span>{{ item.name }}</span>
          <span
            class="module-close"
            @click="handleClose(item)"
          >
            X
          </span>
        </div>
      </Module>
    </div>
  </div>
</template>

<script>
import Module from '@/components/Market/MarketModule.vue';

export default {
  components: {
    Module,
  },
  data() {
    return {
      modules: {
        moduleOne: {
          name: 'BTC/ETH',
          isActive: true,
          zIndex: 1,
          left: 10,
          top: 10,
          width: 300,
          height: 100,
        },
        moduleTwo: {
          name: 'ETH/USDT',
          isActive: true,
          zIndex: 2,
          left: 30,
          top: 30,
          width: 300,
          height: 100,
        },
        moduleThree: {
          name: 'BTC/USDT',
          isActive: true,
          zIndex: 3,
          left: 50,
          top: 50,
          width: 300,
          height: 100,
        },
        moduleFour: {
          name: 'LTC/USDT',
          isActive: true,
          zIndex: 4,
          left: 70,
          top: 70,
          width: 300,
          height: 100,
        },
        moduleFive: {
          name: 'XRP/USDT',
          isActive: true,
          zIndex: 5,
          left: 90,
          top: 90,
          width: 300,
          height: 100,
        },
      },
    };
  },
  methods: {
    /* eslint-disable no-param-reassign */
    async handleDragEnd(ev) {
      if (ev.el.offsetTop % 10 !== 0) {
        const tmp = Math.round(ev.el.offsetTop / 10);
        // ev.el.style.top = `${tmp * 10}px`;
        await this.$nextTick();
        this.modules[ev.moduleName].top = tmp * 10;
      }
      if (ev.el.offsetLeft % 10 !== 0) {
        const tmp = Math.round(ev.el.offsetLeft / 10);
        // ev.el.style.left = `${tmp * 10}px`;
        await this.$nextTick();
        this.modules[ev.moduleName].left = tmp * 10;
      }
      if (ev.top < 0) {
        console.log('wrong top');
        await this.$nextTick();
        // ev.el.style.top = 0;
        this.modules[ev.moduleName].top = 0;
      }
      if (ev.left < 0) {
        console.log('wrong left');
        await this.$nextTick();
        // ev.el.style.left = 0;
        this.modules[ev.moduleName].left = 0;
      }
      this.saveSettings();
    },
    /* eslint-disable no-param-reassign */
    async handleResizeEnd(ev) {
      console.log('handleResizeEnd');
      if (ev.el.offsetWidth % 10 !== 0) {
        const tmp = Math.round(ev.el.offsetWidth / 10);
        // ev.el.style.width = `${tmp * 10}px`;
        this.modules[ev.moduleName].width = tmp * 10;
      }
      console.log(ev.el.offsetHeight);
      if (ev.el.offsetHeight % 10 !== 0) {
        const tmp = Math.round(ev.el.offsetHeight / 10);
        // ev.el.style.height = `${tmp * 10}px`;
        this.modules[ev.moduleName].height = tmp * 10;
      }
      this.saveSettings();
    },
    /* eslint-disable */
    async handleClick(ev) {
      await this.$nextTick();
      this.setOrder(ev.moduleName);
      this.saveSettings();
    },
    handleResizeBrowser() {
      this.setLayoutWidth();
    },
    handleClose(module) {
      module.isActive = false;
      this.saveSettings();
    },
    handleSwitch(module) {
      module.isActive = !module.isActive;
      if (module.isActive) {
        module.width = 300;
        module.height = 100;
        module.top = (this.$refs.layout.offsetHeight / 2) - 50;
        module.left = (this.$refs.layout.offsetWidth / 2) - 150;
      }
      this.saveSettings();
    },
    setLayoutWidth() {
      const tmp = Math.floor(window.innerWidth / 10);
      this.$refs.layout.style.width = `${(10 * tmp) + 2}px`;
    },
    setOrder(moduleName) {
      const modulesLength = Object.keys(this.modules).length;
      if (this.modules[moduleName].zIndex === modulesLength) return;
      for (name in this.modules) {
        const module = this.modules[name];
        if (moduleName === name) {
          module.zIndex = modulesLength;
        } else {
          module.zIndex--;
        }
      }
    },
    saveSettings() {
      window.localStorage.setItem('marketSettings', JSON.stringify(this.modules));
    },
    loadSettings() {
      const settings = window.localStorage.getItem('marketSettings');
      if (settings) {
        this.modules = JSON.parse(settings);
      }
    },
    resetSettings() {
      delete window.localStorage['marketSettings'];
      location.reload();
    },
  },
  created() {
    this.loadSettings();
  },
  mounted() {
    this.setLayoutWidth();
    window.addEventListener('resize', this.handleResizeBrowser);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResizeBrowser);
  },
};
</script>

<style scoped lang="scss">
.market {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.modules-switch {
  display: flex;
  margin-bottom: 4px;
  justify-content: center;
}
.module-switch {
  height: 22px;
  background-color: coral;
  border: 1px solid gray;
  text-align: center;
  margin: 0 2px;
  padding: 0 2px;
  cursor: pointer;
  &.active {
    background-color: lightgreen;
  }
}
.reset-settings {
  margin-bottom: 4px;
}
.reset-settings-button {
  height: 22px;
  background-color: coral;
  border: 1px solid gray;
  padding: 0 2px;
  cursor: pointer;
}
.layout {
  border: 1px solid lightgray;
  flex-grow: 1;
  margin: 0 auto 4px;
  position: relative;
  //overflow: hidden;
}
.layout-size {
  position: absolute;
  right: 4px;
  top: -20px;
}
.module {
  border: 1px solid black;
  background-color: #fff;
  overflow: hidden;
  position: absolute;
}
.module-header {
  background-color: lightgray;
  position: relative;
}
.module-close {
  position: absolute;
  width: 15px;
  height: 15px;
  cursor: pointer;
  right: 2px;
  top: 0;
}
</style>
