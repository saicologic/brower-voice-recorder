'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');
const WavEncoder = require('wav-encoder');
const port = 3000;
const sampleRate = 48000;
const filename = 'output/sample.wav';

let buffer = [];

const toArrayBuffer = function(buf) {
    let ab = new ArrayBuffer(buf.length);
    let view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
};

io.on('connection', function (socket) {
    socket.on('join', function () {
        socket.emit('messages', 'Socket connected to Server');
    });

    socket.on('audioData', function (message) {
        let values = message.values();
        let buf = new Array(message.length);
        for (var i = 0; i < buf.length; i++) {
            buf[i] = values.next().value;
        }
        buffer = buffer.concat(buf);
    });

    socket.on('stop', () => {
        let ab = toArrayBuffer(buffer);
        let float32array = new Float32Array(ab);
        
        const audioData = {
            sampleRate: sampleRate,
            channelData: [float32array]
        };

        WavEncoder.encode(audioData).then((buffer) => {
            fs.writeFile(filename, Buffer.from(buffer), (e) => {
                if (e) {
                    console.log(e);
                } else {
                    console.log(`Output ${filename}`);
                }
            });
        });
    });
});

app.use(express.static('public'));

server.listen(port, "127.0.0.1", function () {
    console.log('Server started on port:' + port);
});
