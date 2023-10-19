function getHiddenClass(element) {
  let hiddenClass = 'is-hidden';

  if (
    element.getAttribute('data-hidden') !== null &&
    element.getAttribute('data-hidden') !== ''
  ) {
    hiddenClass = element.target.getAttribute('data-hidden');
  }

  return hiddenClass;
}

export default function isHidden() {
  const elements = document.querySelectorAll('[data-hidden]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const hiddenClass = getHiddenClass(entry.target);

        if (!entry.isIntersecting) {
          entry.target.classList.add(hiddenClass);
        } else {
          entry.target.classList.remove(hiddenClass);
        }
      });
    });

    elements.forEach((el) => observer.observe(el));
  } else {
    // Is IntersectionObserver isn't supported, remove hidden class.
    elements.forEach((element) => {
      const hiddenClass = getHiddenClass(element);
      element.classList.remove(hiddenClass);
    });
  }
}
