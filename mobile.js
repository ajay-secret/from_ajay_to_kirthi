let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  initialX = 0;
  initialY = 0;
  currentX = 0;
  currentY = 0;
  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  lastTouchTime = 0;
  touchId = null;
  
  init(paper) {
    if (!this.isMobile) {
      // Desktop handling
      const mouseStart = (e) => {
        if (this.holdingPaper) return;
        
        this.holdingPaper = true;
        paper.style.zIndex = highestZ++;
        
        // Get current transform values
        const style = window.getComputedStyle(paper);
        const transform = new DOMMatrix(style.transform);
        this.initialX = transform.m41;
        this.initialY = transform.m42;
        
        this.currentX = this.initialX;
        this.currentY = this.initialY;
        
        // Store initial mouse position
        this.touchStartX = e.clientX;
        this.touchStartY = e.clientY;
        
        paper.classList.add('moved');
        paper.style.transition = 'none';
      };

      const mouseMove = (e) => {
        if (!this.holdingPaper) return;
        
        // Calculate the exact position based on mouse movement
        const dx = e.clientX - this.touchStartX;
        const dy = e.clientY - this.touchStartY;
        
        // Apply the transform
        const x = this.initialX + dx;
        const y = this.initialY + dy;
        
        // Apply boundaries
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const paperRect = paper.getBoundingClientRect();
        const padding = 20;
        
        this.currentX = Math.max(-paperRect.width/2 + padding, 
                              Math.min(viewportWidth - paperRect.width/2 - padding, x));
        this.currentY = Math.max(padding, 
                              Math.min(viewportHeight - paperRect.height - padding, y));
        
        paper.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
      };

      const mouseEnd = () => {
        if (!this.holdingPaper) return;
        this.holdingPaper = false;
        this.initialX = this.currentX;
        this.initialY = this.currentY;
        paper.style.transition = 'transform 0.2s ease-out';
      };

      paper.addEventListener('mousedown', mouseStart);
      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseEnd);
    } else {
      // Mobile touch handling (keep existing optimized code)
      const touchStart = (e) => {
        if (!e.target.matches('input, textarea, select, button')) {
          e.preventDefault();
        }
        
        if (this.holdingPaper) return;
        
        const touch = e.touches[0];
        this.touchId = touch.identifier;
        
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        
        const style = window.getComputedStyle(paper);
        const transform = new DOMMatrix(style.transform);
        this.initialX = transform.m41;
        this.initialY = transform.m42;
        
        this.holdingPaper = true;
        paper.style.zIndex = highestZ++;
        paper.classList.add('moved');
        paper.style.transition = 'none';
      };

      const touchMove = (e) => {
        if (e.target === paper) {
          e.preventDefault();
        }
        
        if (!this.holdingPaper) return;
        
        const touch = Array.from(e.touches).find(t => t.identifier === this.touchId);
        if (!touch) return;
        
        const dx = touch.clientX - this.touchStartX;
        const dy = touch.clientY - this.touchStartY;
        
        const x = this.initialX + dx;
        const y = this.initialY + dy;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const paperRect = paper.getBoundingClientRect();
        const padding = 10;
        
        const boundedX = Math.max(-paperRect.width/2 + padding, 
                                Math.min(viewportWidth - paperRect.width/2 - padding, x));
        const boundedY = Math.max(padding, 
                                Math.min(viewportHeight - paperRect.height - padding, y));
        
        paper.style.transform = `translate3d(${boundedX}px, ${boundedY}px, 0)`;
      };

      const touchEnd = () => {
        if (!this.holdingPaper) return;
        this.holdingPaper = false;
        this.touchId = null;
        paper.style.transition = 'transform 0.2s ease-out';
      };

      paper.addEventListener('touchstart', touchStart, { passive: false });
      paper.addEventListener('touchmove', touchMove, { passive: false });
      paper.addEventListener('touchend', touchEnd, { passive: true });
      paper.addEventListener('touchcancel', touchEnd, { passive: true });
    }
  }

  updateTransform(paper) {
    if (!paper) return;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const paperRect = paper.getBoundingClientRect();
    const padding = this.isMobile ? 10 : 20;
    
    // Calculate boundaries with initial position offset
    const initialLeft = paperRect.width / 2;
    const maxX = viewportWidth - paperRect.width + initialLeft - padding;
    const minX = -initialLeft + padding;
    
    this.currentPaperX = Math.max(
      minX,
      Math.min(maxX, this.currentPaperX)
    );
    this.currentPaperY = Math.max(
      padding,
      Math.min(viewportHeight - paperRect.height - padding, this.currentPaperY)
    );
    
    // Apply transform without interfering with initial position
    const baseTransform = window.getComputedStyle(paper).transform;
    const initialTransform = baseTransform === 'none' ? '' : baseTransform;
    
    paper.style.transform = `${initialTransform} translate3d(${this.currentPaperX}px, ${this.currentPaperY}px, 0)`;
  }
}

// Initialize papers with optimized event handling
document.addEventListener("DOMContentLoaded", () => {
  const papers = document.querySelectorAll('.paper');
  
  // Use a single instance for all papers to save memory
  const paperHandler = new Paper();
  
  papers.forEach(paper => {
    // Only set essential styles
    paper.style.willChange = 'transform';
    paperHandler.init(paper);
  });
  
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    // Minimal mobile setup
    document.body.style.overscrollBehavior = 'none';
    
    // Only prevent multi-touch
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
  }
});

// Simplified video handling
document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById('playVideoBtn');
  if (playButton) {
    playButton.addEventListener('click', () => {
      const video = document.getElementById('backgroundVideo');
      if (video) {
        video.style.display = 'block';
        video.play();
      }
    });
  }
});

// Simple book navigation
document.getElementById("openBookBtn")?.addEventListener("click", () => {
  window.location.href = "book/index.html";
});

