// class PQuery {
//   constructor(selector) {
//     this.element = document.querySelector(selector);
//   }
//   html(innerhtml) {
//     this.element.innerHTML = innerhtml;
//   }
//   hide() {
//     this.element.preDisplay = this.element.style.display;
//     this.element.style.setProperty('display', 'none');
//   }
//   on(eventType, cb) {
//     this.element.addEventListener(eventType, cb);
//   }
//   show() {
//     this.element.style.setProperty('display', element.preDisplay);
//   }
// }

// const $$ = (selector) => {
//   return new PQuery(selector);
// };

let $$ = (selector) => {
  const element = document.querySelector(selector);
  const preDisplay = element.style.display;
  return {
    html: (innerHTML) => (element.innerHTML = innerHTML),
    on: (eventType, cb) => element.addEventListener(eventType, cb),
    getValue: () => element.value,
    setValue: (value) => (element.value = value),
    getElement: () => element,
    hide: () => {
      element.style.setProperty('display', 'none');
    },
    show: () => {
      element.style.setProperty('display', preDisplay);
    },
    append: (child) => {
      element.appendChild(child);
    },
  };
};

$$.ajax = async (searchURL) => {
  const result = await fetch(searchURL);
  const response = await result.json();
  return response;
};

// $(document).ready(function ($) {
//   console.log('running');
// $.ajax({
//   // url: `https://jsonplaceholder.typicode.com/todos`,
//   url: 'https://itunes.apple.com/search?term=gaga&media=music&entity=album&attribute=artistTerm&limit=2',
//   type: 'GET',
//   dataType: 'json',
// })
//   .done(function (json) {
//     console.log('json ', json);
//   })
//   .fail(function (xhr, status, err) {
//     console.log('error', err);
//   });
// });

// fetch(
//   `https://itunes.apple.com/search?term=gaga&media=music&entity=album&attribute=artistTerm&limit=2`
// )
//   .then((response) => response.json())
//   .then((result) => {
//     console.log(result);
//   });

const input = $$('.search-header__input');
const searchIcon = $$('.search-header__icon');
const albumsContainer = $$('.albums-container');
const albumTemplate = document.querySelector('#album-item-template');
const searchResultsDisplay = $$('.search-header__results-display');
const count = $$('.count');
const loadingDiv = $$('.search-header__loading-animation-div');

function clearResults() {
  searchResultsDisplay.hide();
  count.html('');
}

console.log('input', input);
console.log('count', count);
console.log('albumTemplate', albumTemplate);

searchIcon.on('click', () => {
  console.log('search icon clicked', searchIcon);
  if (input.getValue() === '') {
    alert(`Please enter artist's name`);
  } else {
    clearResults();
    albumsContainer.html('');
    fetchAlbums(input.value);
  }
  input.setValue('');
});

input.on('keypress', (e) => {
  if (e.key == 'Enter') {
    if (input.getValue() === '') {
      alert(`Please enter artist's name`);
    } else {
      clearResults();
      albumsContainer.innerHTML = '';
      fetchAlbums(input.value);
    }
    input.setValue('');
  }
});

function renderAlbum(item) {
  const templateClone = albumTemplate.content.cloneNode(true);
  const albumCard = templateClone.querySelector('.album-card');
  const albumImg = templateClone.querySelector('.album-img');
  albumImg.src = item.artworkUrl100;
  const artistName = templateClone.querySelector('.artist-name');
  artistName.innerText = item.artistName;
  const albumName = templateClone.querySelector('.album-name');
  albumName.innerText = item.collectionName;
  const albumGenre = templateClone.querySelector('.album-genre');
  albumGenre.innerText = item.primaryGenreName;
  const trackCount = templateClone.querySelector('.track-count');
  trackCount.innerText = item.trackCount;
  const albumCopyRight = templateClone.querySelector('.album-copyright');
  albumCopyRight.innerText = item.copyright;
  albumsContainer.append(templateClone);
}

function fetchAlbums(ARTIST_NAME) {
  loadingDiv.show();

  const searchURL = `https://itunes.apple.com/search?term=${ARTIST_NAME}&media=music&entity=album&attribute=artistTerm&limit=200`;
  $$.ajax(searchURL).then((data) => {
    console.log(data);
    console.log(data.results);

    data.results.forEach((albumItem) => {
      renderAlbum(albumItem);
    });

    loadingDiv.hide();
    searchResultsDisplay.show();
    count.html(data.resultCount);
  });
}
