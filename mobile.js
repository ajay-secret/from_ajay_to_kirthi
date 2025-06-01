let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    

    document.addEventListener('mousemove', (e) => {
      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
      }
    });

    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
      if (e.button === 2) this.rotating = true;
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches.length > 1) {
        this.rotating = true;
      }
      this.touchMoveX = e.touches[0].clientX;
      this.touchMoveY = e.touches[0].clientY;
      this.velX = this.touchMoveX - this.prevTouchX;
      this.velY = this.touchMoveY - this.prevTouchY;
      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
      this.prevTouchX = this.touchMoveX;
      this.prevTouchY = this.touchMoveY;
      if (this.holdingPaper) {
        paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
      }
    }, { passive: false });

    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

// Ensure DOM is fully loaded before initializing papers
document.addEventListener("DOMContentLoaded", () => {
  const papers = document.querySelectorAll('.paper');
  papers.forEach(paper => new Paper().init(paper));
});

// Video Button Click Handling
document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById('playVideoBtn');
  if (playButton) {
    playButton.addEventListener('click', () => {
      const videoContainer = document.getElementById('videoContainer');
      const video = document.getElementById('backgroundVideo');
      videoContainer.style.display = 'block';
      video.play();
      video.requestFullscreen();
    });
  }
});


// Ensure button z-index is lower than dragged papers
document.querySelectorAll('.paper').forEach(paper => {
  paper.addEventListener('mousedown', () => {
    document.getElementById('playVideoBtn').style.zIndex = highestZ - 1;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("openBookBtn").addEventListener("click", () => {
    window.location.href = "book/index.html";
  });
});

// Handle paper movement
document.querySelectorAll('.paper, .video-layer').forEach(element => {
  element.addEventListener('mousedown', () => {
    element.classList.add('moved');
  });
});

