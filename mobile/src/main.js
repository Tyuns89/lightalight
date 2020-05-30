// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'
import AppPodbor from './components/Podbor/AppPodbor'
import storePodbor from './store/podbor'
import AppOrder from './components/Order/AppOrder'
import storeOrder from './store/order'
import 'normalize.css'
import './assets/css/fonts.css'
import './bem.css'
import BXSlider from './assets/js/BXSlider/BXSlider'
import TabList from './assets/js/TabList/TabList'
import ProductTab from './assets/js/ProductTab/ProductTab'
import AdvantagesPopup from './assets/js/AdvantagesPopup/AdvantagesPopup'

// Подключаем глобально jQuery
let $ = window.$ = window.jQuery = require('jquery')

// Подключаем cookie
window.Cookies = require('js-cookie')

Vue.use(Vuex)
Vue.use(Vuelidate)
Vue.config.productionTip = false

/* eslint-disable no-new */
$(document).ready(function () {
  new BXSlider()
  new TabList()
  new ProductTab()
  new AdvantagesPopup()

  /* Подбор товаров (на стр. оформление заказа) */
  if ($('#vue-podbor').length) {
    new Vue({
      el: '#vue-podbor',
      store: storePodbor,
      components: { AppPodbor },
      template: '<AppPodbor/>'
    })
  }
  if ($('#order').length) {
    new Vue({
      el: '#order',
      store: storeOrder,
      components: { AppOrder },
      template: '<AppOrder/>'
    })
  }
})
