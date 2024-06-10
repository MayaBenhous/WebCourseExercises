window.onload = () => {
  initRectangles();
};

const colors = ["#F0F8FF", "#7FFFD4", "#00FFFF", "#6495ED", "#E9967A"];
const myName = "Maya Benhous";
const characters = myName.split(/\s*/);
let indexColor = 0;
let indexName = 0;
let numRects = 0;
let pageRect = true;

function initRectangles() {
  pageRect = true;
  for (let i = 0; i < characters.length; i++) {
    addRectangle();
  }
  // console.log(numRects);
}

function initSongs() {
  pageRect = false;
  fetch("data/music.json")
    .then((response) => response.json())
    .then((data) => populateSongsInList(data));
}

function chooseRectangleColor() {}

function addRectangle() {
  if (pageRect) {
    const wrapper = document.getElementById("wrapper");
    const rectengle = document.createElement("section");
    wrapper.appendChild(rectengle);
    rectengle.classList.add("rect");
    rectengle.style.backgroundColor = colors[indexColor];
    indexColor++;
    if (indexColor == colors.length) indexColor = 0;
    rectengle.textContent = characters[indexName];
    indexName++;
    if (indexName == characters.length) indexName = 0;
    numRects++;
  }
}

function subtractRectangle() {
  if (pageRect) {
    const wrapper = document.getElementById("wrapper");
    wrapper.removeChild(wrapper.lastChild);
    indexColor--;
    if ((indexColor < 0)||(indexColor == colors.length)) indexColor == 0;
    indexName--;
    if ((indexName < 0)||(indexName == characters.length)) indexName == 0;
    numRects--;
  }
}

function switchRectanglesSongs() {
  if (pageRect == true) {
    console.log(pageRect);
    initSongs();
    const wrapper = document.getElementById("wrapper");
    let rect;
    console.log("from rect to song");
    for (let i = 0; i < numRects; i++) {
      rect = wrapper.children[i];
      console.log("hidden");
      rect.style.visibility = "hidden";
    }
  } else {
    for (let i = 0; i < numRects; i++) {
      rect = wrapper.children[i];
      rect.style.visibility = "visible";
    }
    for (let i = 0; i < numRects; i++) {
      rect = wrapper.children[i];
      rect.style.visibility = "visible";
    }
    pageRect = true;
    console.log(pageRect);
  }
}

function populateSongsInList(data) {
  const wrapper = document.getElementById("wrapper");
  const songTitle = document.createElement("h1");
  wrapper.appendChild(songTitle);
  document.querySelector("h1").innerHTML = `${data.musicTitle}`;
  const ulFrag = document.createDocumentFragment();
  const songsList = document.createElement("ul");
  // songsList.id.add("songList");
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
