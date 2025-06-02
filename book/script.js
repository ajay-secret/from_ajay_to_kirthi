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
  } else if (page == currentPage - 1) {
    currentPage -= 2;
    toggleClass(e, "left-side");
    toggleClass(e.previousElementSibling, "left-side");
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