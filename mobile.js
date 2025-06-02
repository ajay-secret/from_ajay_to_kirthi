let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  initialX = 0;
  initialY = 0;
  currentX = 0;
  currentY = 0;
  offsetX = 0;
  offsetY = 0;
  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  touchId = null;
  
  constructor(paper) {
    if (!this.isMobile) {
      // Store initial transform for desktop version
      const style = window.getComputedStyle(paper);
      const transform = new DOMMatrix(style.transform);
      this.initialX = transform.m41;
      this.initialY = transform.m42;
      this.currentX = this.initialX;
      this.currentY = this.initialY;
    }
  }
  
  init(paper) {
    if (!this.isMobile) {
      // Desktop handling - keep original transform-based behavior
      const mouseStart = (e) => {
        if (this.holdingPaper) return;
        
        this.holdingPaper = true;
        paper.style.zIndex = highestZ++;
        
        // Get current transform values
        const style = window.getComputedStyle(paper);
        const transform = new DOMMatrix(style.transform);
        this.initialX = transform.m41;
        this.initialY = transform.m42;
        
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
        
        // Apply boundaries for desktop
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const paperRect = paper.getBoundingClientRect();
        const padding = 20;
        
        this.currentX = Math.max(-paperRect.width/2 + padding, 
                              Math.min(viewportWidth - paperRect.width/2 - padding, x));
        this.currentY = Math.max(padding, 
                              Math.min(viewportHeight - paperRect.height - padding, y));
        
        // Apply transform for desktop
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
      // Mobile touch handling with extended boundaries
      const touchStart = (e) => {
        if (!e.target.matches('input, textarea, select, button')) {
          e.preventDefault();
        }
        
        if (this.holdingPaper) return;
        
        const touch = e.touches[0];
        this.touchId = touch.identifier;
        
        // Calculate offset from touch position to paper's top-left corner
        const rect = paper.getBoundingClientRect();
        this.offsetX = touch.clientX - rect.left;
        this.offsetY = touch.clientY - rect.top;
        
        this.holdingPaper = true;
        paper.style.zIndex = highestZ++;
        paper.classList.add('moved');
        paper.style.transition = 'none';
        
        // Ensure paper is positioned absolutely for mobile
        paper.style.position = 'absolute';
      };

      const touchMove = (e) => {
        if (e.target === paper) {
          e.preventDefault();
        }
        
        if (!this.holdingPaper) return;
        
        const touch = Array.from(e.touches).find(t => t.identifier === this.touchId);
        if (!touch) return;
        
        // Calculate new position based on touch position and offset
        const x = touch.clientX - this.offsetX;
        const y = touch.clientY - this.offsetY;
        
        // Allow papers to go 75% outside the viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const paperRect = paper.getBoundingClientRect();
        const minX = -paperRect.width * 0.75; // Allow 75% of paper width outside left
        const maxX = viewportWidth - paperRect.width * 0.25; // Allow 75% of paper width outside right
        const minY = -paperRect.height * 0.75; // Allow 75% of paper height outside top
        const maxY = viewportHeight - paperRect.height * 0.25; // Allow 75% of paper height outside bottom
        
        const boundedX = Math.max(minX, Math.min(maxX, x));
        const boundedY = Math.max(minY, Math.min(maxY, y));
        
        // Set the new position directly for mobile
        paper.style.left = boundedX + 'px';
        paper.style.top = boundedY + 'px';
      };

      const touchEnd = () => {
        if (!this.holdingPaper) return;
        this.holdingPaper = false;
        this.touchId = null;
        paper.style.transition = 'all 0.2s ease-out';
      };

      paper.addEventListener('touchstart', touchStart, { passive: false });
      paper.addEventListener('touchmove', touchMove, { passive: false });
      paper.addEventListener('touchend', touchEnd, { passive: true });
      paper.addEventListener('touchcancel', touchEnd, { passive: true });
    }
  }
}

// Initialize papers
document.addEventListener("DOMContentLoaded", () => {
  const papers = document.querySelectorAll('.paper');
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  papers.forEach(paper => {
    if (isMobile) {
      // Mobile-specific setup
      paper.style.position = 'absolute';
      paper.style.margin = '0';
      paper.style.willChange = 'left, top';
    } else {
      // Desktop-specific setup
      paper.style.willChange = 'transform';
    }
    
    // Initialize paper handler
    new Paper(paper).init(paper);
  });
  
  if (isMobile) {
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

