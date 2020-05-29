import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config: {
      fields: {
        name: {
          name: 'name',
          title: 'Имя',
          type: 'text',
          required: true
        },
        long_name: {
          name: 'long-name',
          title: 'Фамилия',
          type: 'text',
          value: '',
          required: true
        },
        phone: {
          name: 'phone',
          title: 'Телефон',
          type: 'tel',
          value: '',
          required: true
        },
        email: {
          name: 'email',
          title: 'Email',
          type: 'email',
          required: true
        },
        color: {
          name: 'color',
          type: 'radio',
          value: 'white',
          required: false,
          options: [
            {
              title: 'белый',
              color: 'white'
            },
            {
              title: 'черный',
              color: 'black'
            },
            {
              title: 'золотой',
              color: 'gold'
            },
            {
              title: 'серый',
              color: 'gray'
            }
          ]
        },
        message: {
          name: 'message',
          title: 'Дополнительная информация',
          type: 'textarea',
          value: '',
          required: false
        }
      },
      send: false
    }
  },
  mutations: {
    sendForm (state, fields) {
      this.dispatch('actionSendForm', fields)
    }
  },
  actions: {
    actionSendForm (context, fields) {
      let formData = new FormData()
      formData.append('fields', JSON.stringify(fields.form))

      for (var i = 0; i < fields.files.length; i++) {
        let file = fields.files[i]
        formData.append('files[' + i + ']', file)
      }

      Vue.prototype.$http.post('https://lightalight.ru/media/api/vue/form_rashet/setCounterparty.php',
        formData, {
          headers: {'Content-Type': 'application/x-www-form-urlencoded; multipart/form-data'}
        }
      ).then(function (response) {
        console.log(response.data)

        context.state.config.send = true
        setTimeout(() => { context.state.config.send = false }, 5000)
      })
        .catch(function (error) {
          console.log('Ошибка, ' + error)
        })
    }
  }
})
