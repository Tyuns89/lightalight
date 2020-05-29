import Vue from 'vue'
import Vuex from 'vuex'
import {constructorHash} from '../init/constructor'
import VueYandexMetrika from 'vue-yandex-metrika'

Vue.use(Vuex)
Vue.use(VueYandexMetrika, {
  id: 21879676,
  env: process.env.NODE_ENV,
  webvisor: true,
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  ecommerce: 'dataLayer'
})

export default new Vuex.Store({
  state: {
    constructor_config: {
      podrazetnik: {
        count: 1,
        current: 1
      },
      color: {
        list: ['white', 'black', 'gray', 'gold'],
        current: 'white'
      },
      type: {
        list: [1, 2, 0],
        current: [
          {
            value: 1
          },
          {
            value: 1
          },
          {
            value: 1
          },
          {
            value: 1
          },
          {
            value: 1
          }
        ]
      },
      price: [],
      list_product: [],
      list_product_id: [],
      list_product_count: [],
      order_send: false,
      list_filter: [],
      error: {
        products: {
          error: false,
          error_text: ''
        }
      },
      form: {
        fields: {
          name: '',
          phone: ''
        },
        send: false,
        view: false
      },
      mobile: {
        view: {
          form_select_podrazetnik: false,
          form_select_color: false
        }
      },
      hash: '',
      hash_order: false,
      init: constructorHash,
      dealer: {
        is_dealer: (parent.location.pathname === '/dealer/')
      },
      akciya_text: ''
    }
  },
  mutations: {
    changeCountPodrazetnik (state, payload) {
      // Подразетников не может быть меньше 1 и больше 5
      if ((state.constructor_config.podrazetnik.count + payload) < 1) {
        state.constructor_config.podrazetnik.count = 1
      } else if ((state.constructor_config.podrazetnik.count + payload) > 5) {
        state.constructor_config.podrazetnik.count = 5
      } else {
        state.constructor_config.podrazetnik.count += payload
      }

      // Указываем текущий подразетник
      state.constructor_config.podrazetnik.current = state.constructor_config.podrazetnik.count

      // Обновляем товары конструктора
      this.dispatch('actionListProduct')
    },
    changeCurrentPodrazetnik (state, payload) {
      // Подразетников не можеть быть меньше 1 и больше текущего кол-ва подразетников
      if (payload < 1) {
        state.constructor_config.podrazetnik.current = 1
      } else if (payload > state.constructor_config.podrazetnik.count) {
        state.constructor_config.podrazetnik.current = state.constructor_config.podrazetnik.count
      } else {
        state.constructor_config.podrazetnik.current = payload
      }

      // Обновляем товары конструктора
      this.dispatch('actionListProduct')
    },
    changeCurrentColor (state, payload) {
      state.constructor_config.color.current = payload

      // Обновляем товары конструктора
      this.dispatch('actionListProduct')
    },
    changeCurrentType (state, payload) {
      state.constructor_config.type.current[ state.constructor_config.podrazetnik.current - 1 ].value = payload

      // Обновляем товары конструктора
      this.dispatch('actionListProduct')
    },
    getListFilter (state, payload) {
      state.constructor_config.list_filter = payload

      // инициализируем настройки конструктора
      if (state.constructor_config.init.hash) {
        state.constructor_config.podrazetnik.count = parseInt(state.constructor_config.init.count)
        state.constructor_config.color.current = state.constructor_config.init.color

        // тип
        for (let i = 0; i < state.constructor_config.init.type.length; i++) {
          state.constructor_config.type.current[i].value = parseInt(state.constructor_config.init.type[i])
        }

        // фильтр
        for (let i = 0; i < state.constructor_config.init.list_filter.length; i++) {
          for (let j = 0; j < state.constructor_config.init.list_filter[i].length; j++) {
            let element = state.constructor_config.init.list_filter[i][j].split('-')
            let elementId = element[0]
            let elementPosition = element[1]

            for (let k = 0; k < state.constructor_config.list_filter.length; k++) {
              if (
                (state.constructor_config.list_filter[k].tv_name === state.constructor_config.list_filter[ elementId ].tv_name) &&
                (state.constructor_config.list_filter[k].type === state.constructor_config.list_filter[ elementId ].type)
              ) {
                if (parseInt(elementPosition) === 0) {
                  state.constructor_config.list_filter[k].active[i].value = '0'
                } else {
                  state.constructor_config.list_filter[k].active[i].value_right = '0'
                }
              }
            }

            if (parseInt(elementPosition) === 0) {
              state.constructor_config.list_filter[ elementId ].active[ i ].value = '1'
            } else {
              state.constructor_config.list_filter[ elementId ].active[ i ].value_right = '1'
            }
          }
        }
      }

      // Обновляем товары конструктора
      this.dispatch('actionListProduct')
    },
    changeCurrentListTv (state, payload) {
      let value = ''
      if (payload.position === 'left') {
        value = 'value'
      } else {
        value = 'value_right'
      }
      if (state.constructor_config.list_filter[ payload.item.id ].active[ state.constructor_config.podrazetnik.current - 1 ][value] !== '1') {
        for (let itemFilter of state.constructor_config.list_filter) {
          if ((parseInt(payload.type) === parseInt(itemFilter.type)) && (parseInt(payload.item.tv_name) === parseInt(itemFilter.tv_name))) {
            if (parseInt(itemFilter.id) !== parseInt(payload.item.id)) {
              state.constructor_config.list_filter[itemFilter.id].active[ state.constructor_config.podrazetnik.current - 1 ][value] = '0'

              if (parseInt(state.constructor_config.list_filter[ payload.item.id ]['polovinka']) === 0) {
                state.constructor_config.list_filter[itemFilter.id].active[ state.constructor_config.podrazetnik.current - 1 ]['value_right'] = '0'
              }
            } else {
              state.constructor_config.list_filter[itemFilter.id].active[ state.constructor_config.podrazetnik.current - 1 ][value] = '1'
            }
          }
        }
      }

      // Обновляем товары конструктора
      this.dispatch('actionListProduct')
    },
    sendMail (state) {
      this.dispatch('actionSendMail')
    },
    sendOrder (stackDepthParameterType) {
      this.dispatch('actionSendOrder')
    },
    copyLink (state) {
      this.dispatch('actionCopyLink')
    },
    getAkciya (state, payload) {
      state.constructor_config.akciya_text = payload
    }
  },
  actions: {
    actionListProduct (context) {
      Vue.prototype.$http({
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: 'https://lightalight.ru/media/api/vue/constructor/getProduct.php',
        data: {
          constructor_config: JSON.stringify(context.state.constructor_config)
        }
      })
        .then(function (response) {
          context.state.constructor_config.list_product = response.data['items']
          context.state.constructor_config.price = response.data['price']
          context.state.constructor_config.list_product_id = response.data['ids']
          context.state.constructor_config.list_product_count = response.data['counts']
          context.state.constructor_config.error.products.error = response.data['error']
          context.state.constructor_config.error.products.error_text = response.data['error_text']

          if (!context.state.constructor_config.error.products.error) {
            context.state.constructor_config.form.view = false
          }
        })
      // Добавляем яндекс цель
      try {
        Vue.$metrika.reachGoal('KONSTRUCTOR')
      } catch (e) {
        // console.log('Ошибка ' + e.name + ':' + e.message + ': ' + e.stack)
      }
    },
    actionSendMail (context) {
      if ((parseInt(context.state.constructor_config.form.fields.name.length) > 1) && (parseInt(context.state.constructor_config.form.fields.phone.length) > 1)) {
        Vue.prototype.$http({
          method: 'post',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          url: 'https://lightalight.ru/media/api/vue/constructor/getSend.php',
          data: {
            constructor_config: JSON.stringify(context.state.constructor_config)
          }
        })
          .then(function (response) {
            if (parseInt(response.data) === 1) {
              context.state.constructor_config.form.send = true
              setTimeout(() => (context.state.constructor_config.form.send = false), 5000)
            }
          })
      }
    },
    actionSendOrder (context) {
      if (context.state.constructor_config.error.products.error) {
        context.state.constructor_config.form.view = true
      } else {
        context.state.constructor_config.form.view = false

        try {
          // let elem = parent.document.getElementById('vue_add_construct')
          // elem.click()
          /* globals SHK */
          SHK.toCartFromArray(
            context.state.constructor_config.list_product_id,
            context.state.constructor_config.list_product_count
          )
        } catch (e) {
          console.log(context.state.constructor_config.list_product_id)
          console.log(context.state.constructor_config.list_product_count)
        }
        context.state.constructor_config.order_send = true
        setTimeout(() => (context.state.constructor_config.order_send = false), 2500)
      }

      // Добавляем яндекс цель
      try {
        Vue.$metrika.reachGoal('VKORZINYIZKONSTRUCTORA')
      } catch (e) {
        console.log('Ошибка ' + e.name + ':' + e.message + ': ' + e.stack)
      }

      return false
    },
    actionCopyLink (context) {
      context.state.constructor_config.hash = '#'
      context.state.constructor_config.hash += context.state.constructor_config.podrazetnik.count + ';'
      context.state.constructor_config.hash += context.state.constructor_config.color.current + ';'

      // тип
      for (let i = 0; i < parseInt(context.state.constructor_config.podrazetnik.count); i++) {
        context.state.constructor_config.hash += context.state.constructor_config.type.current[i].value + ','
      }
      context.state.constructor_config.hash = context.state.constructor_config.hash.slice(0, -1)
      context.state.constructor_config.hash += ';'

      // фильтр
      for (let i = 0; i < parseInt(context.state.constructor_config.podrazetnik.count); i++) {
        for (let j = 0; j < context.state.constructor_config.list_filter.length; j++) {
          if (
            (parseInt(context.state.constructor_config.list_filter[j].type) === parseInt(context.state.constructor_config.type.current[i].value)) &&
            ((parseInt(context.state.constructor_config.list_filter[j].active[i].value) === 1) || (parseInt(context.state.constructor_config.list_filter[j].active[i].value_right) === 1))
          ) {
            if ((parseInt(context.state.constructor_config.list_filter[j].active[i].value) === 1) && (parseInt(context.state.constructor_config.list_filter[j].active[i].value_right) === 1)) {
              context.state.constructor_config.hash += context.state.constructor_config.list_filter[j].id + '-0' + ',' + context.state.constructor_config.list_filter[j].id + '-1'
            } else {
              if (parseInt(context.state.constructor_config.list_filter[j].active[i].value) === 1) {
                context.state.constructor_config.hash += context.state.constructor_config.list_filter[j].id + '-0'
              } else {
                context.state.constructor_config.hash += context.state.constructor_config.list_filter[j].id + '-1'
              }
            }
            context.state.constructor_config.hash += ','
          }
        }

        context.state.constructor_config.hash += ':'
      }

      context.state.constructor_config.hash = context.state.constructor_config.hash.replace(/,:/g, ':')
      context.state.constructor_config.hash = context.state.constructor_config.hash.slice(0, -1)
      context.state.constructor_config.hash = 'https://' + location.host + window.parent.location.pathname + context.state.constructor_config.hash
      console.log(context.state.constructor_config.hash)

      if (navigator.clipboard) {
        navigator.clipboard.writeText(context.state.constructor_config.hash)
          .then(() => {
            console.log('Ссылка скоппирована')
          })
          .catch(err => {
            console.log('Ошибка коппирования', err)
          })
      } else {
        let el = document.createElement('textarea')
        el.value = context.state.constructor_config.hash
        el.setAttribute('readonly', '')
        el.style = {position: 'absolute', left: '-9999px'}
        document.body.appendChild(el)

        if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
          let editable = el.contentEditable
          let readOnly = el.readOnly

          el.contentEditable = true
          el.readOnly = true

          let range = document.createRange()
          range.selectNodeContents(el)

          let selection = window.getSelection()
          selection.removeAllRanges()
          selection.addRange(range)
          el.setSelectionRange(0, 999999)

          el.contentEditable = editable
          el.readOnly = readOnly
        } else {
          el.select()
        }

        document.execCommand('copy')
        document.body.removeChild(el)
      }
      context.state.constructor_config.hash_order = true
      setTimeout(() => (context.state.constructor_config.hash_order = false), 2000)
    }
  }
})
