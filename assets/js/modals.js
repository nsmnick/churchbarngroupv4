import Cookies from 'js-cookie';

function showModal(modal) {
  setTimeout(() => {
    modal.classList.add('modal--show');
  }, parseInt(modal.dataset.delay, 10) || 0);
}

function closeModal(modal) {
  modal.classList.remove('modal--show');
  Cookies.set(`modal-suppress-${modal.id}`, true);
}

export default function initModals() {
  const modals = document.getElementsByClassName('modal');

  if (modals.length) {
    for (let i = 0; i < modals.length; i += 1) {
      // Show modal if suppress cookie not set.
      if (!Cookies.get(`modal-suppress-${modals[i].id}`)) {
        showModal(modals[i]);

        // Bind controls to modal.
        modals[i]
          .querySelector('.modal__overlay')
          .addEventListener('click', () => closeModal(modals[i]));

        modals[i]
          .querySelector('.modal__controls__close')
          .addEventListener('click', () => closeModal(modals[i]));
      }
    }
  }
}
