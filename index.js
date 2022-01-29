import MandatorySmile from './smile';

customElements.define("mandatory-smile", MandatorySmile);

const form = document.getElementById('form');
form.addEventListener('submit', evt => {
  evt.preventDefault();
  const formData = new FormData(form);
  console.log([...formData.entries()]);
});