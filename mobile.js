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
  rotation = 0; // Remove random rotation for better performance
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  touchStartTime = 0;
  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  rafId = null;
  initialTouchDistance = 0;
  lastTouchTime = 0;
  
  init(paper) {
    // Desktop events
    if (!this.isMobile) {
      document.addEventListener('mousemove', (e) => {
        if (!this.rotating && this.holdingPaper) {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
          this.velX = (this.mouseX - this.prevMouseX);
          this.velY = (this.mouseY - this.prevMouseY);
          
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
    } else {
      // Optimized mobile touch handling
      paper.addEventListener('touchstart', (e) => {
        if (this.holdingPaper) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const now = Date.now();
        
        // Detect double tap
        if (now - this.lastTouchTime < 300) {
          // Reset position on double tap
          this.currentPaperX = 0;
          this.currentPaperY = 0;
          this.updateTransform(paper);
          this.lastTouchTime = 0;
          return;
        }
        
        this.lastTouchTime = now;
        this.holdingPaper = true;
        this.touchStartTime = now;
        
        paper.style.zIndex = highestZ++;
        
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.prevTouchX = this.touchStartX;
        this.prevTouchY = this.touchStartY;
        
        // Remove transition for immediate response
        paper.style.transition = 'none';
        paper.classList.add('moved');
      }, { passive: false });

      paper.addEventListener('touchmove', (e) => {
        if (!this.holdingPaper) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        
        // Calculate velocity with reduced sensitivity
        this.touchMoveX = touch.clientX;
        this.touchMoveY = touch.clientY;
        
        // Reduce movement sensitivity and apply smoothing
        const sensitivity = 0.7;
        this.velX = (this.touchMoveX - this.prevTouchX) * sensitivity;
        this.velY = (this.touchMoveY - this.prevTouchY) * sensitivity;
        
        // Apply movement with boundaries
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
        
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;
        
        // Use requestAnimationFrame for smooth updates
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
        }
        
        this.rafId = requestAnimationFrame(() => {
          this.updateTransform(paper);
        });
      }, { passive: false });

      paper.addEventListener('touchend', () => {
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
        }
        
        this.holdingPaper = false;
        this.rotating = false;
        this.rafId = null;
        
        // Add back transition for smooth settling
        paper.style.transition = 'transform 0.2s ease-out';
      });
    }
  }

  updateTransform(paper) {
    // Limit boundaries with padding
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const paperRect = paper.getBoundingClientRect();
    const padding = 20;
    
    this.currentPaperX = Math.max(
      -paperRect.width + padding,
      Math.min(viewportWidth - padding, this.currentPaperX)
    );
    this.currentPaperY = Math.max(
      -paperRect.height + padding,
      Math.min(viewportHeight - padding, this.currentPaperY)
    );
    
    // Use transform3d for hardware acceleration
    paper.style.transform = this.isMobile ? 
      `translate3d(${this.currentPaperX}px, ${this.currentPaperY}px, 0)` :
      `translate3d(${this.currentPaperX}px, ${this.currentPaperY}px, 0) rotate(${this.rotation}deg)`;
  }
}

// Initialize papers with optimized event handling
document.addEventListener("DOMContentLoaded", () => {
  const papers = document.querySelectorAll('.paper');
  papers.forEach(paper => {
    // Add will-change to optimize performance
    paper.style.willChange = 'transform';
    new Paper().init(paper);
  });
  
  // Optimize mobile scrolling and touch behavior
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    document.body.style.overscrollBehavior = 'none';
    document.body.style.touchAction = 'none';
    
    // Prevent default touch behaviors
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 1) e.preventDefault();
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

