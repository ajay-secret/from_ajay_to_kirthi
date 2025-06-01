// Prevent right click
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

// Prevent keyboard shortcuts for copy/paste
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
    e.preventDefault();
  }
});

let currentPage = 1;
let touchStartX = 0;
let touchEndX = 0;

function toggleClass(e, toggleClassName) {
  if (e.className.includes(toggleClassName)) {
    e.className = e.className.replace(" " + toggleClassName, "");
  } else {
    e.className += " " + toggleClassName;
  }
}

function movePage(e, page) {
  if (page == currentPage) {
    currentPage += 2;
    toggleClass(e, "left-side");
    toggleClass(e.nextElementSibling, "left-side");
    updatePageCounter();
  } else if (page == currentPage - 1) {
    currentPage -= 2;
    toggleClass(e, "left-side");
    toggleClass(e.previousElementSibling, "left-side");
    updatePageCounter();
  }
}

// Add touch event listeners
document.addEventListener("touchstart", function (e) {
  touchStartX = e.changedTouches[0].clientX;
});

document.addEventListener("touchend", function (e) {
  touchEndX = e.changedTouches[0].clientX;
  let diff = touchStartX - touchEndX;

  if (Math.abs(diff) > 50) { // Minimum swipe distance
    let pages = document.querySelectorAll(".page");
    if (diff > 0 && currentPage < pages.length) {
      movePage(pages[currentPage - 1], currentPage);
    } else if (diff < 0 && currentPage > 1) {
      movePage(pages[currentPage - 2], currentPage - 1);
    }
  }
});

// Create scattered text
function createScatteredText() {
  const container = document.querySelector('.scattered-text');
  const text = 'kirthiii';
  const numElements = 20;

  for (let i = 0; i < numElements; i++) {
    const element = document.createElement('div');
    element.className = 'text-element';
    element.textContent = text;
    
    element.style.left = `${Math.random() * 100}%`;
    element.style.top = `${Math.random() * 100}%`;
    
    const rotation = Math.random() * 360;
    const scale = 0.5 + Math.random() * 1;
    element.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    
    element.style.animationDelay = `${Math.random() * 20}s`;
    
    container.appendChild(element);
  }
}

// Update page counter
function updatePageCounter() {
  const counter = document.querySelector('.page-counter');
  const totalPages = document.querySelectorAll('.page').length;
  counter.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Initialize scattered text and counter
document.addEventListener('DOMContentLoaded', () => {
  createScatteredText();
  updatePageCounter();
});