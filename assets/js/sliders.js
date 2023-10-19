import Swiper, { Navigation, Pagination } from 'swiper';

export default function initSliders() {
  // eslint-disable-next-line no-unused-vars
  const workImageSlider = new Swiper('.work-image-slider__slides-wrapper', {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    wrapperClass: 'work-image-slider__slides',
    slideClass: 'work-image-slider__slide',
    pagination: {
      el: '.work-image-slider__pagination',
      clickable: true,
      type: 'bullets',
      bulletActiveClass: 'work-image-slider__pagination__bullet--active',
      bulletClass: 'work-image-slider__pagination__bullet',
      bulletElement: 'div',
    },
    navigation: {
      nextEl: '.work-image-slider__nav-button--next',
      prevEl: '.work-image-slider__nav-button--prev',
    },
  });
}
