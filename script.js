"use strict";

const song = document.getElementById("song");
const coverImg = document.querySelector(".cover-photo");
const songName = document.getElementById("song-name");
const artistName = document.getElementById("artist-name");
const playButton = document.querySelector(".play-pause");
const nextButton = document.querySelector(".next-btn");
const backButton = document.querySelector(".back-btn");
const shuffleButton = document.getElementById("random-btn");
const repeatButton = document.getElementById("repeat-btn");
const progressBar = document.getElementById("seek-bar");
const duration = document.querySelector(".duration");
const remaining = document.querySelector(".remaining");
const playlist = document.getElementById("playlist");
const clickSong = document.querySelectorAll(".song-item");
// const = document.getElementById("canvas-custom");

let isPlaying = false;
let order = 2;
let isNext = true;
////////////////////////////////////////
const list_url_song = [
  "LAN-CUOI-di-ben-em-xot-xa-nguoi-oi-Ngot.mp3",
  "Nang-Tho-Hoang-Dung.mp3",
  "Mot-Ngan-Noi-Dau-Cover-Trung-Quan-Idol.mp3",
  "ChuaQuenNguoiYeuCu-HaNhi-10119678.mp3",
  "TronTim-7UPPERCUTS-7778328.mp3",
  "Miley-Cyrus-Angels-Like-You.mp3",
  "Tang-Thuong-102-Ca-Hoi-Hoang.mp3",
  "Nua-Thap-Ky-25-Met-Vuong-Hoang-Dung.mp3",
];
const list_song = [
  // {
  //   title: "Song title",
  //   artist: "artist",
  //   album: "Album",
  //   src: "Mot-Ngan-Noi-Dau-Cover-Trung-Quan-Idol.mp3",
  //   image: "",
  // },
];
////////////////////////////////

const fetchSongData = (url) => {
  return new Promise((resolve, reject) => {
    //bất đồng bộ
    const jsmediatags = window.jsmediatags;
    fetch(`./music/${url}`)
      .then((response) => response.blob())
      .then((file) => {
        jsmediatags.read(file, {
          onSuccess: function (tag) {
            const title = tag.tags.title;
            const artist = tag.tags.artist;
            const album = tag.tags.album;
            const { data, format } = tag.tags.picture;
            let base64String = "";
            for (let i = 0; i < data.length; i++) {
              base64String += String.fromCharCode(data[i]);
            }

            const song = {
              title: title || "Unknown",
              artist: artist || "Unknown",
              album: album || "Unknown",
              src: `./music/${url}`,
              imgSrc: `data:${data.format};base64,${window.btoa(base64String)}`,
            };
            list_song.push(song);
            resolve();
          },
          onError: function (error) {
            console.log(error);
            reject(error);
          },
        });
      });
  });
};

const fetchPromises = list_url_song.map((url) => fetchSongData(url));

