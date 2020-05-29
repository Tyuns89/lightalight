export default class TabList {
  classTabBlock = 'tab-list__element'
  classTabBlockActive = 'tab-list__element-active'

  constructor () {
    let self = this
    $(`.${this.classTabBlock}`).click(function () {
      if ($(!$(this).hasClass(self.classTabBlockActive))) {
        $(`.${self.classTabBlockActive}`).removeClass(self.classTabBlockActive)
        $(this).addClass(self.classTabBlockActive)
      }
    })
  }
}
