<template>
<div class="order__footer">
    <div class="order__footer-item">
      <label>
        <textarea
                name="comment"
                v-model="comment"
                class="textarea"
                @change="customer.comment = comment"
        ></textarea>
      </label>
    </div>
    <div class="order__footer-item">
      <div class="order-itog">
        <div class="order-itog__item">
          <div class="order-itog__title order-itog__title-itog">Итого</div>
          <div class="order-itog__value order-itog__value-title">{{orderItog.productsPrice}} р.</div>
        </div>
        <div class="order-itog__item">
          <div class="order-itog__title order-itog__title-products">Товыры {{orderItog.productsCount}} шт.</div>
          <div class="order-itog__value order-itog__value-products">{{orderItog.productsPriceSale}} р.</div>
        </div>
        <div class="order-itog__item">
          <div class="order-itog__title order-itog__title-sale">Скидка</div>
          <div class="order-itog__value order-itog__value-sale">{{orderItog.productsPrice - orderItog.productsPriceSale}} р.</div>
        </div>
        <div
          class="order-itog__item"
          v-if="!isMoscow && ((currentDeliverId === 3) || (currentDeliverId === 4))"
        >
          <div class="order-itog__title order-itog__title-delivery">Доставка</div>
          <div
            class="order-itog__value order-itog__value-delivery"
            v-if="(orderItog.delivery.price > 0) && (city.id > 0)"
          ><del>{{orderItog.delivery.priceSale > 0 ? orderItog.delivery.priceSale : ''}}</del> {{orderItog.delivery.price}} р.</div>
          <div
            class="order-itog__value order-itog__value-delivery"
            v-if="(orderItog.delivery.price === 0)  && (city.id > 0)"
          >бесплатно</div>
          <div
            class="order-itog__value order-itog__value-delivery"
            v-if="city.id === -1"
          >после обработки</div>
        </div>
      </div>
    </div>
    <div class="order__footer-item">
      <div
        v-if="!send"
        class="order__submit"
        :class="{'order__submit-disable': customer.invalid || ((currentDeliverId === 5) && (customer.adress.index === ''))}"
        @click="createOrder"
      >
        Оформить заказ
      </div>
      <div
        v-else
        class="order__submit"
      >Заказ отправляется</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderFooter',
  data () {
    return {
      comment: '',
      send: false
    }
  },
  computed: {
    orderItog () {
      return this.$store.state.order_config.order
    },
    customer () {
      return this.$store.state.order_config.customer
    },
    city () {
      return this.$store.state.order_config.city
    },
    isMoscow () {
      return this.$store.state.order_config.isMoscow
    },
    currentDeliverId () {
      return this.$store.state.order_config.deliveryAndPayment.current.delivery.id
    }
  },
  methods: {
    createOrder () {
      // Условие отправки заказа:
      // 1.1 Должны быть заполнены все пользовательские поля (имя, телефон, почта, фамилия)
      // 1.1 Если выбран способ доставки "Почтой России", то поле "Индекс" обязательное
      if (
        !this.customer.invalid &&
        (
          ((this.currentDeliverId === 5) && (this.customer.adress.index !== '')) ||
          (this.currentDeliverId !== 5)
        )
      ) {
        this.send = true
        this.$store.commit('changeCreateOrder')
      }
    }
  }
}
</script>

<style scoped>

</style>
