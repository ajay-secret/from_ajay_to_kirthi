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
  touchStartTime = 0;
  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  init(paper) {
    if (!this.isMobile) {
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
          this.updateTransform(paper);
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
    }

    // Touch events with improved handling
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      e.preventDefault();
      this.holdingPaper = true;
      this.touchStartTime = Date.now();
      paper.style.zIndex = highestZ++;
      
      if (e.touches.length === 1) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.prevTouchX = this.touchStartX;
        this.prevTouchY = this.touchStartY;
      }
    });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.holdingPaper) return;

      if (e.touches.length === 1) {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;
        
        // Add some resistance to movement
        this.velX = (this.touchMoveX - this.prevTouchX) * 0.8;
        this.velY = (this.touchMoveY - this.prevTouchY) * 0.8;
        
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
        
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;
        
        this.updateTransform(paper);
      } else if (e.touches.length === 2) {
        // Handle pinch-to-zoom or rotation in the future if needed
        this.rotating = true;
      }
    }, { passive: false });

    paper.addEventListener('touchend', (e) => {
      const touchDuration = Date.now() - this.touchStartTime;
      
      // Handle tap events (if duration is less than 200ms)
      if (touchDuration < 200) {
        // Trigger tap event if needed
        paper.click();
      }
      
      this.holdingPaper = false;
      this.rotating = false;
    });
  }

  updateTransform(paper) {
    // Limit the movement within viewport bounds
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const paperRect = paper.getBoundingClientRect();
    
    this.currentPaperX = Math.max(-paperRect.width/2, Math.min(viewportWidth - paperRect.width/2, this.currentPaperX));
    this.currentPaperY = Math.max(-paperRect.height/2, Math.min(viewportHeight - paperRect.height/2, this.currentPaperY));
    
    paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
  }
}

// Initialize papers
document.addEventListener("DOMContentLoaded", () => {
  const papers = document.querySelectorAll('.paper');
  papers.forEach(paper => new Paper().init(paper));
  
  // Prevent default touch behavior on mobile
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    document.body.style.overscrollBehavior = 'none';
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
  }
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
      if (document.documentElement.requestFullscreen) {
        video.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
    });
  }
});

// Book button handling
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
  
  element.addEventListener('touchstart', () => {
    element.classList.add('moved');
  });
});

