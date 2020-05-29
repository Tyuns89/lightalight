/*
Параметры hash
1. кол-во подразетников
2. текущий цвет
3. через запятую типы подразетников
4. через запятную текущие параметры фильтра
*
 */

export let constructorHash = {
  count: 1,
  color: 'white',
  type: [],
  list_filter: [],
  hash_value: '',
  hash: (window.parent.location.hash !== '')
}

if (constructorHash.hash) {
  let hash = window.parent.location.hash.slice(1)
  let arrHash = hash.split(';')
  let arrType = arrHash[2].split(',')
  let arrTv = arrHash[3].split(':')

  // кол-во подразетников
  constructorHash.count = arrHash[0]

  // текущий цвет конструктора
  constructorHash.color = arrHash[1]

  // тип подразетников
  for (let i = 0; i < constructorHash.count; i++) {
    constructorHash.type[i] = arrType[i]
  }

  // строка hash
  constructorHash.hash_value = hash

  // tv фильтры
  for (let i = 0; i < arrTv.length; i++) {
    constructorHash.list_filter[i] = arrTv[i].split(',')
  }
}
