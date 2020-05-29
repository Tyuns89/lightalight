// Устанавливаем cookie приложения (данные клиента)
let customerField = {
  name: '',
  longName: '',
  phone: '',
  email: ''
}

let cityPrivate = {
  full: '',
  city: '',
  obl: '',
  id: 0
}

if (!Cookies.get('order_config')) {
  let cookieOrderConfig = {
    customer: {
      name: '',
      longName: '',
      phone: '',
      email: '',
      comment: '',
      adress: {
        street: '',
        porch: '',
        intercom: '',
        floor: '',
        apartment: '',
        index: ''
      }
    },
    city: {
      full: '',
      city: '',
      obl: '',
      id: 0
    }
  }

  Cookies.set('order_config', cookieOrderConfig, {expires: 365})
} else {
  let cookieCustomer = Cookies.getJSON('order_config')
  customerField.name = cookieCustomer.customer.name
  customerField.longName = cookieCustomer.customer.longName
  customerField.phone = cookieCustomer.customer.phone
  customerField.email = cookieCustomer.customer.email

  cityPrivate.full = cookieCustomer.city.full
  cityPrivate.city = cookieCustomer.city.city
  cityPrivate.obl = cookieCustomer.city.obl
  cityPrivate.id = cookieCustomer.city.id
}

export let customer = customerField
export let city = cityPrivate
