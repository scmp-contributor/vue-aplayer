<template>
  <div class="aplayer-volume-wrap">
    <icon-button
      :class="`aplayer-icon-${volumeIcon}`"
      :icon="volumeIcon"
      @click.native="$emit('togglemute')"
    />
    <div
      class="aplayer-volume-bar-wrap"
      @mousedown="onBarMouseDown"
    >
      <div class="aplayer-volume-bar" ref="bar">
        <div
          class="aplayer-volume"
          :style="{
            height: muted ? 0 : `${Math.trunc(volume * 100)}%`,
            background: theme
          }"
        >
        </div>
      </div>
      <div v-for="n in 9" class="aplayer-volume-white" :rel="n" :key="n">
      </div>
    </div>
  </div>
</template>

<script>
  import IconButton from './aplayer-iconbutton.vue'
  import {getElementViewTop} from '../utils'

  const barHeight = 70

  export default {
    components: {
      IconButton,
    },
    props: ['volume', 'muted', 'theme'],
    computed: {
      volumeIcon () {
        if (this.muted || this.volume <= 0) return 'volume-off'
        if (this.volume >=0.5 && this.volume < 1) return 'volume-middle'
        if (this.volume >= 1) return 'volume-up'
        return 'volume-down'
      },
    },
    methods: {
      adjustVolume (e) {
        let percentage = (barHeight - e.clientY + getElementViewTop(this.$refs.bar)) / barHeight
        percentage = percentage > 0 ? percentage : 0
        percentage = percentage < 1 ? percentage : 1
        this.$emit('setvolume', percentage)
      },
      onBarMouseDown () {
        document.addEventListener('mousemove', this.onDocumentMouseMove)
        document.addEventListener('mouseup', this.onDocumentMouseUp)
      },
      onDocumentMouseMove (e) {
        let percentage = (barHeight - e.clientY + getElementViewTop(this.$refs.bar)) / barHeight
        percentage = percentage > 0 ? percentage : 0
        percentage = percentage < 1 ? percentage : 1
        this.$emit('setvolume', percentage)
      },
      onDocumentMouseUp (e) {
        document.removeEventListener('mouseup', this.onDocumentMouseUp)
        document.removeEventListener('mousemove', this.onDocumentMouseMove)

        let percentage = (barHeight - e.clientY + getElementViewTop(this.$refs.bar)) / barHeight
        percentage = percentage > 0 ? percentage : 0
        percentage = percentage < 1 ? percentage : 1
        this.$emit('setvolume', percentage)
      }
    }
  }
</script>

<style lang="scss">

  .aplayer-volume-wrap {
    margin-left: 4px;
    flex: 1 0 34px;
    width: 34px;
    display: flex;
    justify-content: center;
    position: relative;
    cursor: pointer;
    z-index: 0;

    &:hover .aplayer-volume-bar-wrap {
      display: block;
    }

    .aplayer-volume-bar-wrap {
      display: none;
      position: absolute;
      bottom: 10px;
      left: -4px;
      right: -4px;
      height: 40px;
      z-index: -1;
      transition: all .2s ease;

      button {
        width: 24px;
        height: 24px;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -20px;
        left: 4px;
        right: 0;
        height: 126px;
        width: 34px;
        border-radius: 17px;
        background-color: #fff;
        box-shadow: 0 3px 5px 1px rgba(0, 0, 0, 0.14), 0 0 5px 0 rgba(0, 0, 0, 0.1);
      }

      .aplayer-volume-bar {
        position: absolute;
        bottom: 17px;
        left: 19px;
        width: 4px;
        height: 76px;
        background: #aaa;
        overflow: hidden;
        z-index: 1;

        .aplayer-volume {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          transition: height 0.1s ease, background-color .3s;
          will-change: height;
        }
      }
      @for $i from 1 through 9 {
        .aplayer-volume-white[rel="#{$i}"] {
          position: absolute;
          bottom: calc( 13px + (#{$i} * 8px ));
          left: 19px;
          width: 4px;
          height: 4px;
          background-color: #fff;
          z-index: 1;
        }
      }
    }
  }
  .dark-theme {
    .aplayer-volume-bar-wrap {

      &::after {
        background-color :#1c2129;
      }

      @for $i from 1 through 9 {
        .aplayer-volume-white[rel="#{$i}"] {
          background-color: #1c2129;
        }
      }
    }
  }
</style>