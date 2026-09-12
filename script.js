const audio = document.getElementById('audio-source');
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const barTitle = document.getElementById('bar-title');
const barArtist = document.getElementById('bar-artist');
const barCover = document.getElementById('bar-cover');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const cardsGrid = document.getElementById('cards-grid');
const searchInput = document.getElementById('search-input');
const uploadTriggerBtn = document.getElementById('upload-trigger-btn');
const localFileInput = document.getElementById('local-file-input');

const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

const songs = [
    { 
        name: "One Love Mashup", 
        artist: "Shubh ft. Sonam Bajwa", 
        cover: "https://i.ytimg.com/vi/FDv9v5gj2Tg/hqdefault.jpg", 
        src: "Songs/one-love.mp3" },

    {
        name: "Feel the jaani", 
        artist: "B Praak", 
        cover: "https://i.ytimg.com/vi/O3F4DVRDoQ8/0.jpg", 
        src: "Songs/Feel the jaani.mp3" },

    {
        name: "Lovely", 
        artist: " Billie Eilish & Khalid", 
        cover: "https://i.ytimg.com/vi/V1Pl8CzNzCw/0.jpg", 
        src: "Songs/Lovely.mp3" },

    {
        name: "Criminal", 
        artist: "Britney Spears", 
        cover: "https://i.ytimg.com/vi/PvKw4ljBohA/0.jpg", 
        src: "Songs/Criminal.mp3" },

    {       
        name: "BIRDS OF A FEATHER", 
        artist: " Billie Eilish ", 
        cover: "https://i.ytimg.com/vi/geKxhmZL8ao/0.jpg", 
        src: "Songs/BIRDS OF A FEATHER.mp3" },

    {    
        name: "Attention", 
        artist: "Charlie Puth", 
        cover: "https://i.ytimg.com/vi/cE9fo3YZpp8/0.jpg", 
        src: "Songs/Attention.mp3" }
    
   
];

let songIndex = 0;
let isShuffle = false;
let isRepeat = false;

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

function loadSong(index) {
    const song = songs[index];
    barTitle.innerText = song.name;
    barArtist.innerText = song.artist;
    barCover.src = song.cover;
    audio.src = song.src;
}

function playSong() {
    playBtn.classList.add('playing');
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
    audio.play();
}

function pauseSong() {
    playBtn.classList.remove('playing');
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
    audio.pause();
}

playBtn.addEventListener('click', () => {
    if (playBtn.classList.contains('playing')) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songIndex);
    playSong();
});

nextBtn.addEventListener('click', () => {
    if (isShuffle) {
        songIndex = Math.floor(Math.random() * songs.length);
    } else {
        songIndex = (songIndex + 1) % songs.length;
    }
    loadSong(songIndex);
    playSong();
});

// Shuffle Toggle Logic
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? '#1ed760' : '#b3b3b3';
});

// Repeat Toggle Logic
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.style.color = isRepeat ? '#1ed760' : '#b3b3b3';
});

function renderCards(filterText = "") {
    cardsGrid.innerHTML = "";
    songs.forEach((song, index) => {
        if (song.name.toLowerCase().includes(filterText.toLowerCase()) || song.artist.toLowerCase().includes(filterText.toLowerCase())) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${song.cover}" alt="${song.name}">
                <div class="card-title">${song.name}</div>
                <div class="card-artist">${song.artist}</div>
            `;
            card.addEventListener('click', () => {
                songIndex = index;
                loadSong(songIndex);
                playSong();
            });
            cardsGrid.appendChild(card);
        }
    });
}

searchInput.addEventListener('input', (e) => renderCards(e.target.value));

audio.addEventListener('timeupdate', (e) => {
    const { currentTime, duration } = e.srcElement;
    if (isNaN(duration)) return;
    progressBar.value = (currentTime / duration) * 100;

    let curMin = Math.floor(currentTime / 60);
    let curSec = Math.floor(currentTime % 60);
    currentTimeEl.innerText = `${curMin}:${curSec < 10 ? '0' : ''}${curSec}`;

    let durMin = Math.floor(duration / 60);
    let durSec = Math.floor(duration % 60);
    durationEl.innerText = `${durMin}:${durSec < 10 ? '0' : ''}${durSec}`;
});

progressBar.addEventListener('input', (e) => {
    audio.currentTime = (e.target.value / 100) * audio.duration;
});

audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextBtn.click();
    }
});

uploadTriggerBtn.addEventListener('click', () => localFileInput.click());

localFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newCustomSong = {
        name: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
        artist: "Local Upload",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
        src: URL.createObjectURL(file)
    };
    songs.unshift(newCustomSong);
    songIndex = 0;
    renderCards();
    loadSong(songIndex);
    playSong();
});

const menuBtn = document.getElementById('menu-btn');
const dropdownMenu = document.getElementById('dropdown-menu');
const favOption = document.getElementById('fav-option');

menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('hidden');
});

document.addEventListener('click', () => dropdownMenu.classList.add('hidden'));

let favorites = JSON.parse(localStorage.getItem('favoriteSongs')) || [];

function renderFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    favoritesGrid.innerHTML = "";
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `<p style="color: #b3b3b3; font-size: 0.9rem;">No favorite songs added yet.</p>`;
        return;
    }
    favorites.forEach((song) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${song.cover}" alt="${song.name}">
            <div class="card-title">${song.name}</div>
            <div class="card-artist">${song.artist}</div>
        `;
        card.addEventListener('click', () => {
            const idx = songs.findIndex(s => s.src === song.src);
            if (idx !== -1) {
                songIndex = idx;
                loadSong(songIndex);
                playSong();
            }
        });
        favoritesGrid.appendChild(card);
    });
}

function updateFavMenuUI() {
    const currentSong = songs[songIndex];
    if (!currentSong) return;
    const isFav = favorites.some(s => s.src === currentSong.src);
    const icon = favOption.querySelector('i');
    if (isFav) {
        icon.className = "fa-solid fa-heart";
        icon.style.color = '#1ed760';
        favOption.innerHTML = `<i class="fa-solid fa-heart" style="color: #1ed760;"></i> Saved to Favorites`;
    } else {
        icon.className = "fa-regular fa-heart";
        icon.style.color = '#b3b3b3';
        favOption.innerHTML = `<i class="fa-regular fa-heart"></i> Save to Favorites`;
    }
}

const originalLoadSong = loadSong;
loadSong = function(index) {
    originalLoadSong(index);
    updateFavMenuUI();
};

favOption.addEventListener('click', () => {
    const currentSong = songs[songIndex];
    const existingIndex = favorites.findIndex(s => s.src === currentSong.src);
    if (existingIndex === -1) {
        favorites.push(currentSong);
    } else {
        favorites.splice(existingIndex, 1);
    }
    localStorage.setItem('favoriteSongs', JSON.stringify(favorites));
    updateFavMenuUI();
    renderFavorites();
});

// Sidebar Link Actions
document.getElementById('sidebar-fav-link').addEventListener('click', () => {
    document.querySelector('.favorites-section').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('sidebar-top-tracks').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

loadSong(songIndex);
renderCards();
renderFavorites();

// Volume Bar Slider Fill Logic
function updateSliderFill(slider, color) {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${value}%, #4d4d4d ${value}%, #4d4d4d 100%)`;
}

volumeBar.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
    updateSliderFill(e.target, '#3b82f6');
});

// Page load hote hi blue color set karne ke liye
updateSliderFill(volumeBar, '#3b82f6');