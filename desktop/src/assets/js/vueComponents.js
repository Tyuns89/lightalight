import Vue from 'vue'

import HeaderBottom from '../../components/template/header/HeaderBottom'
import FooterLeft from '../../components/template/footer/FooterLeft'

import BxSliderDizain from '../../components/template/page/index/bxSlider/BxSliderDizain'
import BxSliderTehnologii from '../../components/template/page/index/bxSlider/BxSliderTehnologii'
import BxSliderDolgovech from '../../components/template/page/index/bxSlider/BxSliderDolgovech'
import BxSliderDistanch from '../../components/template/page/index/bxSlider/BxSliderDistanch'
import UpdateBundle from '../../components/template/blocks/UpdateBundle/UpdateBundle'

import FormRaschet from '../../components/template/blocks/FormRaschet/FormRaschet'
import storeFormRaschet from '../../store/form_raschet'

import Constructor from '../../components/template/blocks/Constructor/AppConstructor'
import storeConstructor from '../../store/constructor'

import AppPodbor from '../../components/template/blocks/Podbor/AppPodbor'
import storePodbor from '../../store/podbor'

import AppOrder from '../../components/template/page/order/AppOrder'
import storeOrder from '../../store/order'

import Vuelidate from 'vuelidate'
import Axios from 'axios'

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.prototype.$http = Axios

/* eslint-disable no-new */
export default class VueComponents {
  constructor () {
    // Шапка сайта
    if ($('#header_bottom').length) {
      new Vue({
        el: '#header_bottom',
        components: { HeaderBottom },
        template: '<HeaderBottom/>'
      })
    }

    // Подвал
    if ($('#footer_left').length) {
      new Vue({
        el: '#footer_left',
        components: { FooterLeft },
        template: '<FooterLeft/>'
      })
    }

    if ($('#bx_slider_dizain').length) {
      new Vue({
        el: '#bx_slider_dizain',
        components: { BxSliderDizain },
        template: '<BxSliderDizain/>'
      })
    }

    if ($('#bx_slider_tehnologii').length) {
      new Vue({
        el: '#bx_slider_tehnologii',
        components: { BxSliderTehnologii },
        template: '<BxSliderTehnologii/>'
      })
    }

    if ($('#bx_slider_dolgovech').length) {
      new Vue({
        el: '#bx_slider_dolgovech',
        components: { BxSliderDolgovech },
        template: '<BxSliderDolgovech/>'
      })
    }

    if ($('#bx_slider_distanch').length) {
      new Vue({
        el: '#bx_slider_distanch',
        components: { BxSliderDistanch },
        template: '<BxSliderDistanch/>'
      })
    }

    if ($('#update_bundle').length) {
      new Vue({
        el: '#update_bundle',
        components: { UpdateBundle },
        template: '<UpdateBundle/>'
      })
    }

    /* Форма расчета */
    if ($('#form_raschet').length) {
      new Vue({
        el: '#form_raschet',
        store: storeFormRaschet,
        components: { FormRaschet },
        template: '<FormRaschet/>'
      })
    }

    /* Конструктор */
    if ($('#constructor').length) {
      new Vue({
        el: '#constructor',
        store: storeConstructor,
        components: { Constructor },
        template: '<Constructor/>'
      })
    }

    /* Подбор товаров (на стр. оформление заказа) */
    if ($('#vue-podbor').length) {
      new Vue({
        el: '#vue-podbor',
        store: storePodbor,
        components: { AppPodbor },
        template: '<AppPodbor/>'
      })
    }

    /* Оформление заказа */
    if ($('#order').length) {
      new Vue({
        el: '#order',
        store: storeOrder,
        components: { AppOrder },
        template: '<AppOrder/>'
      })
    }
  }
}
