import { runDetection } from "../lib/barcode"

let scannerInterruptionCallback = () => {};

const BarcodeReader: React.FC<{ enabled: boolean, onDetectedCallback: (code: number) => void }> = ({enabled, onDetectedCallback}): JSX.Element => {
  if(enabled) {
    scannerInterruptionCallback = runDetection(onDetectedCallback);
  } else {
    scannerInterruptionCallback();
  }
  return <div></div>;
}

export default BarcodeReader