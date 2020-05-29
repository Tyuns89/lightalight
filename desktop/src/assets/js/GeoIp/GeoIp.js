export default class GeoIp {
  varNameGeoIp = 'geoIp'

  constructor () {
    if (!this.isGeoIp()) {
      this.setGeoIp().then(data => console.log(data))
    }
  }

  /**
   * Определяем, есть ли переменная в  Local Storage "geoIp"?
   * @return boolean
   * */
  isGeoIp () {
    const isGeoIp = localStorage.getItem(this.varNameGeoIp)
    return isGeoIp !== null
  }

  /**
   * Создаем переменную в Local Storage "geoIp"
   * @return JSON
   * */
  async setGeoIp () {
    const geoIp = await fetch('https://lightalight.ru/api/v1/geo_ip/current/')
    const geoIpJson = await geoIp.json()

    // сохраняем в Local Storage
    localStorage.setItem(this.varNameGeoIp, JSON.stringify(geoIpJson))

    return geoIpJson
  }
}
