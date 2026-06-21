const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const progressBar = document.querySelector('.progress-bar');
const volumeBar = document.querySelector('.volume-bar');
const volumeIcon = document.getElementById('volume-icon');
const controls = document.querySelector('.controls');
const currTimeEl = document.querySelector('.curr-time');
const totTimeEl = document.querySelector('.tot-time');
const nextBtn = document.getElementById('next-btn');
const songsListEl = document.getElementById('songs-list');
const addSongForm = document.getElementById('add-song-form');
const fileInput = document.getElementById('song-file');
const titleInput = document.getElementById('song-title');
const artistInput = document.getElementById('song-artist');

let isPlaying = false;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60) || 0;
    const secs = Math.floor(seconds % 60) || 0;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// initial playlist (can be extended by Add-song form)
let playlist = [
    {
        src: './songs/songs.mp3',
        title: 'Daylight',
        artist: 'David Kushner',
        img: './Homework_assets/album_picture.jpeg'
    },
    {
        src: './songs/WithoutMe.mp3',
        title: 'Without Me',
        artist: 'Hasley',
        img: './Homework_assets/Hasley-img.jpg'
    }
];

let currentIndex = 0;

function loadSong(index) {
    if (!playlist[index]) return;
    const s = playlist[index];
    audio.src = s.src;
    if (s.img && document.querySelector('.album-img')) {
        document.querySelector('.album-img').src = s.img;
    }
    if (s.title && document.querySelector('.album-title')) {
        document.querySelector('.album-title').textContent = s.title;
    }
    if (s.artist && document.querySelector('.album-artist')) {
        document.querySelector('.album-artist').textContent = s.artist;
    }
}

function playSong() {
    audio.play().then(() => {
        playBtn.classList.remove('fa-circle-play');
        playBtn.classList.add('fa-circle-pause');
        isPlaying = true;
    }).catch(() => {});
}

function pauseSong() {
    audio.pause();
    playBtn.classList.remove('fa-circle-pause');
    playBtn.classList.add('fa-circle-play');
    isPlaying = false;
}

playBtn.addEventListener('click', () => {
    if (!isPlaying) playSong(); else pauseSong();
});

audio.volume = 1;

audio.addEventListener('loadedmetadata', () => {
    if (!audio.duration || isNaN(audio.duration)) return;
    totTimeEl.textContent = formatTime(audio.duration);
    progressBar.value = 0;
    volumeBar.value = Math.round(audio.volume * 100);
});

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    currTimeEl.textContent = formatTime(audio.currentTime);
});

volumeBar.addEventListener('input', () => {
    audio.volume = volumeBar.value / 100;
});

progressBar.addEventListener('input', () => {
    if (!audio.duration) return;
    audio.currentTime = (progressBar.value * audio.duration) / 100;
});

volumeIcon.addEventListener('click', () => {
    controls.classList.toggle('volume-open');
});

audio.addEventListener('ended', () => {
    if (playlist.length > 1) playNext();
    else {
        audio.currentTime = 0;
        progressBar.value = 0;
        currTimeEl.textContent = '00:00';
        if (isPlaying) pauseSong();
    }
});

function playNext() {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(currentIndex);
    playSong();
}

if (nextBtn) nextBtn.addEventListener('click', () => { if (playlist.length>1) playNext(); });

// render playlist as cards
function renderPlaylist() {
    if (!songsListEl) return;
    songsListEl.innerHTML = '';
    playlist.forEach((s, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = i;

        const img = document.createElement('img');
        img.src = s.img || './Homework_assets/album_picture.jpeg';
        img.alt = s.title || 'song';
        img.className = 'card-img';

        const title = document.createElement('p');
        title.className = 'card-title';
        title.textContent = s.title || `Track ${i+1}`;

        const info = document.createElement('p');
        info.className = 'card-info';
        info.textContent = s.artist || '';

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(info);

        card.addEventListener('click', () => {
            currentIndex = i;
            loadSong(i);
            playSong();
        });

        songsListEl.appendChild(card);
    });
}

// handle add-song form: create object URL and append to playlist and UI
if (addSongForm) {
    addSongForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        const title = (titleInput && titleInput.value.trim()) || file.name.replace(/\.[^/.]+$/, '');
        const artist = (artistInput && artistInput.value.trim()) || '';
        const newSong = { src: url, title, artist, img: '' };
        playlist.push(newSong);
        renderPlaylist();
        currentIndex = playlist.length - 1;
        loadSong(currentIndex);
        playSong();
        addSongForm.reset();
    });
}

// init
loadSong(0);
renderPlaylist();
