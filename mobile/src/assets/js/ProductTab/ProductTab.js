export default class ProductTab {
  classTab = 'product-tab__tab'
  classTabActive = 'product-tab__tab-active'
  objectTab = $(`.${this.classTab}`)
  classBlockContent = 'product-tab__content'
  classBlockContentActive = 'product-tab__content-active'

  constructor () {
    let self = this

    this.objectTab.click(function () {
      if (!$(this).hasClass(self.classTabActive)) {
        let block = $(this).data('block')

        self.objectTab.removeClass(self.classTabActive)
        $(this).addClass(self.classTabActive)

        $(`.${self.classBlockContent}`).removeClass(self.classBlockContentActive)
        $(`.${self.classBlockContent}[data-block=${block}]`).addClass(self.classBlockContentActive)
      }
    })
  }
}
