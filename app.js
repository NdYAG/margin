import { validFileType } from './file.js'

const config = {
  background: 'black',
  container: {
    width: Math.min(screen.width, 640) - 32
  }
}
const app = document.querySelector('#app')
let canvas

function drawImage(canvas, image, options) {
  const { width, height } = image
  const ratio = width / height
  /*
    iOS Safari "Canvas area exceeds the maximum limit (width * height > 16777216)"
   */
  const canvasSize = Math.min(Math.max(width, height), 4096)
  canvas.width = canvasSize
  canvas.height = canvasSize

  const context = canvas.getContext('2d')
  let xpos, ypos, scaleRatio
  if (ratio > 1) {
    xpos = 0
    ypos = (canvasSize - height) / 2
    scaleRatio = options.container.width / width
  } else {
    xpos = (canvasSize - width) / 2
    ypos = 0
    scaleRatio = options.container.width / height
  }
  context.fillStyle = options.background
  context.fillRect(0, 0, canvasSize, canvasSize)
  context.drawImage(image, xpos, ypos)

  canvas.style = `
transform: scale(${scaleRatio});
transform-origin: 0 0
`
  app.querySelector('.Canvas').style.width = `${options.container.width}px`
  app.querySelector('.Canvas').style.height = `${options.container.width}px`
}

function drawImageFile(file, options = config) {
  if (!validFileType(file)) {
    throw new Error('File not supported.')
  }
  const url = URL.createObjectURL(file)
  const image = new Image()
  image.src = url
  image.onload = () => {
    if (!canvas) {
      canvas = document.createElement('canvas')
      app.querySelector('.Canvas').appendChild(canvas)
    }
    drawImage(canvas, image, options)
    canvas.toBlob(blob => {
      app.querySelector('.Export').href = URL.createObjectURL(blob)
      app.querySelector('.Export').download = file.name
    })
  }
}

document.querySelector('.Upload').addEventListener('change', e => {
  const { files } = e.target
  if (files.length) {
    drawImageFile(files[0])
    app.querySelector('.Controls').classList.add('Controls--active')
  }
})

document.querySelector('.Controls__colors').addEventListener('click', e => {
  if (e.target.classList.contains('Background')) {
    const { files } = document.querySelector('.Upload')
    if (files.length) {
      const { color: background } = e.target.dataset
      drawImageFile(files[0], Object.assign({}, config, { background }))
    }
  }
})

document.querySelector('.Export').addEventListener('click', e => {
  window.location = e.target.getAttribute('href')
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(
    registration => {
      console.log(
        'ServiceWorker registration successful with scope: ',
        registration.scope
      )
    },
    err => {
      console.log('ServiceWorker registration failed: ', err)
    }
  )
}
