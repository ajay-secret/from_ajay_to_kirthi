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
  rafId = null;

  init(paper) {
    // Desktop events
    if (!this.isMobile) {
      document.addEventListener('mousemove', (e) => {
        if (!this.rotating && this.holdingPaper) {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
          this.velX = (this.mouseX - this.prevMouseX) * 0.8; // Add resistance
          this.velY = (this.mouseY - this.prevMouseY) * 0.8;
          
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
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
        
        paper.classList.add('moved');
      });

      window.addEventListener('mouseup', () => {
        this.holdingPaper = false;
        this.rotating = false;
      });
    }

    // Touch events with optimized handling
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
        paper.classList.add('moved');
      }
    });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.holdingPaper) return;

      if (e.touches.length === 1) {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;
        
        // Smoother movement with reduced sensitivity
        this.velX = (this.touchMoveX - this.prevTouchX) * 0.5;
        this.velY = (this.touchMoveY - this.prevTouchY) * 0.5;
        
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
        
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;
        
        // Use requestAnimationFrame for smoother updates
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
        }
        this.rafId = requestAnimationFrame(() => {
          this.updateTransform(paper);
        });
      }
    }, { passive: false });

    paper.addEventListener('touchend', () => {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
      this.holdingPaper = false;
      this.rotating = false;
      this.rafId = null;
    });
  }

  updateTransform(paper) {
    // Limit the movement within viewport bounds with padding
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const paperRect = paper.getBoundingClientRect();
    const padding = 20; // Padding from viewport edges
    
    this.currentPaperX = Math.max(
      -paperRect.width + padding,
      Math.min(viewportWidth - padding, this.currentPaperX)
    );
    this.currentPaperY = Math.max(
      -paperRect.height + padding,
      Math.min(viewportHeight - padding, this.currentPaperY)
    );
    
    // Use transform3d for better performance
    paper.style.transform = `translate3d(${this.currentPaperX}px, ${this.currentPaperY}px, 0) rotate(${this.rotation}deg)`;
  }
}

// Initialize papers with optimized event handling
document.addEventListener("DOMContentLoaded", () => {
  const papers = document.querySelectorAll('.paper');
  papers.forEach(paper => new Paper().init(paper));
  
  // Prevent default touch behavior on mobile
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    document.body.style.overscrollBehavior = 'none';
    document.body.style.touchAction = 'none';
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

