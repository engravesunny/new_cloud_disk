/**
 *
 * 将列表的数据转化为树形数据 => 递归算法 => 自身调用自身 => 一定条件不能一样，否则会死循环
 * 遍历树形 先找一个头部
 */
export function transform(list, rootValue) {
    var arr = []
    list.forEach(item => {
      if (item.parent_id === rootValue) {
        // 找到之后再找item下有没有子节点
        const children = transform(list, item.id) // 返回的是子节点的子节点的数组
        if (children.length) {
          // 如果children的长度大于0 说明找到了子节点
          item.children = children
        }
        arr.push(item) // 将内容加入数组中
      }
    })
    return arr
  }