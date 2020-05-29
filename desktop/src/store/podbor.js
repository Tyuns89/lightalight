import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    podbor_config: {
      selectorOrderProduct: 'vue-cart-order-item',
      productList: [],
      props: {
        leftC1: 0,
        leftC2: 0,
        rightC1: 0,
        rightC2: 0,
        leftSr: 0,
        rightSr: 0
      },
      option: {}
    }
  },
  mutations: {
    changeListProduct () {
      this.dispatch('actionListProduct')
    },
    changePodbor () {
      this.dispatch('actionListPodbor')
    },
    changePodborOption () {
      this.dispatch('actionPodborOption')
    }
  },
  actions: {
    actionListProduct (context) {
      const cards = $('.' + context.state.podbor_config.selectorOrderProduct)

      if (cards.length > 0) {
        context.state.podbor_config.productList.splice(0, context.state.podbor_config.productList.length)

        cards.each((index, element) => {
          context.state.podbor_config.productList.push({
            count: $(element).data('count'),
            complect: $(element).data('complect'),
            type: $(element).data('type'),
            c1: $(element).data('c1'),
            c2: $(element).data('c2'),
            sr: $(element).data('sr')
          })
        })
      }
    },
    actionListPodbor (context) {
      context.state.podbor_config.props.leftC1 = 0
      context.state.podbor_config.props.leftC2 = 0
      context.state.podbor_config.props.rightC1 = 0
      context.state.podbor_config.props.rightC2 = 0
      context.state.podbor_config.props.leftSr = 0
      context.state.podbor_config.props.rightSr = 0
      for (let product of context.state.podbor_config.productList) {
        // Если товар и это не "Адаптер от мерцания ламп"
        if ((product.complect === 'no') && (parseInt(product.id) !== 893)) {
          // Св-во "Тип" product_type (tv8)
          if (product.type !== 'Рамка') {
            context.state.podbor_config.props.leftC1 += product.c1 * product.count
            context.state.podbor_config.props.leftC2 += product.c2 * product.count
            context.state.podbor_config.props.leftSr += product.sr * product.count
          } else if (product.type === 'Рамка') {
            context.state.podbor_config.props.rightC1 += product.c1 * product.count
            context.state.podbor_config.props.rightC2 += product.c2 * product.count
            context.state.podbor_config.props.rightSr += product.sr * product.count
          }
        } else if ((product.complect === 'yes') && (parseInt(product.id) !== 893)) {
          context.state.podbor_config.props.leftC1 += product.c1 * product.count
          context.state.podbor_config.props.rightC1 += product.c1 * product.count

          context.state.podbor_config.props.leftC2 += product.c2 * product.count
          context.state.podbor_config.props.rightC2 += product.c2 * product.count

          context.state.podbor_config.props.leftSr += product.sr * product.count
          context.state.podbor_config.props.rightSr += product.sr * product.count
        }
      }
    },
    async actionPodborOption (context) {
      const podborOptions = await fetch('https://lightalight.ru/api/v1/podbor/option/')
      context.state.podbor_config.option = await podborOptions.json()
    }
  }
})
