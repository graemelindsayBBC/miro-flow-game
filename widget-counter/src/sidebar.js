function showStatistics(stickers) {
  clear()
  const statByType = calcByType(stickers)
  getContainer().appendChild(createStatTable('by State', 'GG Looks like the selection is empty.', statByType))
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

  if (data && data.size > 0) {
    data.forEach((value, key) => {
      let itemView = document.createElement('div')
      itemView.className = 'stat-list__item'
      itemView.innerHTML =
        `<span class="stat-list__item-name">${key.toLowerCase()}</span>` +
        `<span class="stat-list__item-value">${value}</span>`
      statView.appendChild(itemView)
    })
  } else {
    const emptyView = document.createElement('div')
    emptyView.className = 'stat-list__empty'
    emptyView.innerText = emptyText
    statView.appendChild(emptyView)
  } 
  return statView
}

function calcByType(stickers) {
  return countChildrenBy(stickers, (a) => a.title)
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

async function countChildrenBy(stickers) {
  const stickerIds = stickers.map(sticker => sticker.id)
  const countByFrame = new Map()
  const frames = await miro.board.widgets.get({ type: "frame" })
  frames.forEach(frame => {
    frame.childrenIds.forEach(childId => {
      if (stickerIds.includes(childId)) {
        let currentCount = countByFrame.get(frame.id)
        countByFrame.set(frame.title, !currentCount ? 1 : currentCount + 1)
      }
    })
  })
  return countByFrame
}

miro.onReady(() => {
  miro.addListener('SELECTION_UPDATED', (e) => {
    showStatistics(e.data)
  })
  refresh()
})

function refresh() {
  miro.board.widgets.get({type: "sticker"}).then(showStatistics)
}