Promise.all(fetchPromises)
  .then(() => {
    console.log("Tất cả dữ liệu đã được lấy và xử lý");
    console.log(list_song);

    //Display song's data (image, name,...)
    function playSong(index) {
      song.setAttribute("src", list_song[index].src);
      coverImg.src = list_song[index].imgSrc;
      songName.textContent = list_song[index].title;
      artistName.textContent = list_song[index].artist;
    }
    playSong(order);

    //play-pause music
    const playingMusic = function () {
      console.log("clicked");
      if (!isPlaying) {
        isPlaying = true;
        playButton.innerHTML =
          '<ion-icon name="pause-circle" class="btn-play-pause" style="width: 50px; height: 50px" ></ion-icon>';
        coverImg.classList.add("animation");
        song.play();
      } else {
        isPlaying = false;
        playButton.innerHTML =
          '<ion-icon name="play-circle" style="width: 50px; height: 50px"></ion-icon>';
        coverImg.classList.remove("animation");
        song.pause();
      }
      songIsPlaying("play");
    };

    playButton.addEventListener("click", playingMusic);

    function changeSong(input) {
      songIsPlaying("pre_next");
      if (isRepeated === true) {
        order = order;
      } else if (isShuffled === true) {
        order = Math.floor(Math.random() * list_song.length);
      } else if (input === true) {
        order++;
        if (order > list_song.length - 1) {
          order = 0;
        }
      } else if (input === false) {
        order--;
        if (order < 0) {
          order = list_song.length - 1;
        }
      }
      playSong(order);
      isPlaying = false;
      playingMusic();
    }

    //check xem bai nao dang chay
    function songIsPlaying(type) {
      if (type === "play") {
        document
          .getElementById(`songitem-${order}`)
          .classList.add("highlight-song");
      } else if (type === "pre_next") {
        document
          .getElementById(`songitem-${order}`)
          .classList.remove("highlight-song");
      }
    }

    //next-song
    nextButton.addEventListener("click", nextButtonClicked);
    function nextButtonClicked() {
      isNext = true;
      changeSong(isNext);
    }

    //back-song
    backButton.addEventListener("click", function () {
      isNext = false;
      changeSong(isNext);
    });

    //Shuffle button
    let isClickedShuffel = false;
    let isShuffled = false;
    shuffleButton.addEventListener("click", function () {
      console.log(document.getElementById("random-btn"));
      if (!isClickedShuffel) {
        shuffleButton.style.color = "green";
        // document.getElementById("random-btn::after").style.display = "inline";
        isClickedShuffel = true;
        isShuffled = true;
      } else {
        shuffleButton.style.color = " rgba(0, 0, 0, 0.63)";
        // document.getElementById("random-btn::after").style.display = "none";
        isClickedShuffel = false;
        isShuffled = false;
      }
    });

    //Repeat Button
    let isClickedRepeat = false;
    let isRepeated = false;
    repeatButton.addEventListener("click", function () {
      if (!isClickedRepeat) {
        repeatButton.style.color = "green";
        isClickedRepeat = true;
        isRepeated = true;
      } else {
        repeatButton.style.color = " rgba(0, 0, 0, 0.63)";
        isClickedRepeat = false;
        isRepeated = false;
      }
    });

    // for (let k = 0; k < clickSong.length; k++) {
    //   clickSong[i].addEventListener("cdblclick", playingMusic());
    //   console.log(1111111111111111111111111111);
    // }

    song.onloadedmetadata = function () {
      progressBar.max = song.duration;
      progressBar.value = song.currentTime;
    };

    //After 500, set value of progress bar and context
    if (!song.pause()) {
      setInterval(() => {
        progressBar.value = song.currentTime;
        duration.textContent = formatTime(song.currentTime);
        remaining.textContent = formatTime(song.duration - song.currentTime);
        song.duration - song.currentTime <= 0 && nextButtonClicked();
      }, 500);
    }
    progressBar.onchange = function () {
      isPlaying = false;
      playingMusic();
      song.currentTime = progressBar.value;
    };

    function formatTime(time) {
      // Format the time in HH:MM:SS format
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      //tra ve chuoi, padStard luon check co 2 ki tu
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    }

    ////////////////////////////////
    list_song.forEach((song, index) => {
      const div = document.createElement("div");
      const span = document.createElement("span");
      const spanTime = document.createElement("span");

      // Đặt văn bản của span bằng tên bài hát
      span.textContent = song.title;
      const audio = new Audio(`${song.src}`);
      audio.addEventListener("loadedmetadata", function () {
        spanTime.textContent = formatTime(audio.duration);
      });
      //Thêm ID bằng index bài
      div.id = `songitem-${index}`;
      span.id = `song-${index}`;
      spanTime.id = `songTime-${index}`;
      div.classList.add("song-item");
      spanTime.classList.add("song-duration");
      // Thêm span vào thẻ div
      div.appendChild(span);
      div.appendChild(spanTime);
      playlist.appendChild(div);
    });

    //make a sound wave
    // document.addEventListener("DOMContentLoaded", function () {
    //   const wavesurfer = WaveSurfer.create({
    //     container: "#waveform",
    //     waveColor: "#4F4A85",
    //     progressColor: "#383351",
    //     barWidth: 4,
    //     height: 90,
    //     responsive,
    //   });
    // });
  })
  .catch((error) => {
    console.log("Lỗi khi lấy và xử lý dữ liệu: " + error);
  });
