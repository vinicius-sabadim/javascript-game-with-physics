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


  function checkCollision(a, b) {
    const dx = a.collisionX - b.collisionX
    const dy = a.collisionY - b.collisionY
    const distance = Math.hypot(dy, dx)

    const sumOfRadii = a.collisionRadius + b.collisionRadius

    return [distance < sumOfRadii, distance, sumOfRadii, dx, dy]
  }

  class Obstacle {
    constructor(game) {
      this.game = game
      this.collisionX = Math.random() * this.game.width
      this.collisionY = Math.random() * this.game.height
      this.collisionRadius = 60
      this.image = document.getElementById('obstacles')
      this.spriteWidth = 250
      this.spriteHeight = 250
      this.width = this.spriteWidth
      this.height = this.spriteHeight
      this.spriteX = this.collisionX - this.width * 0.5
      this.spriteY = this.collisionY - this.height * 0.5 - 70
      this.frameX = Math.floor(Math.random() * 4)
      this.frameY = Math.floor(Math.random() * 3)
    }

    draw(context) {
      // Draw the obstacle image
      context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.spriteX, this.spriteY, this.width, this.height)

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

      // Check for collision with obstacles
      this.game.obstacles.forEach((obstacle) => {
        const [hasCollision, distance, sumOfRadii, dx, dy] = checkCollision(this, obstacle)

        if (hasCollision) {
          const unit_x = dx / distance
          const unit_y = dy / distance

          this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x
          this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y
        }
      })
    }
  }

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

  const game = new Game(canvas)
  game.init()

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.render(ctx)
    window.requestAnimationFrame(animate)
  }

  animate()
})