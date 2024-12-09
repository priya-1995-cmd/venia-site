import { createOptimizedPicture } from "../../scripts/aem.js";

export default function decorate(block) {
  /* change to ul, li */
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
  prevButton.textContent = "";

  const nextButton = document.createElement("button");
  nextButton.className = "carousel-next";
  nextButton.textContent = "";

  carouselCards.append(ul);
  carouselDots.append(prevButton, nextButton);

  block.append(carouselCards, carouselDots);

  // Carousel functionality
  let currentIndex = 0;
  const items = ul.querySelectorAll(".carousel-item");
  const itemsPerPage = 5;

  const updateCarousel = () => {
    items.forEach((item, index) => {
      if (index >= currentIndex && index < currentIndex + itemsPerPage) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  };

  prevButton.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - itemsPerPage);
    updateCarousel();
  });

  nextButton.addEventListener("click", () => {
    currentIndex = Math.min(
      items.length - itemsPerPage,
      currentIndex + itemsPerPage
    );
    updateCarousel();
  });

  // Initialize carousel
  updateCarousel();
}
