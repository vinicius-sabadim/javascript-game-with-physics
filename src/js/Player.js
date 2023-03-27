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
    this.image = document.getElementById("bull")
    this.spriteWidth = 255
    this.spriteHeight = 255
    this.width = this.spriteWidth
    this.height = this.spriteHeight
    this.spriteX = null
    this.spriteY = null
    this.frameX = 0
    this.frameY = 4
  }

  draw(context) {
    // Draw player image
    context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height)

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

  updateSpriteAnimationUsingTargetedPosition(targetX, targetY) {
    const angle = Math.atan2(targetY, targetX)

    if (angle < -2.74 || angle > 2.74) this.frameY = 6
    else if (angle < -1.96) this.frameY = 7
    else if (angle < -1.17) this.frameY = 0
    else if (angle < -0.39) this.frameY = 1
    else if (angle < 0.39) this.frameY = 2
    else if (angle < 1.17) this.frameY = 3
    else if (angle < 1.96) this.frameY = 4
    else if (angle < 2.74) this.frameY = 5
  }

  update() {
    this.dx = this.game.mouse.x - this.collisionX
    this.dy = this.game.mouse.y - this.collisionY

    this.updateSpriteAnimationUsingTargetedPosition(this.dx, this.dy)

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

    // Update coordinates for the sprite
    this.spriteX = this.collisionX - this.width * 0.5
    this.spriteY = this.collisionY - this.height * 0.5 - 100

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