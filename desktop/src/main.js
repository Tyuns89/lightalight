// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import VueComponents from './assets/js/vueComponents'

import FancyboxPlugin from './assets/js/fancybox'
import ButtonTop from './assets/js/button_top'
import BxSliderPlugin from './assets/js/bxSlider'
import PreimushestvaProduct from './assets/js/product/preimushestva_product'
import SliderProduct from './assets/js/product/slider_product'
import PreviewProductButton from './assets/js/preview_product/preview_product_button'
import CountProduct from './assets/js/preview_product/count_product'
import BottomSectionBanner from './assets/js/section/section_banner'
import BlockFilter from './assets/js/section/section_filter'
import ViewPoddoments from './assets/js/poddomen/view_poddoments'
import FormZakaza from './assets/js/order/description_delivery_order'
import FormZakazaFields from './assets/js/order/transfer_field_order'
import RashetDeliverySdek from './assets/js/sdek/raschet_delivery_sdek'
import GeoIp from './assets/js/GeoIp/GeoIp'

import './assets/js/css'

// Подключаем глобально jQuery
window.$ = window.jQuery = require('jquery')

// Подключаем cookie
window.Cookies = require('js-cookie')

$(document).ready(function () {
  /* eslint-disable no-new */
  new VueComponents()
  new FancyboxPlugin()
  new BxSliderPlugin()
  new ButtonTop()
  new PreimushestvaProduct()
  new SliderProduct()
  new PreviewProductButton()
  new CountProduct()
  new BottomSectionBanner()
  new BlockFilter()
  new ViewPoddoments()
  new FormZakaza()
  new FormZakazaFields()
  new GeoIp()

  if ($('.sdek_delivery_price').length > 0) {
    new RashetDeliverySdek()
  }
})
