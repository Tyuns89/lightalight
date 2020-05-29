require('bxslider/dist/jquery.bxslider')

export default class BXSlider {
  selectorSliderBlock = 'slider-block__items'
  selectorSliderBlockOptions = {
    auto: true,
    minSlides: 1,
    maxSlides: 1,
    slideWidth: 480,
    slideMargin: 10,
    controls: false,
    touchEnabled: true
  }

  selectorReviews = 'reviews__items'
  selectorReviewsOptions = {
    auto: false,
    minSlides: 1,
    maxSlides: 1,
    slideWidth: 480,
    slideMargin: 10,
    controls: true,
    touchEnabled: true,
    pager: false
  }

  initBxSlider (selector, options = {}) {
    let objectBlock = $('.' + selector)
    objectBlock.bxSlider(options)
  }

  constructor () {
    this.initBxSlider(this.selectorSliderBlock, this.selectorSliderBlockOptions)
    this.initBxSlider(this.selectorReviews, this.selectorReviewsOptions)
  }
}
