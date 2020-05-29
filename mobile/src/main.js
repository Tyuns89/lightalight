// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'normalize.css'
import './assets/css/fonts.css'
import './bem.css'
import BXSlider from './assets/js/BXSlider/BXSlider'
import TabList from './assets/js/TabList/TabList'
import ProductTab from './assets/js/ProductTab/ProductTab'
import AdvantagesPopup from './assets/js/AdvantagesPopup/AdvantagesPopup'

// Подключаем глобально jQuery
let $ = window.$ = window.jQuery = require('jquery')

Vue.config.productionTip = false

/* eslint-disable no-new */
$(document).ready(function () {
  new BXSlider()
  new TabList()
  new ProductTab()
  new AdvantagesPopup()
})
