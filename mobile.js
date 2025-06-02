let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  offsetX = 0;
  offsetY = 0;
  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  touchId = null;
  
  init(paper) {
    if (!this.isMobile) {
      // Desktop handling
      const mouseStart = (e) => {
        if (this.holdingPaper) return;
        
        this.holdingPaper = true;
        paper.style.zIndex = highestZ++;
        
        // Calculate offset from mouse position to paper's top-left corner
        const rect = paper.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;
        
        // Store initial position
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        paper.classList.add('moved');
        paper.style.transition = 'none';
      };

      const mouseMove = (e) => {
        if (!this.holdingPaper) return;
        
        // Calculate new position based on cursor position and offset
        const x = e.clientX - this.offsetX;
        const y = e.clientY - this.offsetY;
        
        // Apply boundaries
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const paperRect = paper.getBoundingClientRect();
        const padding = 20;
        
        const boundedX = Math.max(padding, 
                              Math.min(viewportWidth - paperRect.width - padding, x));
        const boundedY = Math.max(padding, 
                              Math.min(viewportHeight - paperRect.height - padding, y));
        
        // Set the new position directly
        paper.style.position = 'absolute';
        paper.style.left = boundedX + 'px';
        paper.style.top = boundedY + 'px';
      };

      const mouseEnd = () => {
        if (!this.holdingPaper) return;
        this.holdingPaper = false;
        paper.style.transition = 'all 0.2s ease-out';
      };

      paper.addEventListener('mousedown', mouseStart);
      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseEnd);
    } else {
      // Mobile touch handling
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
        
        // Store initial position
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        
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
        
        // Calculate new position based on touch position and offset
        const x = touch.clientX - this.offsetX;
        const y = touch.clientY - this.offsetY;
        
        // Apply boundaries
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const paperRect = paper.getBoundingClientRect();
        const padding = 10;
        
        const boundedX = Math.max(padding, 
                              Math.min(viewportWidth - paperRect.width - padding, x));
        const boundedY = Math.max(padding, 
                              Math.min(viewportHeight - paperRect.height - padding, y));
        
        // Set the new position directly
        paper.style.position = 'absolute';
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
  
  papers.forEach(paper => {
    // Set initial styles
    paper.style.position = 'absolute';
    paper.style.margin = '0';
    paper.style.willChange = 'left, top';
    
    // Initialize paper handler
    new Paper().init(paper);
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

