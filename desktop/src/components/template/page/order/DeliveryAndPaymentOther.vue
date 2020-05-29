<template>
<div class="order__delivery-payment-wrapper">
    <div class="order__delivery-payment-item">
      <div class="order__delivery-payment-title">Способ доставки:</div>
      <div>
        <div
          class="input-checkbox-square"
          :class="{'order-hidden': currentPVZ.length === 0 && delivery.id === 4}"
          @click="changeDelivery(key)"
          v-for="(delivery, key) of deliveryAndPayment.delivery"
          :key="key"
        >
          <input
            class="input-checkbox-square__input"
            name="delivery"
            type="radio"
            :id="('delivery_' + key)"
            :value="delivery.active"
            v-model="field_delivery"
          >
          <label class="input-checkbox-square__label" :for="('delivery_' + key)">{{delivery.name}}</label>
        </div>
      </div>
    </div>
    <div class="order__delivery-payment-item">
      <div
        v-show="currentDeliveryAndPayment.delivery.id === 4"
      >
        <div class="order__delivery-payment-title">Адрес ПВЗ:</div>
        <div class="order-pvz">
          <div
            class="order-pvz__wrapper"
            :class="{'order-pvz__wrapper-scroll': currentPVZ.length > 5}"
          >
            <div
              class="order-pvz__item"
              :class="{'order-pvz__item-active': currentDeliveryAndPayment.pvz.code === pvz.code}"
              v-for="(pvz, key) of currentPVZ"
              :key="key"
              @click="changeCurrentPVZ(key)"
            >
              <div class="order-pvz__adress">{{pvz.address}}</div>
              <div class="order-pvz__time">{{pvz.work_time}}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="currentDeliveryAndPayment.delivery.id === 3"
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
        v-if="currentDeliveryAndPayment.delivery.id === 5"
      >
        <div class="order__delivery-payment-title">Адрес:</div>
        <div class="order__adress">
          <div class="order__adress-item">
            <div class="order__adress-field input-text">
              <label for="street1" class="input-text__label input-text__label-small">Улица, дом</label>
              <input
                type="text"
                id="street1"
                v-model="street"
                class="input-text__input input-text-no-padding-right"
                @change="adressFields.street = street"
              >
            </div>
          </div>
          <div class="order__adress-item">
            <div class="order__adress-field order__adress-colum2 input-text">
              <label for="apartment1" class="input-text__label input-text__label-small">Квартира</label>
              <input
                type="text"
                id="apartment1"
                v-model="apartment"
                class="input-text__input input-text-no-padding-right"
                @change="adressFields.apartment = apartment"
              >
            </div>
            <div class="order__adress-field order__adress-colum2 input-text">
              <label for="index" class="input-text__label input-text__label-small">Индекс <sup class="input-text__sup">*</sup></label>
              <input
                type="text"
                id="index"
                v-model="index"
                class="input-text__input input-text-no-padding-right"
                @change="adressFields.index = index"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order__delivery-payment-item">
      <div class="order__delivery-payment-title">Способ оплаты:</div>
      <div>
        <div
          class="input-checkbox-square"
          @click="changePayment(key)"
          v-for="(payment, key) of deliveryAndPayment.payment"
          v-if="!((currentDeliveryAndPayment.delivery.id === 5) && (payment.id === 2))"
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
  name: 'DeliveryAndPaymentOther',
  data () {
    return {
      field_delivery: true,
      field_payment: true,
      street: '',
      porch: '',
      intercom: '',
      floor: '',
      apartment: '',
      index: ''
    }
  },
  computed: {
    deliveryAndPayment () {
      return this.$store.state.order_config.deliveryAndPayment.cityOther
    },
    currentDeliveryAndPayment () {
      return this.$store.state.order_config.deliveryAndPayment.current
    },
    adressFields () {
      return this.$store.state.order_config.customer.adress
    },
    currentCity () {
      return this.$store.state.order_config.city
    },
    currentPVZ () {
      return this.$store.state.order_config.pvz.list
    }
  },
  methods: {
    changeDelivery (key) {
      this.$store.commit('changeDelivery', {key, isMoscow: false})
    },
    changePayment (key) {
      this.$store.commit('changePayment', {key, isMoscow: false})
    },
    changeCurrentPVZ (key) {
      this.$store.commit('changeCurrentPVZ', {key})
    }
  },
  created () {
    this.$store.commit('changeListPVZ')
    this.$store.commit('changeCurrentField')
  }
}
</script>

<style scoped>

</style>
