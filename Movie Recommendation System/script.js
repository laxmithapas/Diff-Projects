// Fictional movie data
const movies = [
    { title: 'The Starlight Saga', genre: 'Sci-Fi', year: 2024, synopsis: 'A deep-space crew discovers a planet with a long-lost civilization.', rating: 8.5 },
    { title: 'Operation Falcon', genre: 'Action', year: 2023, synopsis: 'A special agent must stop a rogue AI from launching a global attack.', rating: 7.9 },
    { title: 'The Lost Treasure of Maru', genre: 'Action', year: 2022, synopsis: 'An archaeologist and her team race to find an ancient treasure.', rating: 8.1 },
    { title: 'City of Laughter', genre: 'Comedy', year: 2024, synopsis: 'A series of hilarious mishaps occur when a small town gets a new mayor.', rating: 7.2 },
    { title: 'Echoes of the Past', genre: 'Drama', year: 2023, synopsis: 'A family secret comes to light, forcing two siblings to confront their shared history.', rating: 9.0 },
    { title: 'Cosmic Drift', genre: 'Sci-Fi', year: 2021, synopsis: 'Astronauts on a remote mission encounter an unknown cosmic anomaly.', rating: 8.3 },
    { title: 'The Great Heist', genre: 'Action', year: 2020, synopsis: 'A master thief plans one last, impossible robbery to retire for good.', rating: 7.5 },
    { title: 'The Quiet Life', genre: 'Drama', year: 2022, synopsis: 'A poignant story about a writer who finds peace in a secluded cabin.', rating: 8.8 },
    { title: 'Giggle Squad', genre: 'Comedy', year: 2021, synopsis: 'A group of friends attempts to win an absurd local talent show.', rating: 7.0 },
];

const movieListContainer = document.getElementById('movie-list');

function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.className = 'p-6 bg-white rounded-2xl shadow-lg flex flex-col space-y-3 transform transition-transform duration-200 hover:scale-[1.02]';
    movieCard.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800">${movie.title}</h3>
        <div class="flex items-center space-x-2 text-gray-500">
            <span class="text-sm font-semibold">${movie.genre}</span>
            <span class="text-sm">•</span>
            <span class="text-sm">${movie.year}</span>
        </div>
        <p class="text-gray-700 text-base">${movie.synopsis}</p>
        <div class="flex items-center mt-auto pt-2 text-yellow-500">
            <span class="ml-1 font-bold text-gray-800">${movie.rating}</span>
        </div>
    `;
    return movieCard;
}

function renderMovies(moviesToRender) {
    movieListContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    moviesToRender.forEach(movie => {
        fragment.appendChild(createMovieCard(movie));
    });
    movieListContainer.appendChild(fragment);
}

function filterMovies(genre) {
    if (genre === 'All') {
        renderMovies(movies);
    } else {
        renderMovies(movies.filter(movie => movie.genre === genre));
    }
}

function surpriseMe() {
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    renderMovies([randomMovie]);
}

document.addEventListener('DOMContentLoaded', () => {
    renderMovies(movies);
});
