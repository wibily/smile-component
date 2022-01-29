import placeholder from './img/noimg.png';
import { detectSmiles } from './rekognition';

const ValidityStateFlags = {
  valueMissing: false,
  typeMismatch: false,
  patternMismatch: false,
  tooLong: false,
  tooShort: false,
  rangeUnderflow: false,
  rangeOverflow: false,
  stepMismatch: false,
  badInput: false,
  customError: false
}

const randomBoomerSaying = () => {
  const boomerSayings = [
    "Smile and pull yourself up by your bootstraps!",
    "Smile, rise and grind, hustlers!",
    "Smile! You can't have a million-dollar dream with a minimum-wage work ethic",
    "Smile! Turn that frown, upside down",
    "Smile! Good things happen to those who hustle",
    "Smile! We demand high performance happy here",
    "Smile and smash those KPIs!"
  ];

  return boomerSayings[Math.floor(Math.random() * boomerSayings.length)];
}

const VALUE_MISSING_MSG = 'Smiling is mandatory, now upload that smile';
const LOADING_MSG = 'Image recognition loading...';

const readBlob = (blob, format) => new Promise((resolve, reject) => {
  const fr = new FileReader();
  fr.addEventListener('load', () => {
    resolve(fr.result);
  });
  fr.addEventListener('error', () => {
    reject(fr.error);
  });

  switch (format) {
    case 'dataURL':
      fr.readAsDataURL(blob);
      break;
    case 'arrayBuffer':
      fr.readAsArrayBuffer(blob);
      break;
    default:
      reject("Unknown format, please select dataURL or arrayBuffer");
  }
})

const isSmiling = (response) => {
  const maybeFace = response.FaceDetails[0];
  if (maybeFace) {
    return maybeFace.Smile.Value;
  }
  return false;
}


export default class MandatorySmile extends HTMLElement {

  //this makes it a form associating custom element
  static formAssociated = true;

  constructor() {
    super();
    this.internals_ = this.attachInternals();
    this.internals_.setValidity({ 'valueMissing': true }, VALUE_MISSING_MSG);
    this.setAttribute('tabindex', 0);

    const shadow = this.attachShadow({
      mode: "open"
    }, true);

    shadow.innerHTML = `
      <div id='container'>
        <button id="upload">Smile!</button>
        <img id='portrait' src='${placeholder}' alt='No image placeholder'>
      </div>

      <style>
        #container{
          display: inline-block;
        }
        #container.invalid {
          border: 2px solid red;
        }
      </style>
    `
    this.btn = shadow.getElementById('upload');
    this.img = shadow.getElementById('portrait');
    this.container = shadow.getElementById('container');
  }

  addInvalidStyling() {
    this.container.classList.add('invalid');
  }

  connectedCallback() {

    this.addEventListener('invalid', this.addInvalidStyling)

    this.btn.addEventListener('click', this.checkSmile.bind(this));
  }

  disconnectedCallback() {
    this.btn.removeEventListener('click', this.checkSmile.bind(this));
    this.removeEventListener('invalid', this.addInvalidStyling)
  }

  setPreview(dataURL) {
    this.img.src = dataURL;
  }

  sendSmile(arrayBuffer) {
    detectSmiles(arrayBuffer).then(resp => {
      console.log(resp);
      if (!isSmiling(resp)) {
        this.internals_.setValidity({
          ...ValidityStateFlags, ...{ 'customError': true }
        }, randomBoomerSaying()
        );
      } else {
        this.internals_.setValidity({
          ...ValidityStateFlags
        });
      }
    });
  }

  checkSmile() {
    this.internals_.setValidity({ 'valueMissing': true }, LOADING_MSG);

    takePicture().then(blob => {
      readBlob(blob, 'dataURL').then(dataURL => {
        this.setPreview(dataURL);
      });
      readBlob(blob, 'arrayBuffer').then(arrayBuffer => {
        this.sendSmile(arrayBuffer);
      });
    });
  }
}

async function takePicture() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const track = stream.getVideoTracks()[0];
  const imageCapture = new ImageCapture(track);
  const blob = await imageCapture.takePhoto();
  stream.getTracks().forEach(t => t.stop());
  return blob;
}


