<template>
<div>
  <div class="order">
    <div class="order__zagolovok">Ваши данные</div>
    <form action="">
      <order-customer/>
      <div class="order__zagolovok">Доставка и оплата</div>
      <order-city/>
      <div class="order__delivery-payment">
        <div v-if="isMoscow">
          <delivery-and-payment-moscow/>
        </div>
        <div v-if="!isMoscow">
          <delivery-and-payment-other/>
        </div>
      </div>
      <div class="order__zagolovok order__zagolovok-left">Комментарий к заказу:</div>
      <order-footer/>
    </form>
  </div>
</div>
</template>

<script>
import OrderFooter from './OrderFooter'
import OrderCustomer from './OrderCustomer'
import OrderCity from './OrderCity'
import DeliveryAndPaymentMoscow from './DeliveryAndPaymentMoscow'
import DeliveryAndPaymentOther from './DeliveryAndPaymentOther'

export default {
  name: 'AppOrder',
  data () {
    return {
      watchShkProductCount: 0
    }
  },
  computed: {
    orderConfig () {
      return this.$store.state.order_config
    },
    isMoscow () {
      return this.$store.state.order_config.isMoscow
    },
    watchCity () {
      return this.$store.state.order_config.city.city
    },
    watchDelivery () {
      return this.$store.state.order_config.deliveryAndPayment.current.delivery.id
    }
  },
  watch: {
    watchShkProductCount: {
      handler () {
        this.$store.commit('changeListProduct')
        this.$store.dispatch('actionPriceDelivery')
        this.$store.dispatch('ajaxListProduct')
        console.log('watch: products')
      }
    },
    watchCity: {
      handler () {
        this.$store.commit('changeIsMoscow')
        this.$store.commit('changeListPVZ')
        this.$store.commit('changeCookieCity', this.$store.state.order_config.city)
        this.$store.dispatch('actionPriceDelivery')
        console.log('watch: city')
      }
    },
    watchDelivery: {
      handler () {
        this.$store.dispatch('actionPriceDelivery')
        this.$store.dispatch('actionDeliveryException')
        console.log('watch: delivery')
      }
    }
  },
  components: {
    OrderFooter,
    OrderCustomer,
    OrderCity,
    DeliveryAndPaymentMoscow,
    DeliveryAndPaymentOther
  },
  async created () {
    await this.$store.commit('changeListProduct')
    this.$store.dispatch('ajaxListProduct')
    await this.$store.commit('changeInitCity')

    setInterval(() => {
      try {
        this.watchShkProductCount = SHK.data.items_total

        // Редирект на главную, если в корзине нет товаров
        if (parseInt(SHK.data.items_total) === 0) {
          location.href = 'https://lightalight.ru'
        }
      } catch (e) {

      }
    }, 1000)
  }
}
</script>

<style scoped>

</style>
