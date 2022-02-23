import MandatorySmile from './smile/smile';
import MandatoryPledge from './voice/voice';

customElements.define("mandatory-smile", MandatorySmile);
customElements.define("mandatory-pledge", MandatoryPledge);

const form = document.getElementById('form');
const result = document.getElementById('result');
form.addEventListener('submit', evt => {
  evt.preventDefault();
  const formData = new FormData(form);
  console.log([...formData.entries()]);
  result.innerText = 'Staff Member loyalty acceptable'
});