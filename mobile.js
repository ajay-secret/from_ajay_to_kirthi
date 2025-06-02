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
  rotation = 0;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  touchStartTime = 0;
  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  rafId = null;
  initialTouchDistance = 0;
  lastTouchTime = 0;
  touchId = null;
  
  init(paper) {
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
      const touchStart = (e) => {
        e.preventDefault();
        if (this.holdingPaper) return;
        
        const touch = e.touches[0];
        this.touchId = touch.identifier;
        const now = Date.now();
        
        if (now - this.lastTouchTime < 300) {
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
        
        paper.style.transition = 'none';
        paper.classList.add('moved');
      };

      const touchMove = (e) => {
        e.preventDefault();
        if (!this.holdingPaper) return;
        
        const touch = Array.from(e.touches).find(t => t.identifier === this.touchId);
        if (!touch) return;
        
        this.touchMoveX = touch.clientX;
        this.touchMoveY = touch.clientY;
        
        this.velX = (this.touchMoveX - this.prevTouchX) * 1.2;
        this.velY = (this.touchMoveY - this.prevTouchY) * 1.2;
        
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
        
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;
        
        requestAnimationFrame(() => {
          this.updateTransform(paper);
        });
      };

      const touchEnd = (e) => {
        if (!this.holdingPaper) return;
        
        const touches = Array.from(e.touches);
        if (!touches.some(t => t.identifier === this.touchId)) {
          this.holdingPaper = false;
          this.touchId = null;
          paper.style.transition = 'transform 0.2s ease-out';
        }
      };

      paper.addEventListener('touchstart', touchStart, { passive: false });
      paper.addEventListener('touchmove', touchMove, { passive: false });
      document.addEventListener('touchend', touchEnd, { passive: true });
      document.addEventListener('touchcancel', touchEnd, { passive: true });
    }
  }

  updateTransform(paper) {
    if (!paper) return;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const paperRect = paper.getBoundingClientRect();
    const padding = this.isMobile ? 10 : 20;
    
    this.currentPaperX = Math.max(
      -paperRect.width + padding,
      Math.min(viewportWidth - padding, this.currentPaperX)
    );
    this.currentPaperY = Math.max(
      padding,
      Math.min(viewportHeight - padding, this.currentPaperY)
    );
    
    const transform = `translate3d(${this.currentPaperX}px, ${this.currentPaperY}px, 0)`;
    paper.style.transform = transform;
  }
}

// Initialize papers
document.addEventListener("DOMContentLoaded", () => {
  const papers = document.querySelectorAll('.paper');
  papers.forEach(paper => {
    paper.style.willChange = 'transform';
    new Paper().init(paper);
  });
  
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    document.body.style.overscrollBehavior = 'none';
    document.body.style.touchAction = 'none';
    
    // Prevent zoom on double tap
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Prevent default touch behaviors except for inputs
    document.addEventListener('touchmove', (e) => {
      if (!e.target.matches('input, textarea')) {
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

