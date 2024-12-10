import { createOptimizedPicture } from "../../scripts/aem.js";

export default function decorate(block) {
  /* Convert block children to carousel items */
  const ul = document.createElement("ul");
  ul.className = "carousel-main";

  [...block.children].forEach((row) => {
    const li = document.createElement("li");
    li.className = "carousel-item";
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector("picture"))
        div.className = "cards-card-image";
      else div.className = "cards-card-body";
    });
    ul.append(li);
  });

  ul.querySelectorAll("picture > img").forEach((img) =>
    img
      .closest("picture")
      .replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: "750" }])
      )
  );

  block.textContent = "";

  const carouselCards = document.createElement("div");
  carouselCards.className = "carousel-cards";

  const carouselDots = document.createElement("div");
  carouselDots.className = "carousel-dots";

  const prevButton = document.createElement("button");
  prevButton.className = "carousel-prev";
  prevButton.textContent = "‹";

  const nextButton = document.createElement("button");
  nextButton.className = "carousel-next";
  nextButton.textContent = "›";

  carouselCards.append(ul);
  carouselDots.append(prevButton, nextButton);

  block.append(carouselCards, carouselDots);

  let currentIndex = 0;
  const items = ul.querySelectorAll(".carousel-item");
  const itemsPerPage = 5;
  const slideInterval = 5000;
  let autoSlideInterval;

  const updateCarousel = () => {
    items.forEach((item, index) => {
      if (index >= currentIndex && index < currentIndex + itemsPerPage) {
        item.style.display = "block";
        item.style.opacity = "1";
      } else {
        item.style.opacity = "0";
        setTimeout(() => (item.style.display = "none"), 300);
      }
    });

    // Update active state of navigation buttons
    if (currentIndex === 0) {
      prevButton.classList.add("active");
    } else {
      prevButton.classList.remove("active");
    }

    if (currentIndex + itemsPerPage >= items.length) {
      nextButton.classList.add("active");
    } else {
      nextButton.classList.remove("active");
    }
  };

  const slideNext = () => {
    if (currentIndex + itemsPerPage < items.length) {
      currentIndex += itemsPerPage;
    } else {
      currentIndex = 0; // Loop back to start
    }
    updateCarousel();
  };

  const slidePrev = () => {
    if (currentIndex > 0) {
      currentIndex -= itemsPerPage;
    } else {
      currentIndex = Math.max(0, items.length - itemsPerPage);
    }
    updateCarousel();
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideInterval = setInterval(slideNext, slideInterval);
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideInterval);
  };

  prevButton.addEventListener("click", () => {
    slidePrev();
    startAutoSlide();
  });

  nextButton.addEventListener("click", () => {
    slideNext();
    startAutoSlide();
  });

  block.addEventListener("mouseover", stopAutoSlide);
  block.addEventListener("mouseout", startAutoSlide);

  updateCarousel();
  startAutoSlide();
}
