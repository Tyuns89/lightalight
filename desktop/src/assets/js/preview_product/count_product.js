export default class CountProduct {
  constructor () {
    let classElementCount = '.shk-item'
    let classElementClosestCount = '.p-t-b-b4-b1'
    let inputElementCount = '[name=shk-count]'

    $(classElementCount).find('.min').click(function () {
      let count = $(this).closest(classElementClosestCount).find(inputElementCount).val()
      count = parseInt(count)
      count = count - 1

      if (count < 1) {
        count = 1
      }

      $(this).closest(classElementClosestCount).find(inputElementCount).val(count)
    })

    $(classElementCount).find('.plus').click(function () {
      let count = $(this).closest(classElementClosestCount).find(inputElementCount).val()
      count = parseInt(count)
      count = count + 1
      $(this).closest(classElementClosestCount).find(inputElementCount).val(count)
    })
  }
}
