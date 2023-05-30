var videoContainer = document.getElementById('videoContainer'),
    output = document.getElementById('output'),
    nextVideo,
    videoObjects =
    [
        document.createElement('video'),
        document.createElement('video')
    ],
    // vidSources =
    // [
    //     "SampleVideo_1280x720_1mb.mp4",
    //     "sample-20s.mp4",
    //     "file_example_MP4_1920_18MG.mp4"
    //     //"http://www.w3schools.com/html/mov_bbb.mp4",
    //     //"http://www.w3schools.com/html/movie.mp4",
    //     //"http://www.w3schools.com/html/mov_bbb.mp4",
    //     //"http://www.w3schools.com/html/movie.mp4",
    //     //"http://www.w3schools.com/html/mov_bbb.mp4",
    //     //"http://www.w3schools.com/html/movie.mp4"
    //     //this list could be additionally filled without any other changing from code
    // ],
    vidSources =
    [   { 'name' : 'SampleVideo_1280x720_1mb.mp4' },
        { 'name' : 'sample-20s.mp4' },
        { 'name' : 'file_example_MP4_1920_18MG.mp4' }
        // { 'name' : 'http://www.w3schools.com/html/mov_bbb.mp4' },
        // { 'name' : 'http://www.w3schools.com/html/movie.mp4' },
        // { 'name' : 'http://www.w3schools.com/html/mov_bbb.mp4' },
        // { 'name' : 'http://www.w3schools.com/html/movie.mp4' },
        // { 'name' : 'http://www.w3schools.com/html/mov_bbb.mp4' }
        //"http://www.w3schools.com/html/mov_bbb.mp4",
        //"http://www.w3schools.com/html/movie.mp4",
        //"http://www.w3schools.com/html/mov_bbb.mp4",
        //"http://www.w3schools.com/html/movie.mp4",
        //"http://www.w3schools.com/html/mov_bbb.mp4",
        //"http://www.w3schools.com/html/movie.mp4"
        //this list could be additionally filled without any other changing from code
    ],
    vidSourcesurl=[],

    //random starting point
    nextActiveVideo = Math.floor((Math.random() * vidSources.length));

videoObjects[0].inx = 0; //set index
videoObjects[1].inx = 1;

initVideoElement(videoObjects[0]);
initVideoElement(videoObjects[1]);

//videoObjects[0].autoplay = true;
//videoObjects[0].src = vidSources[nextActiveVideo].name;
videoContainer.appendChild(videoObjects[0]);

videoObjects[1].style.display = 'none';
videoContainer.appendChild(videoObjects[1]);

        console.log(vidSourcesurl)
function initVideoElement(video)
{
    video.playsinline = true;
    video.muted = false;
    video.preload = 'auto'; //but do not set autoplay, because it deletes preload

    //loadedmetadata is wrong because if we use it then we get endless loop
    video.onplaying = function(e)
    {
        output.innerHTML = 'Current video source index: ' + nextActiveVideo;

        //select next index. If is equal vidSources.length then it is 0
        nextActiveVideo = ++nextActiveVideo % vidSources.length;

        //replace the video elements against each other:
        if(this.inx == 0)
            nextVideo = videoObjects[1];
        else
            nextVideo = videoObjects[0];

        //nextVideo.src = vidSources[nextActiveVideo].name;
        nextVideo.src = vidSourcesurl[nextActiveVideo];
        nextVideo.pause();
    };

    video.onended = function(e) {
        this.style.display = 'none';
        nextVideo.style.display = 'block';
        nextVideo.play();
    };

    function togglePlay() {
      videoObjects[0].autoplay = true;
      if (video.paused || video.ended) {
        video.play();
        this.style.display="none"
      } else {
        //video.pause();
        this.style.display="none"
      }
      init();
    }

    document.querySelector('.plybtn').addEventListener("click", togglePlay);
}



// Create constants
const section = document.querySelector('section');
const videos = [
  { 'name' : 'crystal' },
  { 'name' : 'elf' },
  { 'name' : 'frog' },
  { 'name' : 'monster' },
  { 'name' : 'pig' },
  { 'name' : 'rabbit' }
];
/*const videos = [   
        { 'name' : 'crystal' },
        { 'name' : 'SampleVideo_1280x720_1mb' },
        { 'name' : 'sample-20s' },
        { 'name' : 'file_example_MP4_1920_18MG' }
        // { 'name' : 'http://www.w3schools.com/html/mov_bbb.mp4' },
        // { 'name' : 'http://www.w3schools.com/html/movie.mp4' },
        // { 'name' : 'http://www.w3schools.com/html/mov_bbb.mp4' },
        // { 'name' : 'http://www.w3schools.com/html/movie.mp4' },
        // { 'name' : 'http://www.w3schools.com/html/mov_bbb.mp4' }
        //"http://www.w3schools.com/html/mov_bbb.mp4",
        //"http://www.w3schools.com/html/movie.mp4",
        //"http://www.w3schools.com/html/mov_bbb.mp4",
        //"http://www.w3schools.com/html/movie.mp4",
        //"http://www.w3schools.com/html/mov_bbb.mp4",
        //"http://www.w3schools.com/html/movie.mp4"
        //this list could be additionally filled without any other changing from code
    ];*/
