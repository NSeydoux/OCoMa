"use client";

import { runDetection } from "../lib/barcode"

let scannerInterruptionCallback = () => {};

const BarcodeReader: React.FC<{ enabled: boolean, onDetectedCallback: (code: number) => void }> = ({enabled, onDetectedCallback}): JSX.Element => {
  if(enabled) {
    scannerInterruptionCallback = runDetection(onDetectedCallback);
  } else {
    console.log("Scanning disabled")
    scannerInterruptionCallback();
  }
  return <></>;
}

export default BarcodeReader
