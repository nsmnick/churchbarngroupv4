// https://css-tricks.com/using-css-transitions-auto-dimensions/#aa-technique-3-javascript
function collapseMenu(element) {
  const menu = element;
  const sectionHeight = menu.scrollHeight;

  // Temporarily disable all css transitions.
  const elementTransition = menu.style.transition;
  menu.style.transition = '';

  // On the next frame (as soon as the previous style change has taken effect),
  // explicitly set the element's height to its current pixel height, so we
  // aren't transitioning out of 'auto'.
  requestAnimationFrame(() => {
    menu.style.height = `${sectionHeight}px`;
    menu.style.transition = elementTransition;

    // On the next frame (as soon as the previous style change has taken effect),
    // have the element transition to height: 0.
    requestAnimationFrame(() => {
      menu.style.removeProperty('height');
    });
  });

  menu.setAttribute('data-collapsed', 'true');
}

function expandMenu(element) {
  const menu = element;
  const sectionHeight = menu.scrollHeight;
  menu.style.height = `${sectionHeight}px`;

  // Reset to initial height.
  menu.addEventListener('transitionend', function eventHandler() {
    menu.removeEventListener('transitionend', eventHandler);
    menu.style.height = 'auto';
  });

  menu.setAttribute('data-collapsed', 'false');
}

function toggleSubMenu(e) {
  const currMenu = e.currentTarget;

  if (window.innerWidth > 1024) {
    return;
  }

  if (!currMenu.parentNode.classList.contains('menu-item-has-children--open')) {
    e.preventDefault();

    // Collapse all other menus.
    document
      .getElementById('main-menu')
      .querySelectorAll('.menu-item-has-children--open')
      .forEach((menuEl) => {
        collapseMenu(menuEl.querySelector('.sub-menu'));
        menuEl.classList.remove('menu-item-has-children--open');
      });

    expandMenu(currMenu.nextElementSibling);
    currMenu.parentNode.classList.add('menu-item-has-children--open');
  } else if (currMenu.hasAttribute('href') === false) {
    collapseMenu(currMenu.nextElementSibling);
    currMenu.parentNode.classList.remove('menu-item-has-children--open');
  }
}

export default function initMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-toggle');
  const mainMenu = document.getElementById('main-menu');

  // Toggle mobile menu.
  mobileMenuButton.addEventListener('click', (e) => {
    e.preventDefault();
    mobileMenuButton.classList.toggle('mobile-menu-toggle--open');
    mainMenu.classList.toggle('main-menu--open');
  });

  // Toggle sub-menus.
  mainMenu.querySelectorAll('.menu-item-has-children > a').forEach((el) => {
    el.addEventListener('click', toggleSubMenu);
  });
}
