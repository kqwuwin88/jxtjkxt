import { homeMenuRoutes,errorPage,permissionsMenu } from '@/router/routes'
import { menuAside } from '@/menu'

export const createSides =  (permissions,groupType) => {
    const result = []
    homeMenuRoutes.forEach(item=>{
        if(item.meta.isMenu){
            if(item.meta.right){
                if(permissions.indexOf(item.meta.right) > -1){
                    result.push(item)
                }
            }else{
                if(item.children && item.children.length){
                    if(item.children[0].meta.right){
                        const newc = item.children.filter(k=>{
                            if(k.meta.groupType){
                                return permissions.indexOf(k.meta.right) > -1 && k.meta.groupType === groupType
                            }
                            return permissions.indexOf(k.meta.right) > -1
                        })
                        if(newc.length != 0){
                            item.children = newc
                            result.push(item)
                        }
                    }else{
                        const childres = []
                        item.children.forEach(m=>{
                            const newd = m.children.filter(n=>{
                                if(n.meta.groupType){
                                    return permissions.indexOf(n.meta.right) > -1 && n.meta.groupType === groupType
                                }
                                return permissions.indexOf(n.meta.right) > -1
                            })
                            if(newd.length != 0){
                                m.children = newd
                                childres.push(m)
                            }
                        })
                        if(childres.length > 0){
                            result.push(item)
                        }
                    }
                }else{
                    result.push(item)
                }
            }
        }
    })
    return result
}
export const createRoutes =  (permissions,groupType) => {
    const pesMenu = permissionsMenu[0].children
    const result = []
    pesMenu.forEach(item=>{
        if(item.meta.isMenu){
            if(item.meta.right){
                if(permissions.indexOf(item.meta.right) > -1){
                    result.push(item)
                }
            }else{
                if(item.children && item.children.length){
                    if(item.children[0].meta.right){
                        // const newc = item.children.filter(k=>permissions.indexOf(k.meta.right) > -1)
                        const newc = item.children.filter(k=>{
                            if(k.meta.groupType){
                                return permissions.indexOf(k.meta.right) > -1 && k.meta.groupType === groupType
                            }
                            return permissions.indexOf(k.meta.right) > -1
                        })
                        if(newc.length != 0){
                            item.children = newc
                            result.push(item)
                        }
                    }else{
                        const childres = []
                        item.children.forEach(m=>{
                            const newd = m.children.filter(n=>{
                            if(n.meta.groupType){
                                return permissions.indexOf(n.meta.right) > -1 && n.meta.groupType === groupType
                            }
                            return permissions.indexOf(n.meta.right) > -1
                        })
                            if(newd.length != 0){
                                m.children = newd
                                childres.push(m)
                            }
                        })
                        if(childres.length > 0){
                            result.push(item)
                        }
                    }
                }else{
                    result.push(item)
                }
            }
        }
    })
    // 最后添加404页面 否则会在登陆成功后跳到404页面
    // result.push(errorPage)
    permissionsMenu[0].children = result
    return permissionsMenu
}
