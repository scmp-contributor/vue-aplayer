<template>
  <div class="aplayer-controller">
    <div class="aplayer-time">
      <div class="aplayer-time-inner">
        <span v-show="haveDuration" class="aplayer-ptime">{{secondToTime(stat.playedTime)}}</span>
        <span v-show="!haveDuration" class="aplayer-ptime">00:00</span> 
      </div>
    </div>
    <v-progress
      :loadProgress="loadProgress"
      :playProgress="playProgress"
      :theme="theme"
      @dragbegin="val => $emit('dragbegin', val)"
      @dragend="val => $emit('dragend', val)"
      @dragging="val => $emit('dragging', val)"
    />
    <div class="aplayer-time">
      <div class="aplayer-time-inner">
        <span v-show="haveDuration" class="aplayer-dtime">{{duration}}</span>
        <span v-show="!haveDuration" class="aplayer-dtime">00:00</span> 
      </div>
      <volume
        v-if="!$parent.isMobile"
        :volume="volume"
        :theme="theme"
        :muted="muted"
        @togglemute="$emit('togglemute')"
        @setvolume="v => $emit('setvolume', v)"
      />
      <icon-button
        class="aplayer-icon-menu"
        icon="menu"
        :class="{ 'inactive': !$parent.showList }"
        @click.native="$emit('togglelist')"
      />
    </div>
  </div>
</template>

<script>
  import IconButton from './aplayer-iconbutton.vue'
  import VProgress from './aplayer-controller-progress.vue'
  import Volume from './aplayer-controller-volume.vue'

  export default {
    components: {
      IconButton,
      VProgress,
      Volume,
    },
    props: ['shuffle', 'repeat', 'stat', 'theme', 'volume', 'muted', "duration"],
    computed: {
      durationSec () {
        let duration = this.duration.split(":")
        return parseInt(duration[0]) * 60 + parseInt(duration[1])
      },
      haveDuration () {
        return this.duration !== "00:00"
      },
      loadProgress () {
        if (this.stat.duration === 0) return 0
        if (this.stat.loadedTime >= this.durationSec) {
          return 1
        }
        return this.stat.loadedTime / this.durationSec
      },
      playProgress () {
        if (this.stat.duration === 0) return 0
        if (this.stat.playedTime >= this.durationSec && this.haveDuration) {
          return 1
        }
        return this.stat.playedTime / this.durationSec
      },
    },
    methods: {
      secondToTime (second) {
        if (isNaN(second)) {
          return '00:00'
        }
        const pad0 = (num) => {
          return num < 10 ? '0' + num : '' + num
        }

        const min = Math.trunc(second / 60)
        const sec = Math.trunc(second - min * 60)
        const hours = Math.trunc(min / 60)
        const minAdjust = Math.trunc((second / 60) - (60 * Math.trunc((second / 60) / 60)))
        return second >= 3600 ? pad0(hours) + ':' + pad0(minAdjust) + ':' + pad0(sec) : pad0(min) + ':' + pad0(sec)
      },
    },
  }
</script>

<style lang="scss">

  .aplayer-controller {
    display: flex;
    align-items: center;
    position: relative;

    .aplayer-time {
      display: flex;
      align-items: center;
      position: relative;
      height: 17px;
      color: #1C2129;
      font-size: 16px;
      padding-right: 4px;
      padding-left: 7px;

      .aplayer-icon {
        width: 19px;
        height: 19px;
        cursor: pointer;
        transition: all 0.2s ease;
        padding-bottom: 1px;

        &.inactive {
          opacity: .3;
        }

        .aplayer-fill {
          fill: #000;
        }

        &:hover {
          .aplayer-fill {
            fill: #000;
          }
        }

        &.aplayer-icon-menu {
          display: none;
        }
      }
      .aplayer-volume-wrap + .aplayer-icon {
        margin-left: 0;
      }

      &.aplayer-time-narrow {
        .aplayer-icon-mode {
          display: none;
        }

        .aplayer-icon-menu {
          display: none;
        }
      }
    }
  }

  .black-theme {
    .aplayer-time {
      color: #fff;
    }  
    .aplayer-controller {
      .aplayer-icon {
        .aplayer-fill {
          fill: #fff;
        }
      }
    }
  }
</style>