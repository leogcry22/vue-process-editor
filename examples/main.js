import App from './App'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small' })

new Vue({
  render: h => h(App)
}).$mount('#app')
