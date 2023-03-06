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

  class Obstacle {
    constructor(game) {
      this.game = game
      this.collisionX = Math.random() * this.game.width
      this.collisionY = Math.random() * this.game.height
      this.collisionRadius = 60
    }

    draw(context) {
      // Draw the circle
      context.beginPath()
      context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
      context.save()
      context.globalAlpha = 0.5
      context.fill()
      context.restore()
      context.stroke()
    }
  }

  class Player {
    constructor(game) {
      this.game = game
      this.collisionX = this.game.width * 0.5
      this.collisionY = this.game.height * 0.5
      this.collisionRadius = 30
      this.speedX = 0
      this.speedY = 0
      this.dx = null
      this.dy = null
      this.speedModifier = 5
    }

    draw(context) {
      // Draw the circle
      context.beginPath()
      context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
      context.save()
      context.globalAlpha = 0.5
      context.fill()
      context.restore()
      context.stroke()

      // Draw the line where the player wants to move
      context.beginPath()
      context.moveTo(this.collisionX, this.collisionY)
      context.lineTo(this.game.mouse.x, this.game.mouse.y)
      context.stroke()
    }

    update() {
      this.dx = this.game.mouse.x - this.collisionX
      this.dy = this.game.mouse.y - this.collisionY
      const distance = Math.hypot(this.dy, this.dx)
      if (distance > this.speedModifier) {
        this.speedX = this.dx / distance || 0
        this.speedY = this.dy / distance || 0
      } else {
        this.speedX = 0
        this.speedY = 0
      }
      this.collisionX += this.speedX * this.speedModifier
      this.collisionY += this.speedY * this.speedModifier
    }
  }

  class Game {
    constructor(canvas) {
      this.canvas = canvas
      this.width = this.canvas.width
      this.height = this.canvas.height
      this.player = new Player(this)
      this.numberOfObstacles = 5
      this.obstacles = []
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.5,
        pressed: false,
      }

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
    }

    render(context) {
      this.player.draw(context)
      this.player.update()
      this.obstacles.forEach(obstacle => obstacle.draw(context))
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

          const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius

          return distance < sumOfRadii
        })

        if (!overlap) {
          this.obstacles.push(testObstacle)
        } else {
          attempts++
        }
      }
    }
  }

  const game = new Game(canvas)
  game.init()

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.render(ctx)
    window.requestAnimationFrame(animate)
  }

  animate()
})