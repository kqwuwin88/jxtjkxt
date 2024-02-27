export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {},
    permission:[],
    userType:'',
  },
  getters:{
    info:state=>state.info,
    permission:state=>state.permission,
    userType:state=>state.userType,
  },
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} context
     * @param {*} info info
     */
    async set ({ state, dispatch }, info) {
      // store 赋值
      state.info = info
      // 持久化
      await dispatch('allstore/db/set', {
        dbName: 'sys',
        path: 'user.info',
        value: info,
        user: true
      }, { root: true })
    },
    async setusertype ({ state, dispatch }, info) {
      // store 赋值
      state.userType = info
    },
    async init ({ state, dispatch }, permission) {
        // store 赋值
        state.permission = permission
        // 持久化
        await dispatch('allstore/db/set', {
          dbName: 'sys',
          path: 'user.permission',
          value: permission,
          user: true
        }, { root: true })
      },
    async outer ({ state, dispatch }) {
        state.permission = await dispatch('allstore/db/get', {
            dbName: 'sys',
            path: 'user.permission',
            defaultValue: [],
            user: true
        }, { root: true })
    },
      
    /**
     * @description 从数据库取用户数据
     * @param {Object} context
     */
    async load ({ state, dispatch }) {
      // store 赋值
      state.info = await dispatch('allstore/db/get', {
        dbName: 'sys',
        path: 'user.info',
        defaultValue: {},
        user: true
      }, { root: true })
    }
  }
}
