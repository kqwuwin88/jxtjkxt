import { Message, MessageBox } from 'element-ui'
import router from '@/router'
import api from '@/api'

export default {
    namespaced: true,
    actions: {
        async login ({ dispatch }, formQuery) {
            const res = await api.userLogin(formQuery)
            await dispatch('allstore/user/set', res.info, { root: true })
            await dispatch('load')
            return res
            
        },
        async logout ({ commit, dispatch }, { confirm = false } = {}) {
            /**
             * @description 注销
             */
            function logout () {
                api.loginOut().then(res=>{
                    dispatch('allstore/user/set', {}, { root: true })
                    // router.push({ name: 'login' })
                    dispatch('allstore/user/init', [], { root: true })
                    setTimeout(()=>{
                        window.location.reload()
                    },300)
                }).catch(res=>{
                    // router.push({ name: 'login' })
                    // dispatch('allstore/user/init', [], { root: true })
                    setTimeout(()=>{
                        window.location.reload()
                    },300)

                })
            }
            // 判断是否需要确认
            if (confirm) {
              MessageBox.confirm('确定退出？', '注销用户', { type: 'warning' })
                .then(() => {
                    logout()
                })
                .catch(() => {
                    Message({ message: '取消注销操作' })
                })
            } else {
                logout()
            }
        },
        async roles ({ dispatch }) {
            // 加载用户名
            await dispatch('allstore/user/outer', null, { root: true })
        },
        async load ({ dispatch }) {
            // 加载用户名
            await dispatch('allstore/user/load', null, { root: true })
            await dispatch('allstore/user/outer', null, { root: true })
        }
    }
}
