import Obstacle from "./Obstacle"
import Player from "./Player"

class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.topMargin = 260
    this.player = new Player(this)
    this.numberOfObstacles = 5
    this.obstacles = []
    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.5,
      pressed: false,
    }
    this.debug = true

    this.canvas.addEventListener("mousedown", (e) => {
      this.mouse = {
        x: e.offsetX,
        y: e.offsetY,
        pressed: true,
      }
    })

    this.canvas.addEventListener("mouseup", (e) => {
      this.mouse = {
        x: e.offsetX,
        y: e.offsetY,
        pressed: false,
      }
    })

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.mouse.pressed) {
        this.mouse.x = e.offsetX
        this.mouse.y = e.offsetY
      }
    })

    window.addEventListener("keydown", (e) => {
      if (e.key === 'd') this.debug = !this.debug
    })
  }

  render(context) {
    this.obstacles.forEach(obstacle => obstacle.draw(context))

    this.player.draw(context)
    this.player.update()
  }

  init() {
    let attempts = 0

    while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
      const testObstacle = new Obstacle(this)

      // Detect collision with other obstacles
      const overlap = this.obstacles.some(obstacle => {
        const dx = testObstacle.collisionX - obstacle.collisionX
        const dy = testObstacle.collisionY - obstacle.collisionY
        const distance = Math.hypot(dy, dx)
        const distanceBuffer = 100

        const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffer

        return distance < sumOfRadii
      })

      const margin = testObstacle.collisionRadius * 2

      // Checks for overlap and also the collision with the edges
      if (!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width &&
        testObstacle.collisionY > this.topMargin + margin && testObstacle.collisionY < this.height - margin) {
        this.obstacles.push(testObstacle)
      } else {
        attempts++
      }
    }
  }
}

export default Game