import { RekognitionClient, DetectFacesCommand } from "@aws-sdk/client-rekognition";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";


const REGION = process.env.REGION;

const rekognitionClient = new RekognitionClient({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: process.env.identityPoolId
  })
});

const encodeArrayBuffer = (arrayBuffer) => {
  const ua = new Uint8Array(arrayBuffer);
  for (var i = 0; i < length; i++) {
    ua[i] = image.charCodeAt(i);
  }
  return ua;
}

export const detectSmiles = (arrayBuffer) => {
  const imageData = encodeArrayBuffer(arrayBuffer);

  const params = {
    Image: {
      Bytes: imageData,
    },
    Attributes: ['ALL']
  };

  const cmd = new DetectFacesCommand(params)

  return rekognitionClient.send(cmd);
}
