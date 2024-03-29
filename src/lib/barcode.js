import Quagga from "quagga";
import { BARCODE_CONTAINER_ID } from "../components/domConstants"

function stopScanning() {
  Quagga.stop();
  const container = document.querySelector(`#${BARCODE_CONTAINER_ID}`);
  if(container !== null) {
    Array.from(container.childNodes).forEach((child) => {
      container.removeChild(child);
    })
  }
}

export function runDetection(onDetectedCallback) {
  const quaggaState = {
    inputStream : {
      type : "LiveStream",
      constraints: {
        width: {min: 640},
        height: {min: 480},
        facingMode: "environment",
        aspectRatio: {min: 1, max: 2}
    },
      target: document.querySelector(`#${BARCODE_CONTAINER_ID}`)
    },
    locator: {
      patchSize: "medium",
      halfSample: true
    },
    numOfWorkers: 2,
    frequency: 10,
    decoder : {
      readers: [{
        format: "ean_reader",
        config: {}
      }]
    }, locate: true
  }
  
  Quagga.init(quaggaState, function(err) {
      if (err) {
          console.log(err);
          return
      }
      Quagga.start();
  });
  
  Quagga.onDetected((data) => {
    if(`${data.codeResult.code}`.startsWith("9")) {
      onDetectedCallback(data.codeResult.code);
    }
  });

  return stopScanning;
}
