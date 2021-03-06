/*
  main.js is primarily responsible for hooking up the UI to the rest of the application 
  and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const drawParams = {
  showGradient: false,
  showBars: false,
  showInvert: false,
  showEmboss: false,
  showBarCircle: true,
  showProgress: true,
  showDate: true,
  showBounce: true,
  showWaveform: true,
  showPixels: true,
  showCircleWaveform: true,
  showGrayscale: false,
  showSepia: false,
}

let waveformHeight = 200;

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
  sound1: "media/Koi no Uta.mp3"
});

function init() {
  console.log("init called");
  console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  audio.setupWebaudio(DEFAULTS.sound1);
  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  setupUI(canvasElement);
  canvas.setupCanvas(canvasElement, audio.analyserNode);
  loop();
}

function setupUI(canvasElement) {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");

  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };

  // add .onclick event to button
  const playButton = document.querySelector("#playButton");
  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    // check if context is in suspended state (autoplay policy)
    if (audio.audioCtx.state == "suspended") {
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if (e.target.dataset.playing == "no") {
      // if track is currently paused, play it
      audio.playCurrentSound();
      e.target.dataset.playing = "yes"; // our CSS will set the text to "Pause"
      // if track IS playing, pause it
    }
    else {
      audio.pauseCurrentSound();
      e.target.dataset.playing = "no";
    }
  };


  // Hookup volume slider & label
  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel = document.querySelector("#volumeLabel");

  // add .oninput event to slider
  volumeSlider.oninput = e => {
    // set the gain
    audio.setVolume(e.target.value);
    // update value of label to match value of slider
    volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
  };

  // set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  // Hookup volume slider & label
  let waveformSlider = document.querySelector("#waveformSlider");
  let waveformLabel = document.querySelector("#waveformLabel");

  // add .oninput event to slider
  waveformSlider.oninput = e => {
    waveformHeight = waveformSlider.value;
    // update value of label to match value of slider
    waveformLabel.innerHTML = waveformSlider.max - e.target.value;
  };

  // set value of label to match initial value of slider
  waveformSlider.dispatchEvent(new Event("input"));


  // hookup track <select>
  let trackSelect = document.querySelector("#trackSelect");
  // add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    // pause the current track if it is playing
    if (playButton.dataset.playing = "yes") {
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };


  // setup toggles
  document.querySelector('#gradientCB').onchange = e => {
    drawParams.showGradient = e.target.checked;
  };
  document.querySelector('#barsCB').onchange = e => {
    drawParams.showBars = e.target.checked;
  };
  document.querySelector('#invertCB').onchange = e => {
    drawParams.showInvert = e.target.checked;
  };
  document.querySelector('#embossCB').onchange = e => {
    drawParams.showEmboss = e.target.checked;
  };
  document.querySelector('#barCircleCB').onchange = e => {
    drawParams.showBarCircle = e.target.checked;
  };
  document.querySelector('#dateCB').onchange = e => {
    drawParams.showDate = e.target.checked;
  };
  document.querySelector('#bounceCB').onchange = e => {
    drawParams.showBounce = e.target.checked;
  };
  document.querySelector('#circleWaveformCB').onchange = e => {
    drawParams.showCircleWaveform = e.target.checked;
  };
  document.querySelector('#progressCB').onchange = e => {
    drawParams.showProgress = e.target.checked;
  };
  document.querySelector('#waveformCB').onchange = e => {
    drawParams.showWaveform = e.target.checked;
  };
  document.querySelector('#pixelsCB').onchange = e => {
    drawParams.showPixels = e.target.checked;
  };
  document.querySelector('#grayscaleCB').onchange = e => {
    drawParams.showGrayscale = e.target.checked;
  };
  document.querySelector('#sepiaCB').onchange = e => {
    drawParams.showSepia = e.target.checked;
  };

} // end setupUI

function loop() {
  /* NOTE: This is temporary testing code that we will delete in Part II */
  requestAnimationFrame(loop);
  let minutes = Math.floor(audio.element.currentTime/60).toString().padStart(2, "0");
  let seconds = Math.floor(audio.element.currentTime%60).toString().padStart(2, "0");
  document.querySelector("#progress").innerHTML = `${minutes}:${seconds}`;
  canvas.draw(drawParams, waveformHeight);
}

export { init };