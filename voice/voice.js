const VALUE_MISSING_MSG = "You must say the words!";
const PLEDGE = "I love working here";

const grammar = `#JSGF V1.0; grammar pledge; public <pledge> = ${PLEDGE};`;

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;

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

export default class MandatoryPledge extends HTMLElement {

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
        <h3>Please say the following line:</h3>
        <div id='pledge'>${PLEDGE}</div>
        <button id="voice">Record</button>
      </div>

      <style>
        #container{
          display: inline-block;
        }
        #pledge.invalid {
          border: 2px solid red;
        }
        #pledge.valid {
          border: 2px solid green;
        }
      </style>
    `;

    this.btn = shadow.getElementById('voice');
    this.pledge = shadow.getElementById('pledge');
  }

  addInvalidStyling() {
    this.pledge.classList.remove('valid');
    this.pledge.classList.add('invalid');
  }

  addValidStyling() {
    this.pledge.classList.remove('invalid');
    this.pledge.classList.add('valid');
  }

  connectedCallback() {
    this.addEventListener('invalid', this.addInvalidStyling)
    this.btn.addEventListener('click', this.checkPledge.bind(this));
  }

  disconnectedCallback() {
    this.btn.removeEventListener('click', this.checkPledge.bind(this));
    this.removeEventListener('invalid', this.addInvalidStyling)
  }

  checkPledge() {
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;

    recognition.onspeechend = () => {
      recognition.stop();
      console.log('Speech recognition has stopped.');
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript !== PLEDGE) {
        const errorMessage = `You said: ${transcript}, please say ${PLEDGE}`;
        this.internals_.setValidity({
          ...ValidityStateFlags, ...{ 'customError': true },
        }, errorMessage);
        this.addInvalidStyling();
      } else {
        this.internals_.setValidity({ ...ValidityStateFlags })
        this.addValidStyling();
      }
    }

    recognition.start();
  }
}
/*
SpeechRecognitionResultList {0: SpeechRecognitionResult, length: 1}
0: SpeechRecognitionResult
0: SpeechRecognitionAlternative {transcript: 'I love working here', confidence: 0.9564103484153748}
isFinal: true
length: 1
[[Prototype]]: SpeechRecognitionResult
length: 1
[[Prototype]]: SpeechRecognitionResultList
*/