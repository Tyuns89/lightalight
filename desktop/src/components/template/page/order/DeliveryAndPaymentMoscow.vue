<template>
<div class="order__delivery-payment-wrapper order__delivery-payment-colum4">
  <div class="order__delivery-payment-item">
    <div class="order__delivery-payment-title">Способ доставки:</div>
    <div>
      <div
        class="input-checkbox-square"
        @click="changeDelivery(key)"
        v-for="(delivery, key) of deliveryAndPayment.delivery"
        :key="key"
      >
        <input
          class="input-checkbox-square__input"
          name="delivery"
          type="radio"
          :value="delivery.active"
          v-model="field_delivery"
          :id="('delivery_' + key)"
        >
        <label class="input-checkbox-square__label" :for="('delivery_' + key)">{{delivery.name}}</label>
      </div>
    </div>
  </div>
  <div
    class="order__delivery-payment-item"
    v-if="currentDeliveryAndPayment.delivery.id === 2"
  >
    <div class="order__delivery-payment-title">Адрес:</div>
    <div class="order__adress">
      <div class="order__adress-item">
        <div class="order__adress-field input-text">
          <label for="street" class="input-text__label input-text__label-small">Улица, дом</label>
          <input
            type="text"
            id="street"
            v-model="street"
            class="input-text__input input-text-no-padding-right"
            @change="adressFields.street = street"
          >
        </div>
      </div>
      <div class="order__adress-item">
        <div class="order__adress-field order__adress-colum4 input-text">
          <label for="porch" class="input-text__label input-text__label-small">Подъезд</label>
          <input
            type="text"
            id="porch"
            v-model="porch"
            class="input-text__input input-text-no-padding-right"
            @change="adressFields.porch = porch"
          >
        </div>
        <div class="order__adress-field order__adress-colum4 input-text">
          <label for="intercom" class="input-text__label input-text__label-small">Домофон</label>
          <input
            type="text"
            id="intercom"
            v-model="intercom"
            class="input-text__input input-text-no-padding-right"
            @change="adressFields.intercom = intercom"
          >
        </div>
        <div class="order__adress-field order__adress-colum4 input-text">
          <label for="floor" class="input-text__label input-text__label-small">Этаж</label>
          <input
            type="text"
            id="floor"
            v-model="floor"
            class="input-text__input input-text-no-padding-right"
            @change="adressFields.floor = floor"
          >
        </div>
        <div class="order__adress-field order__adress-colum4 input-text">
          <label for="apartment" class="input-text__label input-text__label-small">Квартира</label>
          <input
            type="text"
            id="apartment"
            v-model="apartment"
            class="input-text__input input-text-no-padding-right"
            @change="adressFields.apartment = apartment"
          >
        </div>
      </div>
    </div>
  </div>
  <div
    class="order__delivery-payment-item"
    v-if="currentDeliveryAndPayment.delivery.id === 1"
  >
    <div class="order__delivery-payment-title">Адрес:</div>
    <div class="order-pvz">
      <div
        class="order-pvz__wrapper"
        :class="{'order-pvz__wrapper-scroll': currentPVZMoscow.length > 5}"
      >
        <div
          class="order-pvz__item"
          :class="{'order-pvz__item-active': currentDeliveryAndPayment.pvz.code === pvz.code}"
          v-for="(pvz, key) of currentPVZMoscow"
          :key="key"
        >
          <div class="order-pvz__adress">{{pvz.full_address}}</div>
          <div class="order-pvz__time">{{pvz.work_time}}</div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="order__delivery-payment-item"
    v-if="currentDeliveryAndPayment.delivery.id === 2"
  >
    <div class="order__delivery-payment-title">Время доставки:</div>
    <div>
      <div
        class="input-checkbox-square"
        @click="changeTime(key)"
        v-for="(time, key) of deliveryAndPayment.times"
        :key="key"
      >
        <input
          class="input-checkbox-square__input"
          name="times"
          type="radio"
          :id="('time_' + key)"
          :value="time.active"
          v-model="field_times"
        >
        <label class="input-checkbox-square__label" :for="('time_' + key)">{{time.value}}</label>
      </div>
    </div>
  </div>
  <div
    class="order__delivery-payment-item"
  >
    <div class="order__delivery-payment-title">Способ оплаты:</div>
    <div>
      <div
        class="input-checkbox-square"
        @click="changePayment(key)"
        v-for="(payment, key) of deliveryAndPayment.payment"
        :key="key"
      >
        <input
          class="input-checkbox-square__input"
          name="payment"
          type="radio"
          :id="('payment_' + key)"
          :value="payment.active"
          v-model="field_payment"
        >
        <label class="input-checkbox-square__label" :for="('payment_' + key)">{{payment.name}}</label>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'DeliveryAndPaymentMoscow',
  data () {
    return {
      field_delivery: true,
      field_payment: true,
      field_times: true,
      street: '',
      porch: '',
      intercom: '',
      floor: '',
      apartment: ''
    }
  },
  computed: {
    deliveryAndPayment () {
      return this.$store.state.order_config.deliveryAndPayment.cityMoscow
    },
    adressFields () {
      return this.$store.state.order_config.customer.adress
    },
    currentDeliveryAndPayment () {
      return this.$store.state.order_config.deliveryAndPayment.current
    },
    currentPVZMoscow () {
      return this.$store.state.order_config.pvz.listMoscow
    }
  },
  methods: {
    changeDelivery (key) {
      this.$store.commit('changeDelivery', {key, isMoscow: true})
    },
    changeTime (key) {
      this.$store.commit('changeTime', {key})
    },
    changePayment (key) {
      this.$store.commit('changePayment', {key, isMoscow: true})
    }
  },
  created () {
    setTimeout(() => {
      this.currentDeliveryAndPayment.pvz.code = this.currentPVZMoscow[0].code
      this.currentDeliveryAndPayment.pvz.full_address = this.currentPVZMoscow[0].full_address
      this.currentDeliveryAndPayment.pvz.work_time = this.currentPVZMoscow[0].work_time
      this.$store.commit('changeCurrentField')
    }, 500)
  }
}
</script>

<style scoped>

</style>
