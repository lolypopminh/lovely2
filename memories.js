(function () {
  const SLIDE_INTERVAL = 4000;

  const emptyAlbum = document.getElementById('empty-album');
  const currentMemory = document.getElementById('current-memory');
  const memoryImage = document.getElementById('memory-image');
  const memoryCaption = document.getElementById('memory-caption');
  const photoCount = document.getElementById('photo-count');
  const photoThumbnails = document.getElementById('photo-thumbnails');
  const albumStatus = document.getElementById('album-status');
  const previousButton = document.getElementById('previous-photo');
  const nextButton = document.getElementById('next-photo');
  const playButton = document.getElementById('play-slideshow');

  let photos = [];
  let activeIndex = 0;
  let slideshowTimer;

  function stopSlideshow() {
    window.clearInterval(slideshowTimer);
    slideshowTimer = undefined;
    playButton.setAttribute('aria-pressed', 'false');
    playButton.innerHTML = '<span aria-hidden="true">&#9654;</span> Start slideshow';
  }

  function showPhoto(index) {
    if (photos.length === 0) {
      activeIndex = 0;
      emptyAlbum.hidden = false;
      currentMemory.hidden = true;
      photoThumbnails.replaceChildren();
      photoCount.textContent = 'No photos yet';
      previousButton.disabled = true;
      nextButton.disabled = true;
      playButton.disabled = true;
      stopSlideshow();
      return;
    }

    activeIndex = (index + photos.length) % photos.length;
    const photo = photos[activeIndex];
    emptyAlbum.hidden = true;
    currentMemory.hidden = false;
    memoryImage.src = photo.src;
    memoryImage.alt = photo.caption;
    memoryCaption.textContent = photo.caption;
    photoCount.textContent = (activeIndex + 1) + ' of ' + photos.length;
    previousButton.disabled = photos.length < 2;
    nextButton.disabled = photos.length < 2;
    playButton.disabled = photos.length < 2;
    photoThumbnails.replaceChildren();

    photos.forEach(function (item, itemIndex) {
      const thumbnail = document.createElement('button');
      const image = document.createElement('img');
      thumbnail.className = 'photo-thumbnail';
      thumbnail.type = 'button';
      thumbnail.setAttribute('aria-label', 'Show photo ' + (itemIndex + 1) + ': ' + item.caption);
      thumbnail.setAttribute('aria-current', String(itemIndex === activeIndex));
      image.src = item.src;
      image.alt = '';
      thumbnail.appendChild(image);
      thumbnail.addEventListener('click', function () {
        showPhoto(itemIndex);
      });
      photoThumbnails.appendChild(thumbnail);
    });

    if (photos.length < 2) {
      stopSlideshow();
    }
  }

  function validatePhoto(entry, index) {
    if (!entry || typeof entry.src !== 'string' || entry.src.trim() === '') {
      throw new Error('Photo ' + (index + 1) + ' in memories.json needs a src path.');
    }

    const src = new URL(entry.src, document.baseURI);
    if (src.origin !== window.location.origin) {
      throw new Error('Photo paths must point to files in this site, such as photos/our-trip.jpg.');
    }

    return {
      src: src.href,
      caption: typeof entry.caption === 'string' && entry.caption.trim()
        ? entry.caption.trim()
        : 'Memory ' + (index + 1)
    };
  }

  async function loadAlbum() {
    try {
      const response = await fetch(new URL('memories.json', document.baseURI));
      if (!response.ok) {
        throw new Error('Could not load memories.json (HTTP ' + response.status + ').');
      }

      const data = await response.json();
      if (!data || !Array.isArray(data.photos)) {
        throw new Error('memories.json must contain a photos array.');
      }

      photos = data.photos.map(validatePhoto);
      showPhoto(0);
      albumStatus.textContent = photos.length
        ? 'Album loaded from the repository. Add photos by updating memories.json and the photos/ folder.'
        : 'Add photos to the repository photos/ folder, then list them in memories.json.';
    } catch (error) {
      albumStatus.textContent = 'Could not load the album: ' + error.message;
    }
  }

  memoryImage.addEventListener('error', function () {
    if (photos[activeIndex]) {
      albumStatus.textContent = 'Could not load "' + photos[activeIndex].caption + '". Check its file and path in memories.json.';
    }
  });

  previousButton.addEventListener('click', function () {
    showPhoto(activeIndex - 1);
  });

  nextButton.addEventListener('click', function () {
    showPhoto(activeIndex + 1);
  });

  playButton.addEventListener('click', function () {
    if (slideshowTimer) {
      stopSlideshow();
      return;
    }

    playButton.setAttribute('aria-pressed', 'true');
    playButton.innerHTML = '<span aria-hidden="true">&#8545;</span> Pause slideshow';
    slideshowTimer = window.setInterval(function () {
      showPhoto(activeIndex + 1);
    }, SLIDE_INTERVAL);
  });

  document.addEventListener('keydown', function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    if (event.key === 'ArrowLeft' && photos.length > 1) {
      showPhoto(activeIndex - 1);
    } else if (event.key === 'ArrowRight' && photos.length > 1) {
      showPhoto(activeIndex + 1);
    }
  });

  loadAlbum();
})();
