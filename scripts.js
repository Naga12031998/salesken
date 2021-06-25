const x = document.getElementById('myAudio');
const audioDuration = 27;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let playPauseState = 'pause';
let percent = 0;
let timer = 0;
const audioContext = new AudioContext();

x.onended = function() {
	document.getElementById('icon').className = 'fa fa-play';
	playPauseState = 'pause';
};

x.addEventListener('playing', (e) => {
	const duration = e.target.duration;
	drawProgressBar(duration, x);
});

const drawProgressBar = (duration, element) => {
	const increment = 10 / duration;
	percent = Math.min(increment * element.currentTime * 10, 100);
	ctx.beginPath();
	ctx.moveTo(percent * 10, 10);
	ctx.lineTo(percent * 10, -100);
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 5;
	ctx.stroke();
	startTimer(duration, element);
};

const startTimer = (duration, element) => {
	if (percent < 100) {
		timer = setTimeout(function() {
			drawProgressBar(duration, element);
		}, 100);
	}
};

canvas.addEventListener(
	'click',
	function(event) {
		const canvasWidth = event.pageX - canvas.offsetLeft;
		x.currentTime = canvasWidth / 38;
	},
	false
);

const tooglePlayPause = () => {
	if (playPauseState === 'pause') {
		document.getElementById('icon').className = 'fa fa-pause';
		playPauseState = 'play';
		x.play();
	} else {
		document.getElementById('icon').className = 'fa fa-play';
		playPauseState = 'pause';
		clearTimeout(timer);
		x.pause();
	}
};

const drawAudio = (url) => {
	fetch(url)
		.then((response) => response.arrayBuffer())
		.then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
		.then((audioBuffer) => draw(normalizeData(filterData(audioBuffer))));
};

const filterData = (audioBuffer) => {
	const rawData = audioBuffer.getChannelData(0);
	const samples = 200;
	const blockSize = Math.floor(rawData.length / samples);
	const filteredData = [];
	for (let i = 0; i < samples; i++) {
		const blockStart = blockSize * i;
		let sum = 0;
		for (let j = 0; j < blockSize; j++) {
			sum = sum + Math.abs(rawData[blockStart + j]);
		}
		filteredData.push(sum / blockSize);
	}
	return filteredData;
};

const normalizeData = (filteredData) => {
	const multiplier = Math.pow(Math.max(...filteredData), -1);
	return filteredData.map((n) => n * multiplier);
};

const draw = (normalizedData) => {
	const ratio = window.devicePixelRatio || 1;
	const padding = 20;
	canvas.width = canvas.offsetWidth * ratio;
	canvas.height = (canvas.offsetHeight + padding * 2) * ratio;

	ctx.beginPath();
	ctx.moveTo(80, 60);
	ctx.lineTo(80, 145);
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'rgb(135, 231, 145)';
	ctx.lineCap = 'round';
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(80, 150, 5, 0, 2 * Math.PI);
	ctx.fillStyle = 'rgb(135, 231, 145)';
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(168, 55);
	ctx.lineTo(168, 145);
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'rgb(43, 218, 142)';
	ctx.lineCap = 'round';
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(168, 150, 5, 0, 2 * Math.PI);
	ctx.fillStyle = 'rgb(43, 218, 142)';
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(750, 5);
	ctx.lineTo(750, 111);
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'rgb(135, 231, 145)';
	ctx.lineCap = 'round';
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(750, 111, 5, 0, 2 * Math.PI);
	ctx.fillStyle = 'rgb(135, 231, 145)';
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(785, 70);
	ctx.lineTo(785, 130);
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#1900B8';
	ctx.lineCap = 'round';
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(785, 130, 5, 0, 2 * Math.PI);
	ctx.fillStyle = '#1900B8';
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(810, 30);
	ctx.lineTo(810, 140);
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'rgb(146, 101, 101)';
	ctx.lineCap = 'round';
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(810, 140, 5, 0, 2 * Math.PI);
	ctx.fillStyle = 'rgb(146, 101, 101)';
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(845, 15);
	ctx.lineTo(845, 130);
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#67A546';
	ctx.lineCap = 'round';
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(845, 130, 5, 0, 2 * Math.PI);
	ctx.fillStyle = '#67A546';
	ctx.fill();

	ctx.scale(ratio, ratio);
	ctx.translate(0, canvas.offsetHeight / 2 + padding);

	const width = canvas.offsetWidth / normalizedData.length;
	for (let i = 0; i < normalizedData.length; i++) {
		const x = width * i;
		let height = normalizedData[i] * canvas.offsetHeight - padding;
		if (height < 0) {
			height = 0;
		} else if (height > canvas.offsetHeight / 2) {
			height = height > canvas.offsetHeight / 2;
		}
		drawLineSegment(ctx, x, height, width, (i + 1) % 2);
	}
};

const drawLineSegment = (ctx, x, height, width, isEven) => {
	ctx.lineWidth = 1;
	ctx.beginPath();
	height = isEven ? height : -height;
	ctx.moveTo(x, 0);
	ctx.lineTo(x, height);
	ctx.fillStyle = 'rgb(135, 231, 145)';
	ctx.fillRect(45, -110, 70, 30);
	ctx.fillStyle = 'rgb(43, 218, 142)';
	ctx.fillRect(143, -120, 50, 30);
	ctx.fillStyle = '#1900B8';
	ctx.fillRect(760, -85, 45, 30);
	ctx.fillStyle = '#936666';
	ctx.fillRect(670, -118, 150, 30);
	ctx.fillStyle = '#67A546';
	ctx.fillRect(715, -155, 140, 34);

	ctx.fillStyle = 'white';
	ctx.fillText('Introduction', 50, -90);
	ctx.fillText('one_six', 150, -100);
	ctx.fillText('Polite', 770, -65);
	ctx.fillText('Rapport Building - Energy', 720, -130);
	ctx.fillText('Rapport Building - Empathy', 677, -98);
	ctx.fillStyle = 'grey';
	ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
	ctx.lineTo(x + width, 0);
	ctx.fill();
};

drawAudio(
	'https://d1.awsstatic.com/tmt/create-audio-transcript-transcribe/transcribe-sample.5fc2109bb28268d10fbc677e64b7e59256783d3c.mp3'
);
