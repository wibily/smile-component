# Smile validating web component

This is a form validating custom web component that will refuse to validate unless you smile. As it is framework agnostic, with only a few lines of JavaScript, you can embed this wherever you have morale issues! Suggested usages include: employee login portals, customer complaint forms and Disneyland.

Try it out in chrome: https://mandatorysmile.netlify.app/


## Getting Started
  1. Rename the .env.sample file to .env
  2. Follow these steps to set up your AWS keys: https://docs.aws.amazon.com/rekognition/latest/dg/image-bytes-javascript.html#image-bytes-javascript-auth
  3. Fill in the details from step 2 in your .env file
  4. Run npm install
  5. Run npm start
  6. Open up chrome and go to localhost:1234


## Notes
- only works in Chrome/Edge due to support for setValidity https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/setValidity
- Requires video stream permissions
- Uses AWS Rekognition DetectFaces API to determine if the person is smiling hence you will need to set up your API keys.

## Frequetly Asked Questions

### Why did you make this?
To spread joy in the world and definitely not as a tool for Slaanesh to bring about the grimdank future of the 41st millenium.

### I'm from HR and I want to use this at work!
You totally should! I would also suggest that all meetings start with an oath of allegience to the company and their shareholders.

### Is this satire?
Lol yes




