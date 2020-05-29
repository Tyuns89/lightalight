<template>
  <div class="order-podbor">
    <div class="order-podbor__wrapper">
      <div class="order-podbor__item">
        <div class="order-podbor__item-wrapper">
          <div class="order-podbor__images">
            <div class="order-podbor__img 1" :style="{ backgroundImage: 'url(' + options.podbor_photo_c1 + ')' }"
            ></div>
            <div class="order-podbor__img" :style="{ backgroundImage: 'url(' + options.podbor_photo_ramka_c1 + ')' }"
            ></div>
          </div>
          <div class="order-podbor__result">
            <div class="order-podbor__value">{{podbor.leftC1}}</div>
            <div v-if="podbor.leftC1 === podbor.rightC1" @click="infoBlock1 = !infoBlock1" class="order-podbor__value-img" :style="{ backgroundImage: 'url(' + options.podbor_photo_success + ')' }"></div>
            <div v-else  @click="infoBlock1 = !infoBlock1" class="order-podbor__value-img" :style="{ backgroundImage: 'url(' + options.podbor_photo_failure + ')' }"></div>
            <div class="order-podbor__value">{{podbor.rightC1}}</div>
          </div>
          <div class="order-podbor__popup" v-if="(podbor.leftC1 !== podbor.rightC1) && (infoBlock1)">
            <div class="order-podbor__popup-wrapper">
              <div class="order-podbor__popup-close" @click="infoBlock1 = !infoBlock1">x</div>
              <div v-if="podbor.leftC1 > podbor.rightC1" class="order-podbor__popup-text" v-html="options.podbor_content_c1"></div>
              <div v-if="podbor.leftC1 < podbor.rightC1" class="order-podbor__popup-text" v-html="options.podbor_content_right_c1"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="order-podbor__item">
        <div class="order-podbor__item-wrapper">
          <div class="order-podbor__images">
            <div class="order-podbor__img" :style="{ backgroundImage: 'url(' + options.podbor_photo_c2 + ')' }"
            ></div>
            <div class="order-podbor__img" :style="{ backgroundImage: 'url(' + options.podbor_photo_ramka_c2 + ')' }"
            ></div>
          </div>
          <div class="order-podbor__result">
            <div class="order-podbor__value">{{podbor.leftC2}}</div>
            <div v-if="podbor.leftC2 === podbor.rightC2" @click="infoBlock2 = !infoBlock2" class="order-podbor__value-img" :style="{ backgroundImage: 'url(' + options.podbor_photo_success + ')' }"></div>
            <div v-else  @click="infoBlock2 = !infoBlock2" class="order-podbor__value-img" :style="{ backgroundImage: 'url(' + options.podbor_photo_failure + ')' }"></div>
            <div class="order-podbor__value">{{podbor.rightC2}}</div>
          </div>
          <div class="order-podbor__popup" v-if="(podbor.leftC2 !== podbor.rightC2) && (infoBlock2)">
            <div class="order-podbor__popup-wrapper">
              <div class="order-podbor__popup-close" @click="infoBlock2 = !infoBlock2">x</div>
              <div v-if="podbor.leftC2 > podbor.rightC2" class="order-podbor__popup-text" v-html="options.podbor_content_c2"></div>
              <div v-if="podbor.leftC2 < podbor.rightC2" class="order-podbor__popup-text" v-html="options.podbor_content_right_c2"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="order-podbor__item">
        <div class="order-podbor__item-wrapper">
          <div class="order-podbor__images">
            <div class="order-podbor__img" :style="{ backgroundImage: 'url(' + options.podbor_photo_sr + ')' }"
            ></div>
            <div class="order-podbor__img" :style="{ backgroundImage: 'url(' + options.podbor_photo_ramka_sr + ')' }"
            ></div>
          </div>
          <div class="order-podbor__result">
            <div class="order-podbor__value">{{podbor.leftSr}}</div>
            <div v-if="podbor.leftSr === podbor.rightSr" @click="infoBlock3 = !infoBlock3" class="order-podbor__value-img" :style="{ backgroundImage: 'url(' + options.podbor_photo_success + ')' }"></div>
            <div v-else  @click="infoBlock3 = !infoBlock3" class="order-podbor__value-img" :style="{ backgroundImage: 'url(' + options.podbor_photo_failure + ')' }"></div>
            <div class="order-podbor__value">{{podbor.rightSr}}</div>
          </div>
          <div class="order-podbor__popup" v-if="(podbor.leftSr !== podbor.rightSr) && (infoBlock3)">
            <div class="order-podbor__popup-wrapper">
              <div class="order-podbor__popup-close" @click="infoBlock3 = !infoBlock3">x</div>
              <div v-if="podbor.leftSr > podbor.rightSr" class="order-podbor__popup-text" v-html="options.podbor_content_sr"></div>
              <div v-if="podbor.leftSr < podbor.rightSr" class="order-podbor__popup-text" v-html="options.podbor_content_right_sr"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppPodbor',
  data () {
    return {
      infoBlock1: false,
      infoBlock2: false,
      infoBlock3: false,
      shkProductCount: 0
    }
  },
  computed: {
    podbor () {
      return this.$store.state.podbor_config.props
    },
    options () {
      return this.$store.state.podbor_config.option
    }
  },
  watch: {
    shkProductCount: {
      handler () {
        console.log('change product')
        this.$store.commit('changeListProduct')
        this.$store.commit('changePodbor')
      }
    }
  },
  created () {
    this.$store.commit('changeListProduct')
    this.$store.commit('changePodborOption')
    this.$store.commit('changePodbor')

    setInterval(() => {
      try {
        this.shkProductCount = SHK.data.items_total
      } catch (e) {

      }
    }, 1000)
  }
}
</script>

<style scoped>

</style>
