import MandatorySmile from './smile';

customElements.define("mandatory-smile", MandatorySmile);

const form = document.getElementById('form');
const result = document.getElementById('result');

form.addEventListener('submit', evt => {
  evt.preventDefault();
  const formData = new FormData(form);
  result.innerHTML = "";
  Array.from(formData.entries()).forEach(([key, value]) => {
    if (key.startsWith('emotion')) {
      const div = document.createElement('div');
      div.innerText = `${key} - ${value}`;
      result.appendChild(div);
    }
  })

});