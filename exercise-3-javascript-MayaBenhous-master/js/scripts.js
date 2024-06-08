window.onload = () => {
  initSongs();
};

function initRectangles() {
  const name = ["M", "a", "y", "a", "B", "e", "n", "h", "o", "u", "s"];
}

function initSongs() {
  fetch("data/music.json")
    .then((response) => response.json())
    .then((data) => populateSongsInList(data));
}

function chooseRectangleColor() {
  const colors = ["#F0F8FF", "#7FFFD4", "#00FFFF", "#6495ED", "#E9967A"];
}

function addRectangle() {
  const wrapper = document.getElementById("wrapper");
  const songTitle = document.createElement("section");
  
}

function subtractRectangle() {}

function switchRectanglesSongs() {}

function populateSongsInList(data) {
  const wrapper = document.getElementById("wrapper");
  const songTitle = document.createElement("h1");
  wrapper.appendChild(songTitle);
  document.querySelector("h1").innerHTML = `${data.musicTitle}`;
  const ulFrag = document.createDocumentFragment();
  const songsList = document.createElement("ul");
  ulFrag.appendChild(songsList);
  for (const s in data.songs) {
    const songItem = document.createElement("li");
    const song = data.songs[s];
    const songStr = `${song.id}. ${song.artist} - ${song.songName}`;
    songItem.innerHTML = songStr;
    songsList.appendChild(songItem);
  }
  wrapper.appendChild(ulFrag);
}
