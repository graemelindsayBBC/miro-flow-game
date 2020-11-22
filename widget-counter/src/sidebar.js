function showStatistics(selection) {
  clear()
  const statByType = calcByType(selection)
  getContainer().appendChild(createStatTable('by Type', 'GG Looks like the selection is empty.', statByType))
}

function clear() {
  const elements = getContainer().getElementsByClassName('stat-list__table')
  for (let i = 0; i < elements.length; i++) {
    elements.item(i).remove()
  }
}

function getContainer() {
  return document.getElementById('stat-container')
}

function createStatTable(title, emptyText, data) {
  const statView = document.createElement('div')
  statView.className = 'stat-list__table'

  const titleView = document.createElement('div')
  titleView.className = 'stat-list__title'
  titleView.innerHTML = `<span>${title}</span>`
  statView.appendChild(titleView)

  if (data.size === 0) {
    const emptyView = document.createElement('div')
    emptyView.className = 'stat-list__empty'
    emptyView.innerText = emptyText
    statView.appendChild(emptyView)
  } else {
    data.forEach((value, key) => {
      let itemView = document.createElement('div')
      itemView.className = 'stat-list__item'
      itemView.innerHTML =
        `<span class="stat-list__item-name">${key.toLowerCase()}</span>` +
        `<span class="stat-list__item-value">${value}</span>`
      statView.appendChild(itemView)
    })
  }
  return statView
}

function calcByType(widgets) {
  return countChildrenBy(widgets, (a) => a.title)
}

function countBy(list, keyGetter) {
  const map = new Map()
  list.forEach((item) => {
    const key = keyGetter(item)
    const count = map.get(key)
    map.set(key, !count ? 1 : count + 1)
  })
  return new Map([...map.entries()].sort((a, b) => b[1] - a[1]))
}

function countChildrenBy(list, keyGetter) {
  const FILTER = "sticker"
  const map = new Map()
  list.forEach((item) => {
    const children = new Array()
    item.childrenIds.forEach((childId) => {
      miro.board.widgets.get({id: childId}).then((filterMatches) => {
        if (filterMatches.length == 0) {
          child = filterMatches[0]
          if (FILTER.equalsIgnoreCase(child.type)) {
            children.push(child)
          }
        }
      })
    })
    const key = keyGetter(item)
    map.set(key, children.length)
  })
  return map
}

miro.onReady(() => {
  miro.addListener('SELECTION_UPDATED', (e) => {
    showStatistics(e.data)
  })
  miro.board.widgets.get({type: "frame"}).then(showStatistics)
})
