import Game from "./Game"

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1")
  const ctx = canvas.getContext("2d")

  // Set canvas size
  canvas.width = 1280
  canvas.height = 720

  // Change default styles of context
  ctx.fillStyle = "white"
  ctx.lineWidth = 3
  ctx.strokeStyle = "white"

  const game = new Game(canvas)
  game.init()

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.render(ctx)
    window.requestAnimationFrame(animate)
  }

  animate()
})