// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import AppPodbor from './components/AppPodbor'
import storePodbor from './store/podbor'
import 'normalize.css'
import './assets/css/fonts.css'
import './bem.css'
import BXSlider from './assets/js/BXSlider/BXSlider'
import TabList from './assets/js/TabList/TabList'
import ProductTab from './assets/js/ProductTab/ProductTab'
import AdvantagesPopup from './assets/js/AdvantagesPopup/AdvantagesPopup'

// Подключаем глобально jQuery
let $ = window.$ = window.jQuery = require('jquery')

Vue.use(Vuex)
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
})
