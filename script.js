var songs = [
  { name: "Bài hát 1", file: "https://files.catbox.moe/22en11.mp3" },
  { name: "Bài hát 2", file: "song2.mp3" },
  { name: "Bài hát 3", file: "song3.mp3" },
  { name: "Bài hát 4", file: "song4.mp3" },
  { name: "Bài hát 5", file: "song5.mp3" },
  { name: "Bài hát 6", file: "song6.mp3" },
  { name: "Bài hát 7", file: "song7.mp3" },
  { name: "Bài hát 8", file: "song8.mp3" },
  { name: "Bài hát 9", file: "song9.mp3" },
  { name: "Bài hát 10", file: "song10.mp3" }
];

let currentAudio = null;

function playRandomSong() {
  const randomIndex = Math.floor(Math.random() * songs.length);
  const song = songs[randomIndex];

  // Stop current song
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  // Play new song
  currentAudio = new Audio(song.file);
  currentAudio.play();

  // Show popup
  const popup = document.getElementById('popupNotification');
  const popupInner = popup.querySelector('.popup-inner');
  popupInner.textContent = '🎵 Đang phát: ' + song.name;

  popup.classList.add('show');
  setTimeout(() => {
    popup.classList.add('hide');
    setTimeout(() => {
      popup.classList.remove('show', 'hide');
    }, 500);
  }, 3000);

  // Auto next
  currentAudio.addEventListener('ended', function () {
    playRandomSong();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const toast = document.getElementById('toast-prompt');
  const confirmBtn = document.querySelector('.confirm-btn');
  const closeBtn = document.querySelector('.close-btn');

  confirmBtn.addEventListener('click', () => {
    toast.remove();
    playRandomSong();
  });

  closeBtn.addEventListener('click', () => {
    toast.remove();
  });
});
