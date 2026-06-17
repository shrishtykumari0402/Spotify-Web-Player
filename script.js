const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const progressBar = document.querySelector(".progress-bar");
const volumeBar = document.querySelector(".volume-bar");
const volumeIcon = document.getElementById("volume-icon");
const controls = document.querySelector(".controls");
const currTimeEl = document.querySelector(".curr-time");
const totTimeEl = document.querySelector(".tot-time");

let isPlaying = false;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60) || 0;
    const secs = Math.floor(seconds % 60) || 0;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

playBtn.addEventListener("click", () => {
    if (!isPlaying) {
        audio.play();
        playBtn.classList.remove("fa-circle-play");
        playBtn.classList.add("fa-circle-pause");
        isPlaying = true;
    } else {
        audio.pause();
        playBtn.classList.remove("fa-circle-pause");
        playBtn.classList.add("fa-circle-play");
        isPlaying = false;
    }
});

audio.volume = 1;

audio.addEventListener("loadedmetadata", () => {
    if (!audio.duration || isNaN(audio.duration)) return;
    totTimeEl.textContent = formatTime(audio.duration);
    progressBar.value = 0;
    volumeBar.value = Math.round(audio.volume * 100);
});

audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    currTimeEl.textContent = formatTime(audio.currentTime);
});

volumeBar.addEventListener("input", () => {
    audio.volume = volumeBar.value / 100;
});

progressBar.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (progressBar.value * audio.duration) / 100;
});

volumeIcon.addEventListener("click", () => {
    controls.classList.toggle("volume-open");
});

audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    progressBar.value = 0;
    currTimeEl.textContent = "00:00";
    if (isPlaying) {
        playBtn.classList.remove("fa-circle-pause");
        playBtn.classList.add("fa-circle-play");
        isPlaying = false;
    }
});
