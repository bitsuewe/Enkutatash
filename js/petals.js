/**
 * ADEY ABEBA FALLING PETALS CANVAS ENGINE
 * Creates ambient floating golden petals drifting gracefully across the screen.
 */

class AdeyPetalsEngine {
  constructor(canvasId = 'petals-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.maxPetals = 36;
    this.animationId = null;

    // Golden Adey Abeba color palette for petals
    this.petalColors = [
      '#FFD54F',
      '#FFCA28',
      '#FFC107',
      '#FFB300',
      '#FFE082'
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Populate initial petals
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.createPetal(true));
    }

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createPetal(randomY = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -20,
      size: 10 + Math.random() * 12,
      color: this.petalColors[Math.floor(Math.random() * this.petalColors.length)],
      speedY: 0.8 + Math.random() * 1.4,
      speedX: -0.5 + Math.random() * 1.0,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      swayFrequency: 0.015 + Math.random() * 0.02,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: 0.55 + Math.random() * 0.4
    };
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.angle);
    this.ctx.globalAlpha = p.opacity;

    // Draw an elongated oval Adey Abeba petal
    this.ctx.fillStyle = p.color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, p.size * 0.45, p.size, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Subtle central vein highlight
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -p.size * 0.7);
    this.ctx.lineTo(0, p.size * 0.7);
    this.ctx.stroke();

    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];

      // Update position with natural horizontal swaying
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.y * p.swayFrequency + p.swayOffset) * 0.7;
      p.angle += p.rotationSpeed;

      // Reset when falling past viewport bottom
      if (p.y > this.canvas.height + 25 || p.x < -30 || p.x > this.canvas.width + 30) {
        this.petals[i] = this.createPetal(false);
      }

      this.drawPetal(p);
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  // Trigger burst of confetti/petals for celebration
  burst() {
    for (let i = 0; i < 40; i++) {
      const p = this.createPetal(false);
      p.x = this.canvas.width / 2 + (Math.random() - 0.5) * 200;
      p.y = this.canvas.height * 0.35 + (Math.random() - 0.5) * 150;
      p.speedY = 2 + Math.random() * 4;
      p.speedX = (Math.random() - 0.5) * 8;
      p.size = 14 + Math.random() * 10;
      this.petals.push(p);
    }
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.adeyPetals = new AdeyPetalsEngine('petals-canvas');
});
