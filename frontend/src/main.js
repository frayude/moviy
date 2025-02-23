import "./style.css";

const imageBaseUrl = "https://image.tmdb.org/t/p/w500"; // Base URL buat gambar
const heroSection = document.querySelector(".hero");
const movieName = document.querySelector(".name");
const overview = document.querySelector(".overview");
const movieInfo = document.querySelector(".movie-info");
const arrows = document.querySelectorAll(".hero-arrows i");
const navbar = document.querySelector(".navbar");

let movies = [];
let currentIndex = 0;

// Hero section
async function fetchHeroMovies() {
  try {
    const response = await fetch("http://localhost:3000/movies");
    if (!response.ok) {
      throw new Error(`HTTP error! Status : ${response.status}`);
    }

    let data = await response.json();
    // Mengambil data
    movies = data.results;

    updateHero(currentIndex);
  } catch (error) {
    console.error("Fetch error", error);
  }
}

// Hero Section
function updateHero(index) {
  const movie = movies[index];

  const id = movie.id;
  releaseDates(id);

  const imageUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  heroSection.style.backgroundImage = `url(${imageUrl})`;

  // Mengganti format date menjadi day month year
  let movieReleaseDate = new Date(movie.release_date);
  // Ambil bagian tanggal, bulan (pakai nama singkatan), dan tahun
  let day = movieReleaseDate.getDate();
  let month = movieReleaseDate.toLocaleString("en-US", { month: "short" });
  let year = movieReleaseDate.getFullYear();

  // Menggabungkan dan mengganti format dari release date
  movieReleaseDate = `${day} ${month} ${year}`;

  movieInfo.innerHTML = `
    <h1 class="title-hero">Movies that will be released soon</h1>
    <h1 class="movie-title">${movie.title}</h1>
    <p class="movie-description">${movie.overview}</p>
    <span>${getGenreNames(movie.genre_ids)}</span>
    <span class="ageCertification"></span>
    <span>Expected ${movieReleaseDate}</span>
      `;
}

// Release Dates
async function releaseDates(id, rating) {
  console.log(id);
  try {
    const response = await fetch(`http://localhost:3000/${id}/releaseDates`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status : ${response.status}`);
    }
    let data = await response.json();
    const datas = data.results;
    updateIso(datas);
  } catch (error) {
    console.error("Fetch error", error);
  }
}

function updateIso(data) {
  // Default value for iso ID
  const country = "ID";

  // Update ISO to ID only
  const found = data.find((item) => item.iso_3166_1 === country);

  if (!found) return console.log("ISO not found");

  // check iso id
  // console.log(found);

  const releaseDates = found.release_dates;

  const ageCertification = releaseDates[0];
  // console.log(ageCertification);

  const tai = ageCertification.certification;
  console.log(tai);

  const releaseDate = ageCertification.release_date;
  console.log(releaseDate);
}

// Event listener buat navigasi arrow
arrows.forEach((arrow) => {
  arrow.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-chevron-right")) {
      currentIndex = (currentIndex + 1) % movies.length;
    } else {
      currentIndex = (currentIndex - 1 + movies.length) % movies.length;
    }
    updateHero(currentIndex);
  });
});

// Genre
let genreMap = {};

async function fetchGenres() {
  try {
    const response = await fetch("http://localhost:3000/genresMovies");

    let data = await response.json();
    genreMap = data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  } catch (error) {
    console.error("Fetch genre error", error);
  }
}

function getGenreNames(genreIds) {
  return genreIds
    .map((id) => `<span class="genre">${genreMap[id] || "Unknown"}</span>`)
    .join("");
}

async function fetchMovies(category) {
  try {
    const response = await fetch(`http://localhost:3000/movies/${category}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status : ${response.status}`);
    }

    let data = await response.json();
    showData(data, category);
  } catch (error) {
    console.error("Fetch error", error);
  }
}

function showData(data, category) {
  const movies = data.results;
  const movieContainer = document.getElementById("main-content");
  const categoryTitle = getCategoryTitle(category);

  // Sort khusus kategori 'upcoming'
  if (category === "upcoming") {
    movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date)); // Urutkan berdasarkan release_date untuk upcoming
  }

  // Buat satu container grid untuk semua card
  movieContainer.innerHTML += `
    <article class="data">
      <h1>${categoryTitle}</h1>
      ${movies.map((movie) => (movie = showCard(movie))).join("")}
    </article>
  `;
}

function showCard(movie) {
  return `
          <section class="card">
          <img src="${imageBaseUrl}${movie.poster_path}" alt="${movie.title}" />
          <span class="title">${movie.title}</span>
          <span class="release-date">${movie.release_date.split("-")[0]}</span>
          </section>
  `;
}

// Title mapping function by category
function getCategoryTitle(category) {
  const categoryTitles = {
    popular: "Trending",
    top_rated: "Top Rated",
    upcoming: "Coming Soon",
  };

  return categoryTitles[category];
}

fetchGenres();
fetchHeroMovies();
// fetchMovies("popular");
