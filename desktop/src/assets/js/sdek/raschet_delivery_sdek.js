export default class RashetDeliverySdek {
  constructor () {
    // Если localhost, то ничего не делаем
    if (location.hostname !== 'localhost') {
      let cityId = $('.view_poddoments').data('city_id')
      fetch(`/api/v1/delivery/order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cityId: cityId,
          package: {
            weight: 1,
            length: 10,
            width: 10,
            height: 10
          },
          exception: []
        })
      })
        .then(response => response.json())
        .then(data => {
          let word = data.day === 1 ? 'дня' : 'дней'
          let price = Math.ceil((parseInt(data.price) + 50) / 100) * 100

          $('.sdek_delivery_day').text(data.day)
          $('.sdek_delivery_day_word').text(word)
          $('.sdek_delivery_price').text(price)
        })
    }
  }
}
