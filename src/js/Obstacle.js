class Obstacle {
  constructor(game) {
    this.game = game
    this.collisionX = Math.random() * this.game.width
    this.collisionY = Math.random() * this.game.height
    this.collisionRadius = 40
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
    if (this.game.debug) {
      context.beginPath()
      context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
      context.save()
      context.globalAlpha = 0.5
      context.fill()
      context.restore()
      context.stroke()
    }
  }
}

export default Obstacle