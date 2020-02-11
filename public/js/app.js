// Init variables
let audioContext = null;
let scriptProcessorNode = null;
let audioDestinationNode = null;
let mediaStreamAudioSourceNode = null;
let bufferSize = 1024;

// Settings Button
let startButton = document.getElementById("startRecButton");
startButton.addEventListener("click", startRecording);

let stopButton = document.getElementById("stopRecButton");
stopButton.addEventListener("click", stopRecording);
stopButton.disabled = true;

// Settings Socket.io
const socket = io.connect("http://localhost:3000/");
socket.on('connect', function () {
    socket.emit('join', 'Server Connected to Client');
});

socket.on('messages', function (data) {
    console.log(data);
});

function startRecording() {
    startButton.disabled = true;
    stopButton.disabled = false;
    initRecording();
}

function stopRecording() {
    startButton.disabled = false;
    stopButton.disabled = true;
    mediaStreamAudioSourceNode.disconnect(scriptProcessorNode);
    scriptProcessorNode.disconnect(audioContext.destination);
    audioContext.close().then(function () {
        mediaStreamAudioSourceNode = null;
        audioDestinationNode = null;
        scriptProcessorNode = null;
        audioContext = null;
        startButton.disabled = false;
    });
    socket.emit('stop', '', () => {
      console.log("stop recoding");
    });
}

function initRecording() {
    socket.emit('start recoding', '');

    audioContext = new AudioContext();
    console.log(audioContext.sampleRate);
    scriptProcessorNode = audioContext.createScriptProcessor(bufferSize, 1, 1);
    audioDestinationNode = scriptProcessorNode.connect(audioContext.destination);

    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function(mediaStream) {
        mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(mediaStream);
        mediaStreamAudioSourceNode.connect(scriptProcessorNode);

        scriptProcessorNode.onaudioprocess = function (e) {
            let float32array = e.inputBuffer.getChannelData(0);
            socket.emit('audioData', float32array.buffer);
        };
    });
}