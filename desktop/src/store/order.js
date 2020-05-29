/**
 * @typedef {Class} SHK
 * */
import Vue from 'vue'
import Vuex from 'vuex'
import {city, customer} from '../init/order'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    order_config: {
      selectorOrderProduct: 'vue-cart-order-item',
      deliveryAndPayment: {
        current: {
          delivery: {
            id: 1,
            name: 'Самовывоз'
          },
          payment: {
            id: 1,
            name: 'Наличные'
          },
          times: {
            id: 1,
            value: '10.00 - 18.00'
          },
          pvz: {}
        },
        cityMoscow: {
          delivery: [
            {
              id: 1,
              name: 'Самовывоз',
              active: true
            },
            {
              id: 2,
              name: 'Курьерская доставка',
              active: false
            }
          ],
          times: [
            {
              id: 1,
              value: '10.00 - 18.00',
              active: true
            },
            {
              id: 2,
              value: '10.00 - 14.00',
              active: false
            },
            {
              id: 3,
              value: '14.00 - 17.00',
              active: false
            },
            {
              id: 4,
              value: '17.00 - 21.00',
              active: false
            }
          ],
          payment: [
            {
              id: 1,
              name: 'Наличные',
              active: true
            },
            {
              id: 3,
              name: 'Онлайн оплата',
              active: false
            },
            {
              id: 4,
              name: 'Счёт на юр. лицо',
              active: false
            }
          ]
        },
        cityOther: {
          delivery: [
            {
              id: 4,
              name: 'Забрать в ПВЗ СДЭК',
              active: true
            },
            {
              id: 3,
              name: 'Доставка СДЭК до порога',
              active: false
            },
            {
              id: 5,
              name: 'Почтой России',
              active: false
            }
          ],
          payment: [
            {
              id: 2,
              name: 'При получении',
              active: true
            },
            {
              id: 3,
              name: 'Онлайн оплата',
              active: false
            },
            {
              id: 4,
              name: 'Счёт на юр. лицо',
              active: false
            }
          ]
        }
      },
      selectorCountProduct: 'shk-count',
      order: {
        productsCount: 0,
        productsPrice: 0,
        productsPriceSale: 0,
        delivery: {
          price: 0,
          priceSale: 0,
          day: '',
          id: 0,
          name: ''
        },
        package: {
          weight: 0,
          length: 0,
          width: 0,
          height: 0
        }
      },
      customer: {
        name: customer.name,
        longName: customer.longName,
        phone: customer.phone,
        email: customer.email,
        comment: '',
        adress: {
          street: '',
          porch: '',
          intercom: '',
          floor: '',
          apartment: '',
          index: ''
        },
        invalid: true
      },
      error: {
        customer: {
          fieldText: 'Поле не заполнено'
        }
      },
      city,
      isMoscow: true,
      pvz: {
        list: [],
        listMoscow: [
          {
            code: 'main',
            full_address: 'Россия, Москва, Спартаковский переулок, 2с1, м. Красносельская',
            work_time: 'пн-пт 10:00-18:00,сб 11:00-17:00'
          }
        ]
      }
    }
  },
  mutations: {
    changeListProduct () {
      this.dispatch('actionListProduct')
    },
    changeDelivery (state, payload) {
      this.dispatch('actionDelivery', payload)
    },
    changeTime (state, payload) {
      this.dispatch('actionTime', payload)
    },
    changePayment (state, payload) {
      this.dispatch('actionPayment', payload)
    },
    changeInitCity () {
      this.dispatch('actionInitCity')
    },
    changeIsMoscow () {
      this.dispatch('actionIsMoscow')
    },
    changeListPVZ () {
      this.dispatch('actionListPVZ')
    },
    changeCurrentField () {
      this.dispatch('actionCurrentField')
    },
    changeCurrentPVZ (state, payload) {
      this.dispatch('actionCurrentPVZ', payload)
    },
    changeCookieCustomer (state, payload) {
      this.dispatch('actionCookieCustomer', payload)
    },
    changeCookieCity (state, payload) {
      this.dispatch('actionCookieCity', payload)
    },
    changeCreateOrder (state, payload) {
      this.dispatch('actionCreateOrder', payload)
    }
  },
  actions: {
    actionListProduct (context) {
      let productsCountPrivate = 0
      let productsPricePrivate = 0
      let productPricesSalePrivate = 0
      let productPackageWeight = 0
      let productPackageVolume = 0
      const cards = $('.' + context.state.order_config.selectorOrderProduct)

      if (cards.length > 0) {
        cards.each((index, element) => {
          let elementOrder = {
            price: $(element).data('price'),
            priceSale: $(element).data('price_sale'),
            count: $(element).data('count'),
            weight: $(element).data('weight'),
            volume: $(element).data('volume')
          }

          productsCountPrivate += elementOrder.count
          productsPricePrivate += elementOrder.price * elementOrder.count
          productPricesSalePrivate += elementOrder.priceSale * elementOrder.count

          // Формируем вес и объем заказа
          productPackageWeight += elementOrder.weight * elementOrder.count
          productPackageVolume += elementOrder.volume * elementOrder.count
        })
      }

      context.state.order_config.order.productsCount = productsCountPrivate
      context.state.order_config.order.productsPrice = productsPricePrivate
      context.state.order_config.order.productsPriceSale = productPricesSalePrivate
      context.state.order_config.order.package.weight = productPackageWeight / 1000
      context.state.order_config.order.package.width = context.state.order_config.order.package.height = context.state.order_config.order.package.length = Math.cbrt(productPackageVolume)
    },
    actionDelivery (context, payload) {
      let i = 0

      if (payload.isMoscow) {
        for (let delivery of context.state.order_config.deliveryAndPayment.cityMoscow.delivery) {
          if (payload.key !== i) {
            context.state.order_config.deliveryAndPayment.cityMoscow.delivery[i].active = false
          } else {
            context.state.order_config.deliveryAndPayment.cityMoscow.delivery[i].active = true
            context.state.order_config.deliveryAndPayment.current.delivery.id = delivery.id
            context.state.order_config.deliveryAndPayment.current.delivery.name = delivery.name
          }
          i++
        }
      } else {
        for (let delivery of context.state.order_config.deliveryAndPayment.cityOther.delivery) {
          if (payload.key !== i) {
            context.state.order_config.deliveryAndPayment.cityOther.delivery[i].active = false
          } else {
            context.state.order_config.deliveryAndPayment.cityOther.delivery[i].active = true
            context.state.order_config.deliveryAndPayment.current.delivery.id = delivery.id
            context.state.order_config.deliveryAndPayment.current.delivery.name = delivery.name
          }
          i++
        }
      }
    },
    actionDeliveryException (context) {
      const deliveryId = context.state.order_config.deliveryAndPayment.current.delivery.id
      const paymentId = context.state.order_config.deliveryAndPayment.current.payment.id

      // Исключаем способ оплаты "При получении", при выборе способа оплаты "Почтой России"
      if ((deliveryId === 5) && (paymentId === 2)) {
        // Способ оплаты меняем на "Онлайн оплата"
        context.state.order_config.deliveryAndPayment.current.payment.id = 3
        context.state.order_config.deliveryAndPayment.current.payment.name = 'Онлайн оплата'

        context.state.order_config.deliveryAndPayment.cityOther.payment[0].active = false
        context.state.order_config.deliveryAndPayment.cityOther.payment[1].active = true
      }
    },
    async actionPriceDelivery (context) {
      // Если localhost, то подставляем базовые значения
      if (Vue.config.devtools) {
        context.state.order_config.order.delivery.price = 200
        context.state.order_config.order.delivery.priceSale = 100
        context.state.order_config.order.delivery.day = 1
        context.state.order_config.order.delivery.id = 62
        context.state.order_config.order.delivery.name = 'Имя способа доставки'
      } else {
        if (context.state.order_config.city.id !== -1) {
          let response = await fetch(`/api/v1/delivery/order/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              cityId: context.state.order_config.city.id,
              package: {
                weight: context.state.order_config.order.package.weight,
                length: context.state.order_config.order.package.length,
                width: context.state.order_config.order.package.width,
                height: context.state.order_config.order.package.height
              },
              exception: (context.state.order_config.deliveryAndPayment.current.delivery.id === 3) ? [136, 234, 62] : (context.state.order_config.deliveryAndPayment.current.delivery.id === 4) ? [137, 233] : []
            })
          })
          let delivery = await response.json()

          let modificationDeliver = await this.dispatch('modificationPriceDeliver', delivery.price)

          context.state.order_config.order.delivery.price = modificationDeliver.price
          context.state.order_config.order.delivery.priceSale = modificationDeliver.priceSale
          context.state.order_config.order.delivery.day = delivery.day
          context.state.order_config.order.delivery.id = delivery.id
          context.state.order_config.order.delivery.name = delivery.name
        } else {
          context.state.order_config.order.delivery.price = 0
          context.state.order_config.order.delivery.priceSale = 0
          context.state.order_config.order.delivery.day = 0
          context.state.order_config.order.delivery.id = 0
          context.state.order_config.order.delivery.name = ''
        }
      }
    },
    actionTime (context, payload) {
      let i = 0
      for (let time of context.state.order_config.deliveryAndPayment.cityMoscow.times) {
        if (payload.key !== i) {
          context.state.order_config.deliveryAndPayment.cityMoscow.times[i].active = false
        } else {
          context.state.order_config.deliveryAndPayment.cityMoscow.times[i].active = true
          context.state.order_config.deliveryAndPayment.current.times.id = time.id
          context.state.order_config.deliveryAndPayment.current.times.value = time.value
        }
        i++
      }
    },
    actionPayment (context, payload) {
      let i = 0

      if (payload.isMoscow) {
        for (let payment of context.state.order_config.deliveryAndPayment.cityMoscow.payment) {
          if (payload.key !== i) {
            context.state.order_config.deliveryAndPayment.cityMoscow.payment[i].active = false
          } else {
            context.state.order_config.deliveryAndPayment.cityMoscow.payment[i].active = true
            context.state.order_config.deliveryAndPayment.current.payment.id = payment.id
            context.state.order_config.deliveryAndPayment.current.payment.name = payment.name
          }
          i++
        }
      } else {
        for (let payment of context.state.order_config.deliveryAndPayment.cityOther.payment) {
          if (payload.key !== i) {
            context.state.order_config.deliveryAndPayment.cityOther.payment[i].active = false
          } else {
            context.state.order_config.deliveryAndPayment.cityOther.payment[i].active = true
            context.state.order_config.deliveryAndPayment.current.payment.id = payment.id
            context.state.order_config.deliveryAndPayment.current.payment.name = payment.name
          }
          i++
        }
      }
    },
    async actionInitCity (context) {
      if (context.state.order_config.city.id === 0) {
        const cityName = JSON.parse(localStorage.getItem('geoIp'))
        const citySdek = await fetch('https://lightalight.ru/api/v1/cdek/city/' + cityName.name)
        const citySdekJson = await citySdek.json()
        const citySdekResult = {
          'id': citySdekJson.id,
          'full': citySdekJson.full,
          'city': citySdekJson.city,
          'obl': citySdekJson.obl
        }

        context.state.order_config.city = citySdekResult

        this.commit('changeIsMoscow')
        this.commit('changeCookieCity', citySdekResult)
      } else {
        this.commit('changeIsMoscow')
      }
    },
    actionIsMoscow (context) {
      let searchMoscow = 'Москва'
      let searchMoscowObl = 'Московская обл.'
      context.state.order_config.isMoscow = context.state.order_config.city.obl.toLowerCase().includes(searchMoscow.toLowerCase()) || context.state.order_config.city.obl.toLowerCase().includes(searchMoscowObl.toLowerCase())
    },
    actionListPVZ (context) {
      if (context.state.order_config.isMoscow) {
        context.state.order_config.deliveryAndPayment.current.pvz = {}
        context.state.order_config.deliveryAndPayment.current.pvz.code = context.state.order_config.pvz.listMoscow[0].code
        context.state.order_config.deliveryAndPayment.current.pvz.full_address = context.state.order_config.pvz.listMoscow[0].full_address
        context.state.order_config.deliveryAndPayment.current.pvz.work_time = context.state.order_config.pvz.listMoscow[0].work_time

        context.state.order_config.deliveryAndPayment.current.pvz = context.state.order_config.pvz.listMoscow[0]
      } else {
        fetch(`https://lightalight.ru/api/v1/delivery/pvz/${context.state.order_config.city.id}`)
          .then(response => response.json())
          .then(data => {
            context.state.order_config.pvz.list = data
            context.state.order_config.deliveryAndPayment.current.pvz = context.state.order_config.pvz.list[0]
          })
      }
    },
    actionCurrentPVZ (context, payload) {
      context.state.order_config.deliveryAndPayment.current.pvz = context.state.order_config.pvz.list[payload.key]
    },
    actionCurrentField (context) {
      let currentDelivery = {}
      let currentPayment = {}
      if (context.state.order_config.isMoscow) {
        currentDelivery = context.state.order_config.deliveryAndPayment.cityMoscow.delivery.filter(payment => {
          return payment.active
        })

        currentPayment = context.state.order_config.deliveryAndPayment.cityMoscow.payment.filter(payment => {
          return payment.active
        })
      } else {
        currentDelivery = context.state.order_config.deliveryAndPayment.cityOther.delivery.filter(payment => {
          return payment.active
        })

        currentPayment = context.state.order_config.deliveryAndPayment.cityOther.payment.filter(payment => {
          return payment.active
        })
      }

      context.state.order_config.deliveryAndPayment.current.delivery.id = currentDelivery[0].id
      context.state.order_config.deliveryAndPayment.current.delivery.name = currentDelivery[0].name

      context.state.order_config.deliveryAndPayment.current.payment.id = currentPayment[0].id
      context.state.order_config.deliveryAndPayment.current.payment.name = currentPayment[0].name
    },
    actionCookieCustomer (context, payload) {
      let cookieCustomer = Cookies.getJSON('order_config')
      cookieCustomer.customer[payload.fieldName] = payload.value
      Cookies.set('order_config', cookieCustomer, {expires: 365})
    },
    actionCookieCity (context, payload) {
      let cookieCity = Cookies.getJSON('order_config')
      cookieCity.city.id = payload.id
      cookieCity.city.full = payload.full
      cookieCity.city.obl = payload.obl
      cookieCity.city.city = payload.city
      Cookies.set('order_config', cookieCity, {expires: 365})
    },
    modificationPriceDeliver (context, payload) {
      let delivery = parseInt(payload)
      let deliverySale = 0
      let orderPrice = context.state.order_config.order.productsPrice
      let currentDeliveryId = context.state.order_config.deliveryAndPayment.current.delivery.id
      // Если доставка СДЭК (два варианта), то делаем следующее:
      // 1. стоимость заказа >= 15 000, доставкм меньша на 400
      // 2. если доставка > 0 то прибаляем 50 и округляем по 100
      // -------------------------------------------------------
      // Если НЕ СДЭК, то доставка пустая строчка
      if ((currentDeliveryId === 3) || (currentDeliveryId === 4)) {
        if (orderPrice >= 15000) {
          delivery = ((delivery - 400) > 0) ? (Math.ceil(((delivery - 400) + 50) / 100) * 100) : 0
          deliverySale = (delivery > 0) ? delivery + 400 : 0
        } else {
          delivery = Math.ceil((delivery + 50) / 100) * 100
        }
      } else {
        delivery = ''
      }
      return {
        price: delivery,
        priceSale: deliverySale
      }
    },
    ajaxListProduct (context) {
      $('#vue-order-field__product-sale-price').text(context.state.order_config.order.productsPriceSale)
      $('#vue-order-field__product-sale-value').text(context.state.order_config.order.productsPriceSale - context.state.order_config.order.productsPrice)
    },
    actionCreateOrder (context) {
      let idFormCustomer = 'shopOrderForm'
      let objFormCustomer = $(`#${idFormCustomer}`)
      let configOrder = context.state.order_config

      // 1. Заполняем пользовательские поля
      // 1.1 Имя, Фамилия
      objFormCustomer.find(`[name=fullname]`).val(`${configOrder.customer.name}, ${configOrder.customer.longName}`)

      // 1.2 Email
      objFormCustomer.find(`[name=email]`).val(`${configOrder.customer.email}`)

      // 1.3 Телефон
      // 1.3.1 Тефон как ввел клиент
      objFormCustomer.find(`[name=phone_defaul]`).val(`${configOrder.customer.phone}`)
      // 1.3.2 Телефон с обработкой
      let phoneModification = configOrder.customer.phone
      phoneModification = phoneModification.replace(/[^+\d]/g, '')
      phoneModification = phoneModification.substr(-10, 10)
      phoneModification = '+7' + phoneModification
      objFormCustomer.find(`[name=phone]`).val(phoneModification)

      // 1.4 Комментарий
      objFormCustomer.find(`[name=message]`).val(`${configOrder.customer.comment}`)

      // 1.5 Доставка
      try {
        SHK.selectDelivery(configOrder.deliveryAndPayment.current.delivery.name)
        objFormCustomer.find(`[name=shk_delivery] :contains('${configOrder.deliveryAndPayment.current.delivery.name}')`).attr('selected', 'selected')
      } catch (e) {
        objFormCustomer.find(`[name=shk_delivery] :contains('${configOrder.deliveryAndPayment.current.delivery.name}')`).attr('selected', 'selected')
      }

      // 1.6 Оплата
      objFormCustomer.find(`[name=payment] :contains('${configOrder.deliveryAndPayment.current.payment.name}')`).attr('selected', 'selected')

      // 1.7 Адрес
      let adress = ''
      if (configOrder.customer.adress.index !== '') {
        adress += configOrder.customer.adress.index + ' '
      }

      adress += configOrder.city.city + ', '

      if (configOrder.customer.adress.street !== '') {
        adress += configOrder.customer.adress.street + ', '
      }

      if (configOrder.customer.adress.apartment !== '') {
        adress += 'кв.' + configOrder.customer.adress.apartment + ', '
      }

      if (configOrder.customer.adress.porch !== '') {
        adress += 'п.' + configOrder.customer.adress.porch + ', '
      }

      if (configOrder.customer.adress.floor !== '') {
        adress += 'эт.' + configOrder.customer.adress.floor + ', '
      }

      if (configOrder.customer.adress.intercom !== '') {
        adress += 'код ' + configOrder.customer.adress.intercom + ', '
      }

      adress = adress.substring(0, adress.length - 2)
      objFormCustomer.find(`[name=address]`).val(adress)

      // 1.8 Время
      // если доставка "Курьерская доставка"
      if (configOrder.deliveryAndPayment.current.delivery.id === 2) {
        objFormCustomer.find(`[name=time_delivery]`).val(`${configOrder.deliveryAndPayment.current.times.value}`)
      }

      /* 1.9 Стоимость доставки
      * Условия:
      * - НЕ Москва и область
      * - Доставка или id 3 "Доставка СДЭК до порога"
      * - или id 4 "Забрать в ПВЗ СДЭК"
      * - стоимость > 0
      */
      if (
        (!configOrder.isMoscow) &&
        ((configOrder.deliveryAndPayment.current.delivery.id === 3) || (configOrder.deliveryAndPayment.current.delivery.id === 4)) &&
        (parseInt(configOrder.order.delivery.price) > 0)
      ) {
        objFormCustomer.find(`[name=price_delivery]`).val(`${configOrder.order.delivery.price}`)
      }

      /* 1.10 ПВЗ
      * Условия:
      * - Доставка или id 1 "Самовывоз"
      * - или id 4 "Забрать в ПВЗ СДЭК"
      * */
      if (
        (configOrder.deliveryAndPayment.current.delivery.id === 1) ||
        (configOrder.deliveryAndPayment.current.delivery.id === 4)
      ) {
        // добавляем код ПВЗ
        objFormCustomer.find(`[name=pvz_sdek_code]`).val(`${configOrder.deliveryAndPayment.current.pvz.code}`)

        // добавляем id ПВЗ (id - моего склада)
        objFormCustomer.find(`[name=pvz_sdek_id]`).val(`${configOrder.deliveryAndPayment.current.pvz.sklad_id_pvz}`)

        // добавляем адрес
        if (configOrder.deliveryAndPayment.current.pvz.sklad_address !== '') {
          objFormCustomer.find(`[name=pvz_sdek]`).val(`${configOrder.deliveryAndPayment.current.pvz.sklad_address}`)
        } else {
          objFormCustomer.find(`[name=pvz_sdek]`).val(`${configOrder.deliveryAndPayment.current.pvz.full_address}`)
        }
      }

      /* 1.11 Тариф ПВЗ
       * Услоия:
       * - Доставка или id 3 "Доставка СДЭК до порога"
       * - или id 4 "Забрать в ПВЗ СДЭК"
      * */
      if (
        (configOrder.deliveryAndPayment.current.delivery.id === 3) ||
        (configOrder.deliveryAndPayment.current.delivery.id === 4)
      ) {
        objFormCustomer.find(`[name=tariff_sdek]`).val(`${configOrder.order.delivery.name}`)
      }

      // 1.12 Город
      objFormCustomer.find(`[name=city]`).val(`${configOrder.city.city}`)

      // Заполняем пользовательские поля #END

      // ИТОГ. Отправляем заказ
      setTimeout(() => {
        objFormCustomer.submit()
        console.log('Отправка заказа (формат адресса)')
      }, 2000)
    }
  }
})
