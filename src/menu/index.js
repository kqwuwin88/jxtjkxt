import {
  uniqueId
} from 'lodash'

import menuList from './list'
/**
 * @description 给菜单数据补充上 path 字段
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath(menu, hasChildren) {
  return menu.map(e => {
      const {children,...menuItem} = e;
    return {
        ...menuItem,
        path: e.path || uniqueId('menu-empty-'),
        ...e.children && hasChildren ? {
          children: supplementPath(e.children,hasChildren)
        } : {}
      }
  })
}

// 菜单 侧边栏
export const menuAside = supplementPath(menuList,true)