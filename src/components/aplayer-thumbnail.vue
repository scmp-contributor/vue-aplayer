<template>
    <div  @click="onClick" class="aplayer-button" :class="playing ? 'aplayer-pause' : 'aplayer-play'">
      <icon-button
        :icon="playing ? 'pause' : 'play'"
        :class="playing ? 'aplayer-icon-pause' : 'aplayer-icon-play'"
      />
    </div>
</template>
<script>
  import IconButton from './aplayer-iconbutton.vue'

  export default {
    components: {
      IconButton,
    },
    props: {
      pic: String,
      theme: String,
      playing: {
        type: Boolean,
        default: false,
      },
      enableDrag: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        hasMovedSinceMouseDown: false,
        dragStartX: 0,
        dragStartY: 0
      }
    },
    methods: {
      onDragBegin (e) {
        if (this.enableDrag) {
          this.hasMovedSinceMouseDown = false
          this.$emit('dragbegin')
          this.dragStartX = e.clientX
          this.dragStartY = e.clientY
          document.addEventListener('mousemove', this.onDocumentMouseMove)
          document.addEventListener('mouseup', this.onDocumentMouseUp)
        }
      },
      onDocumentMouseMove (e) {
        this.hasMovedSinceMouseDown = true
        this.$emit('dragging', {offsetLeft: e.clientX - this.dragStartX, offsetTop: e.clientY - this.dragStartY})
      },
      onDocumentMouseUp (e) {
        document.removeEventListener('mouseup', this.onDocumentMouseUp)
        document.removeEventListener('mousemove', this.onDocumentMouseMove)

        this.$emit('dragend')
      },
      onClick () {
        if (!this.hasMovedSinceMouseDown) {
          this.$emit('toggleplay')
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "../scss/variables";

  .aplayer-float {
    .aplayer-pic:active {
      cursor: move;
    }
  }

  .aplayer-button {
    margin-left: 10px;
    border-radius: 50%;
    background: #30B3CE;
    transition: all 0.1s ease;

    .aplayer-fill {
      fill:#1C2129;
    }
  }

  .aplayer-play {
    position: relative;
    width: 36px;
    height: 36px;
  
    .aplayer-icon-play {
      position: absolute;
      top: 8px;
      left: 9px;
      height: 20px;
      width: 20px;
    }
  }

  .aplayer-pause {
    position: relative;
    width: 36px;
    height: 36px;

    .aplayer-icon-pause {
      position: absolute;
      top: 8px;
      left: 8px;
      height: 20px;
      width: 20px;
    }
  }

</style>