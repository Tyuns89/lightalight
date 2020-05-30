<template>
<div class="order__city">
  <span class="order__city-title">Ваш город:</span>
  <span class="order__city-value">{{city.city}}, {{city.obl}}</span>
  <span
    class="order__city-other"
    :class="{'order__city-other-active': !viewOtherCity}"
    @click="changeOtherCity"
  >Другой город</span>
  <div
    style="display: inline-block;"
    class="order-other-city"
    v-show="viewOtherCity && !viewNotCity"
  >
    <input
      type="text"
      id="order-city"
      class="order__city-list order-other-city__input"
      v-model="orderCity"
    >
  </div>
  <span
    class="order__city-notcity-text"
    @click="viewNotCity = !viewNotCity"
    v-if="!viewNotCity && viewOtherCity"
  >Не нашли город?</span>
  <span
    class="order__city-notcity"
    v-if="viewNotCity"
  >
    <span class="input-text">
      <input
        type="text"
        class="input-text__input input-text-no-padding-right"
        placeholder="Введите ваш город"
        v-model="cityNot"
        @blur="initNotCity()"
      >
    </span>
  </span>
</div>
</template>

<script>
import 'easy-autocomplete/dist/easy-autocomplete.min.css'
import Vue from 'vue'
require('easy-autocomplete')

export default {
  name: 'OrderCity',
  data () {
    return {
      viewOtherCity: false,
      viewNotCity: false,
      cityNot: '',
      orderCity: ''
    }
  },
  computed: {
    city () {
      return this.$store.state.order_config.city
    }
  },
  methods: {
    initNotCity () {
      if (this.cityNot.length >= 3) {
        this.city.id = -1
        this.city.city = this.cityNot
        this.city.full = this.cityNot
        this.city.obl = this.cityNot

        this.cityNot = ''
        this.viewNotCity = !this.viewNotCity
        this.viewOtherCity = false
      }
    },
    changeOtherCity () {
      let pathCity = (Vue.config.devtools) ? '/static/json/city_pvz.json' : '/media/json/list_city_pvz.json'
      this.viewOtherCity = true

      let options = {
        url: pathCity,
        getValue: 'city',
        requestDelay: 500,
        placeholder: 'Введите ваш город',
        list: {
          maxNumberOfElements: 15,
          match: {
            enabled: true
          },
          showAnimation: {
            type: 'slide',
            time: 400
          },
          hideAnimation: {
            type: 'fade',
            time: 400
          },
          onClickEvent: () => {
            let value = $('#order-city').getSelectedItemData()
            value.full = value.ful

            this.city.id = value.id
            this.city.full = value.ful
            this.city.city = value.city
            this.city.obl = value.obl

            this.orderCity = ''
            this.viewOtherCity = false
          }
        },
        template: {
          type: 'description',
          fields: {
            description: 'obl'
          }
        }
      }

      $('#order-city').easyAutocomplete(options)
    }
  }
}
</script>

<style scoped>

</style>
