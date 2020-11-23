function showStatistics(stickers) {
  clear()
  let statByType = await calcByType(stickers)
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
  return miro.board.widgets.get({ type: "frame" }).then(frames => {
    frames.forEach(frame => {
      frame.childrenIds.forEach(childId => {
        if (stickerIds.includes(childId)) {
          let currentCount = countByFrame.get(frame.id)
          countByFrame.set(frame.id, !currentCount ? 1 : currentCount + 1)
          return countByFrame
        }
      })
    })
  })
}




//   const FILTER = "sticker"
//   const map = new Map()
//   const allStickers = new Array()
//   miro.board.widgets.get({type: FILTER}).then((stickers) => {




//   list.forEach((item) => {
//     item.childrenIds.forEach((childId) => {
//       miro.board.widgets.get({id: childId}).then((filterMatches) => {
//         if (filterMatches.length == 1) {
//           let child = filterMatches[0]
//           if (FILTER.localeCompare(child.type, undefined, { sensitivity: 'accent' }) === 0) {
//             const key = keyGetter(item)
//             let childCount = map.get(key)
//             if (!childCount) {
//               childCount = 0
//             }
//             map.set(key, childCount++)
//           }
//         }
//       })
//     })
//   })
//   return map
// }

miro.onReady(() => {
  miro.addListener('SELECTION_UPDATED', (e) => {
    showStatistics(e.data)
  })
  miro.board.widgets.get({type: "sticker"}).then(showStatistics)
})
