import Vue from 'vue'

// 注意 有些组件使用异步加载会有影响
Vue.component('vsd-icon', () => import('./vsd-icon'))

Vue.component('vsd-bread-crumb', () => import('./breadCrumb'))

Vue.component('vsd-table-pagination', () => import('./table-pagination'))
Vue.component('v-chart', () => import('@/components/vue-echarts'))