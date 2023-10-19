import initMenu from './main-menu';
import isHidden from './is-hidden';
import initVue from './vue/init';
import initSliders from './sliders';
import initModals from './modals';

function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(() => {
  initMenu();
  initVue();

  // Animate on scroll.
  isHidden();

  // Enable swiper panels.
  initSliders();

  initModals();
});
