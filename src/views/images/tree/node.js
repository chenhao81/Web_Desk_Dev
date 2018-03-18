// 判断是否叶子节点
const isLeaf = (data, prop) => {
  return !(Array.isArray(data[prop]) && data[prop].length > 0)
}

// 创建 node 节点
export const renderNode = (h, data, context) => {
  const { props } = context
  const cls = ['org-tree-node']
  const childNodes = []
  const children = data[props.props.children]

  if (isLeaf(data, props.props.children)) {
    cls.push('is-leaf')
  } else if (props.collapsable && !data[props.props.expand]) {
    cls.push('collapsed')
  }

  childNodes.push(renderLabel(h, data, context))

  if (!props.collapsable || data[props.props.expand]) {
    childNodes.push(renderChildren(h, children, context))
  }

  return h('div', {
    domProps: {
      className: cls.join(' ')
    }
  }, childNodes)
}

// 创建展开折叠按钮
export const renderBtn = (h, data, context) => {
  const { props } = context
  const expandHandler = context.listeners['on-expand']

  const cls = ['org-tree-node-btn']

  if (data[props.props.expand]) {
    cls.push('expanded')
  }

  return h('span', {
    domProps: {
      className: cls.join(' ')
    },
    on: {
      click: e => {
        e.stopPropagation()
        expandHandler && expandHandler(data)
      }
    }
  })
}
let n = 0
// 创建 label 节点
export const renderLabel = (h, data, context) => {
  // let show = false
  const { props } = context
  const label = data[props.props.label]
  const renderContent = props.renderContent
  // console.log(context)
  // const clickHandler = context.listeners['on-node-click']

  const childNodes = []
  if (typeof renderContent === 'function') {
    const vnode = renderContent(h, data)

    vnode && childNodes.push(vnode)
  } else {
    childNodes.push(label)
  }

  if (props.collapsable && !isLeaf(data, props.props.children)) {
    childNodes.push(renderBtn(h, data, context))
  }

  const cls = ['org-tree-node-label-inner']
  let { labelWidth, labelClassName } = props
  if (typeof labelWidth === 'number') {
    labelWidth += 'px'
  }
  if (typeof labelClassName === 'function') {
    labelClassName = labelClassName(data)
  }
  labelClassName && cls.push(labelClassName)
  ++n
  return h('div',
    {
      domProps: {
        className: 'org-tree-node-label'
      }
    },
    [
      h('div', {
        domProps: {
          className: `controlContainer l${n}`
        },
        functional: true
      }, [
        h('button', {
          domProps: {
            className: cls.join(' ')
            // className: `l${n}`
          },
          style: { width: labelWidth },
          on: {
            click: e => {
              // console.log(e)
              // console.log(data)
              // console.log(clickHandler)
              // console.log(show)
              // clickHandler && clickHandler(e, data)
              // show = !show
              // console.log(`l${n}`)
              // document.getElementsByClassName("div")[0].children[0]
              // if()
              // console.log(e.target.nextSibling.className)
              // if (e.target.nextSibling.className.indexOf('actionHide')) {
              //   e.target.nextSibling.className('actionContainer actionShow')
              // } else {
              //   e.target.nextSibling.className('actionContainer actionHide')
              // }
              if (e.target.nextSibling.style.display === 'none') {
                e.target.nextSibling.style.display = 'inline-block'
              } else {
                e.target.nextSibling.style.display = 'none'
              }
            }
          }
        }, childNodes),
        h('div',
          {
            domProps: {
              className: 'actionContainer actionHide'
            },
            style: { width: labelWidth, display: 'none' }
          }, [
            h('span', {
              domProps: {
                className: 'action'
              }
            }, '编辑'),
            h('span', {
              domProps: {
                className: 'action'
              }
            }, '复制'),
            h('span', {
              domProps: {
                className: 'action'
              }
            }, '下载'),
            h('span', {
              domProps: {
                className: 'action'
              }
            }, '删除')
          ],
          '')
      ], '')
    ])
}

// 创建 node 子节点
export const renderChildren = (h, list, context) => {
  // console.log(list)
  // console.log(context)
  if (Array.isArray(list) && list.length) {
    const children = list.map(item => {
      return renderNode(h, item, context)
    })

    return h('div', {
      domProps: {
        className: 'org-tree-node-children'
      }
    }, children)
  }
  return ''
}

export const render = (h, context) => {
  const { props } = context
  return renderNode(h, props.data, context)
}

export default render
