document.addEventListener('DOMContentLoaded', async () => {
    const artistImageContainer = document.getElementById('artist-image');
    const artistNameContainer = document.getElementById('artist-name');
    const artistFansContainer = document.getElementById('artist-fans');
    const artistShareContainer = document.getElementById('artist-share');
    const videoContainer = document.getElementById('youtube-video');
    const apiKey = 'YouTube API Key';

    console.log("DOM fully loaded and parsed.");

    //Holt die Künstler-ID aus der URL (Query-Parameter)
    const artistId = new URLSearchParams(window.location.search).get('id');
    console.log("Artist ID from URL:", artistId);

    //Wenn Künstler-ID vorhanden -> Daten des Künstlers holen
    if (artistId) {
        try {
            const artistData = await fetchArtistData(artistId);
            console.log("Fetched artist data:", artistData);

            //Wenn Künstlerdaten erfolgreich abgerufen wurden, zeige diese an und lade ein zufälliges Musikvideo
            if (artistData) {
                displayArtistDetails(artistData);
                await loadRandomMusicVideo(artistData.name);
            } else {
                console.error('No artist data found.');
            }
        } catch (error) {
            console.error('Error loading artist data:', error);
        }
    } else {
        console.error('No artist ID found in URL.');
    }

    //Funktion, um die Künstlerdaten von Deezer API abzurufen
    async function fetchArtistData(id) {
        const url = `https://deezerdevs-deezer.p.rapidapi.com/artist/${id}`;
        console.log("Fetching artist data from URL:", url);

        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'Deezer API Key',
                'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            console.log("Artist API response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Artist data:", result);
            return result;
        } catch (error) {
            console.error('Error fetching artist data:', error);
            return null;
        }
    }

    //Funktion, um die Details des Künstlers anzuzeigen
    function displayArtistDetails(artist) {
        console.log("Displaying artist details:", artist);
        //Setzt das Künstlerbild und zeigt Name und Fananzahl an
        artistImageContainer.innerHTML = `<img src="${artist.picture_medium}" alt="${artist.name}" class="artist-image">`;
        artistNameContainer.textContent = artist.name;
        artistFansContainer.textContent = `${artist.nb_fan.toLocaleString('de-DE')} fans`;

        //Link zur Deezer-Seite des Künstlers
        artistShareContainer.innerHTML = `<a href="${artist.share}" target="_blank">Show artist on Deezer</a>`;
    }

    //Funktion, um ein zufälliges Musikvideo des Künstlers von YouTube zu laden
    async function loadRandomMusicVideo(artistName) {
        console.log("Artist Name:", artistName);
        //YouTube API-URL für die Suche nach Videos des Künstlers
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(artistName)}&type=video&key=AIzaSyD-zGSI2LCCvmMx2U2KzcqMlyVPQF-NVk4`;
        console.log("Fetching YouTube videos with URL:", searchUrl);

        try {
            const response = await fetch(searchUrl);
            console.log("YouTube API response status:", response.status);

            if (!response.ok) {
                throw new Error(`YouTube API error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("YouTube API response data:", data);

            const videos = data.items || [];
            console.log("Videos fetched:", videos);

            //Filtert die Videos, die den Künstlernamen im Titel enthalten
            const artistVideos = videos.filter(video => video.snippet.title.toLowerCase().includes(artistName.toLowerCase()));
            console.log("Filtered artist videos:", artistVideos);

            //Zeigt ein zufälliges Video aus den gefilterten Videos an
            if (artistVideos.length > 0) {
                const randomIndex = Math.floor(Math.random() * artistVideos.length);
                const randomVideo = artistVideos[randomIndex];

                const videoId = randomVideo.id.videoId;
                const thumbnailUrl = randomVideo.snippet.thumbnails.high.url;
                const videoTitle = randomVideo.snippet.title;
                const videoLink = `https://www.youtube.com/watch?v=${videoId}`;

                console.log("Displaying video:", {
                    videoId, thumbnailUrl, videoTitle, videoLink
                });

                // Video im DOM anzeigen
                videoContainer.innerHTML = `
                    <div class="video-wrapper">
                        <a href="${videoLink}" target="_blank">
                            <img src="${thumbnailUrl}" alt="${videoTitle}" class="video-thumbnail" />
                            <div class="video-overlay">
                                <h3 class="video-title">${videoTitle}</h3>
                            </div>
                        </a>
                    </div>
                `;
            } else {
                console.error('No videos found for the artist.');
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const artistId = new URLSearchParams(window.location.search).get('id');
        console.log("Artist ID from URL:", artistId);
    
        if (artistId) {
            try {
                const artistData = await fetchArtistData(artistId);
                console.log("Fetched artist data:", artistData);
            } catch (error) {
                console.error('Error loading artist data:', error);
            }
        } else {
            console.error('No artist ID found in URL.');
        }
    });
    
});
