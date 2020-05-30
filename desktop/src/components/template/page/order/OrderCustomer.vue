<template>
<div class="order-customer">
    <div class="order-customer__fields">
      <div class="order-customer__field">
        <div class="input-text">
          <label class="input-text__label" for="field_name">Имя <sup class="input-text__sup">*</sup></label>
          <input
            type="text"
            id="field_name"
            v-model="name"
            @blur="changeCookieCustomer('name', name)"
            class="input-text__input"
            :class="{'input-text__input-error': $v.name.$error, 'input-text__input-good': !$v.name.$error && customer.name !== ''}"
          >
          <span
            class="input-text__error"
            v-if="$v.name.$error"
          >{{fieldError.fieldText}}</span>
        </div>
      </div>
      <div class="order-customer__field">
        <div class="input-text">
          <label class="input-text__label" for="field_phone">Контактный телефон <sup class="input-text__sup">*</sup></label>
          <input
            type="tel"
            id="field_phone"
            v-model="phone"
            @blur="changeCookieCustomer('phone', phone)"
            class="input-text__input"
            :class="{'input-text__input-error': $v.phone.$error, 'input-text__input-good': !$v.phone.$error && customer.phone !== ''}"
          >
          <span
            class="input-text__error"
            v-if="$v.phone.$error"
          >{{fieldError.fieldText}}</span>
        </div>
      </div>
      <div class="order-customer__field">
        <div class="input-text">
          <label class="input-text__label" for="field_long_name">Фамилия <sup class="input-text__sup">*</sup></label>
          <input
            type="text"
            id="field_long_name"
            v-model="longname"
            @blur="changeCookieCustomer('longname', longname)"
            class="input-text__input"
            :class="{'input-text__input-error': $v.longname.$error, 'input-text__input-good': !$v.longname.$error && customer.longname !== ''}"
          >
          <span
            class="input-text__error"
            v-if="$v.longname.$error"
          >{{fieldError.fieldText}}</span>
        </div>
      </div>
      <div class="order-customer__field">
        <div class="input-text">
          <label class="input-text__label" for="field_email">Электронная почта <sup class="input-text__sup">*</sup></label>
          <input
            type="email"
            id="field_email"
            v-model="email"
            @blur="changeCookieCustomer('email', email)"
            class="input-text__input"
            :class="{'input-text__input-error': $v.email.$error, 'input-text__input-good': !$v.email.$error && customer.email !== ''}"
          >
          <span
            class="input-text__error"
            v-if="$v.email.$error"
          >{{fieldError.fieldText}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  name: 'OrderCustomer',
  data () {
    return {
      name: '',
      longname: '',
      phone: '',
      email: ''
    }
  },
  computed: {
    customer () {
      return this.$store.state.order_config.customer
    },
    fieldError () {
      return this.$store.state.order_config.error.customer
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(3)
    },
    longname: {
      required,
      minLength: minLength(3)
    },
    phone: {
      required,
      minLength: minLength(10)
    },
    email: {
      required,
      email
    }
  },
  methods: {
    changeCookieCustomer (fieldName, value) {
      this.$v[fieldName].$touch()

      fieldName = (fieldName === 'longname') ? 'longName' : fieldName
      this.$store.commit('changeCookieCustomer', {fieldName, value})
      this.$store.state.order_config.customer[fieldName] = value
      this.$store.state.order_config.customer.invalid = this.$v.$invalid
    }
  },
  created () {
    this.name = this.customer.name
    this.longname = this.customer.longName
    this.phone = this.customer.phone
    this.email = this.customer.email
    this.$store.state.order_config.customer.invalid = this.$v.$invalid
  }
}
</script>

<style scoped>

</style>
