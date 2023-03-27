import { checkCollision } from "./utils";

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

export default Player