// Create an instance of a db object for us to store our database in
let db;

function init() {
  // Loop through the video names one by one
  for(const video of videos) {
    // Open transaction, get object store, and get() each video by name
    const objectStore = db.transaction('videos_os').objectStore('videos_os');
    const request = objectStore.get(video.name);
    //console.log(video.name)
    request.addEventListener('success', () => {
      // If the result exists in the database (is not undefined)
      if(request.result) {
        // Grab the videos from IDB and display them using displayVideo()
        console.log('taking videos from IDB');
        displayVideo(request.result.mp4, request.result.webm, request.result.name);
      } else {
        // Fetch the videos from the network
        fetchVideoFromNetwork(video);
      }
    });
  }
}

// Define the fetchVideoFromNetwork() function
function fetchVideoFromNetwork(video) {
  console.log('fetching videos from network');
  // Fetch the MP4 and WebM versions of the video using the fetch() function,
  // then expose their response bodies as blobs
  const mp4Blob = fetch(`videos/${video.name}.mp4`).then(response => response.blob());
  const webmBlob = fetch(`videos/${video.name}.webm`).then(response => response.blob());

  // Only run the next code when both promises have fulfilled
  Promise.all([mp4Blob, webmBlob]).then(values => {
    // display the video fetched from the network with displayVideo()
    displayVideo(values[0], values[1], video.name);
    // store it in the IDB using storeVideo()
    storeVideo(values[0], values[1], video.name);
  });
}

// Define the storeVideo() function
function storeVideo(mp4Blob, webmBlob, name) {
  // Open transaction, get object store; make it a readwrite so we can write to the IDB
  const objectStore = db.transaction(['videos_os'], 'readwrite').objectStore('videos_os');
  // Create a record to add to the IDB
  const record = {
    mp4 : mp4Blob,
    webm : webmBlob,
    name : name
  }

  // Add the record to the IDB using add()
  const request = objectStore.add(record);

  request.addEventListener('success', () => console.log('Record addition attempt finished'));
  request.addEventListener('error', () => console.error(request.error));
}

// Define the displayVideo() function
function displayVideo(mp4Blob, webmBlob, title) {
  // Create object URLs out of the blobs
  const mp4URL = URL.createObjectURL(mp4Blob);
  const webmURL = URL.createObjectURL(webmBlob);

  // Create DOM elements to embed video in the page
  const article = document.createElement('article');
  const h2 = document.createElement('h2');
  h2.textContent = title;
  const video = document.createElement('video');
  video.controls = true;
  const source1 = document.createElement('source');
  source1.src = mp4URL;
  source1.type = 'video/mp4';
  const source2 = document.createElement('source');
  source2.src = webmURL;
  source2.type = 'video/webm';


  videoObjects[0].src = mp4URL;

  vidSourcesurl.push(mp4URL)

  

  // Embed DOM elements into page
  //section.appendChild(video);
  //video.appendChild(source1);
  //video.appendChild(source2);
}

// Open our database; it is created if it doesn't already exist
// (see upgradeneeded below)
const request = window.indexedDB.open('videos_db', 1);

// error handler signifies that the database didn't open successfully
request.addEventListener('error', () => console.error('Database failed to open'));

// success handler signifies that the database opened successfully
request.addEventListener('success', () => {
  console.log('Database opened succesfully');

  // Store the opened database object in the db variable. This is used a lot below
  db = request.result;
  init();
  //console.log( request.result)
});

// Setup the database tables if this has not already been done
request.addEventListener('upgradeneeded', e => {

  // Grab a reference to the opened database
  const db = e.target.result;

  // Create an objectStore to store our videos in (basically like a single table)
  // including a auto-incrementing key
  const objectStore = db.createObjectStore('videos_os', { keyPath: 'name' });

  // Define what data items the objectStore will contain
  objectStore.createIndex('mp4', 'mp4', { unique: false });
  objectStore.createIndex('webm', 'webm', { unique: false });

  console.log('Database setup complete');
});

// Register service worker to control making site work offline
if('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(() => console.log('Service Worker Registered'));
}

