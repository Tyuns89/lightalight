export default class AdvantagesPopup {
  classButton = 'advantages__button'
  classItem = 'advantages__item'
  classPopupBlock = 'popup-text'
  classPopupWrapper = 'popup-text__wrapper'
  classPopupButtonClose = 'popup-text__close'
  classPopupOverflow = 'popup-text__overflow'

  constructor () {
    let self = this
    $(`.${this.classButton}`).click(function () {
      let objectPopupBlock = $(this).closest(`.${self.classItem}`).find(`.${self.classPopupBlock}`)
      objectPopupBlock.show()

      let windowTop = window.pageYOffset
      let popupWrapper = objectPopupBlock.find(`.${self.classPopupWrapper}`)
      popupWrapper.css('top', windowTop + 30)
    })

    $(`.${this.classPopupButtonClose}, .${this.classPopupOverflow}`).click(function () {
      $(`.${self.classPopupBlock}`).hide()
    })
  }
}
