import * as faceapi from "face-api.js";
import {
  FACE_DELTA_PERCENTAGE,
  NOSE_DELTA_PERCENTAGE,
} from "src/constants/kyc";

export const checkFaceInFaceArea = (
  faceDetectionResult: faceapi.Box<any>,
  faceAreaBox: faceapi.IRect
) => {
  return (
    faceDetectionResult.x >=
      faceAreaBox.x * (1 - FACE_DELTA_PERCENTAGE / 100) &&
    faceDetectionResult.y >=
      faceAreaBox.y * (1 - FACE_DELTA_PERCENTAGE / 100) &&
    faceDetectionResult.x + faceDetectionResult.width <=
      faceAreaBox.x + faceAreaBox.width * (1 + FACE_DELTA_PERCENTAGE / 100) &&
    faceDetectionResult.y + faceDetectionResult.height <=
      faceAreaBox.y + faceAreaBox.height * (1 + FACE_DELTA_PERCENTAGE / 100)
  );
};
export const checkNoseInNoseArea = (
  nosePoint: faceapi.Point,
  noseAreaBox: faceapi.IRect
) => {
  return (
    nosePoint.x >= noseAreaBox.x * (1 - NOSE_DELTA_PERCENTAGE / 100) &&
    nosePoint.y >= noseAreaBox.y * (1 - NOSE_DELTA_PERCENTAGE / 100) &&
    nosePoint.x <=
      noseAreaBox.x + noseAreaBox.width * (1 + NOSE_DELTA_PERCENTAGE / 100) &&
    nosePoint.y <=
      noseAreaBox.y + noseAreaBox.height * (1 + NOSE_DELTA_PERCENTAGE / 100)
  );
};
