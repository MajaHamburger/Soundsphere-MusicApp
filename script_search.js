document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const tracksList = document.getElementById('tracks-list');
    const artistInfoContainer = document.getElementById('artist-info');

    //Funktion, die die Suche nach einem Künstler und dessen Tracks ausführt
    const performSearch = async () => {
        //Holt die Eingabe aus dem Suchfeld und entfernt überflüssige Leerzeichen
        const query = searchInput.value.trim();
        if (query) {
            //Suche nach dem Künstler basierend auf dem eingegebenen Namen
            const artist = await searchArtistByName(query);
            if (artist) {
                const detailedArtist = await getArtistDetails(artist.id);
                displayArtistInfo(detailedArtist);
                const tracks = await searchTracks(query);
                displayTracks(tracks);
            } else {
                artistInfoContainer.innerHTML = '<p>No artist found.</p>';
                tracksList.innerHTML = '<p>No tracks found.</p>';
            }
        }
    };

    //Event-Listener für den Klick auf den Suchbutton
    searchButton.addEventListener('click', performSearch);

    //Event-Listener für das Drücken der Enter-Taste im Suchfeld
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    //Funktion, um einen Künstler nach Name zu suchen
    const searchArtistByName = async (query) => {
        const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '38b065bafemsh4592292504f0750p1ddfc0jsn6d0f55dc976e',
                'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        };

        try {
            //Anfrage an die API senden und Ergebnis als JSON zurückgeben
            const response = await fetch(url, options);
            const result = await response.json();
            //Gib den ersten gefundenen Künstler zurück, wenn vorhanden
            return result.data.length > 0 ? result.data[0].artist : null;
        } catch (error) {
            console.error('Error fetching artist data:', error);
            return null;
        }
    };

    //Funktion, um detaillierte Informationen zu einem Künstler abzurufen
    const getArtistDetails = async (artistId) => {
        const url = `https://deezerdevs-deezer.p.rapidapi.com/artist/${artistId}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '38b065bafemsh4592292504f0750p1ddfc0jsn6d0f55dc976e',
                'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        };

        try {
            //Anfrage an die API senden und detaillierte Künstlerdaten zurückgeben
            const response = await fetch(url, options);
            return await response.json();
        } catch (error) {
            console.error('Error fetching artist details:', error);
            return null;
        }
    };

    //Funktion, um Tracks basierend auf dem Suchbegriff zu suchen
    const searchTracks = async (query) => {
        const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '38b065bafemsh4592292504f0750p1ddfc0jsn6d0f55dc976e',
                'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        };

        try {
            //Anfrage an die API senden und Tracks-Daten zurückgeben
            const response = await fetch(url, options);
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching tracks:', error);
            return [];
        }
    };

    //Funktion, um die Informationen eines Künstlers anzuzeigen
    const displayArtistInfo = (artist) => {
        artistInfoContainer.innerHTML = ''; //Vorherige Künstlerinfos löschen
        if (!artist) {
            artistInfoContainer.innerHTML = '<p>No artist found.</p>';
        } else {
            const fansCount = artist.nb_fan ? artist.nb_fan.toLocaleString() : 'N/A'; // Fallback to 'N/A' if undefined
            
            const pictureUrl = window.matchMedia("(max-width: 400px)").matches ? artist.picture_small : artist.picture_medium;

            //Anzeigen der Künstlerinfos
            artistInfoContainer.innerHTML = `
                <div class="artist-info">
                    <img src="${pictureUrl}" alt="${artist.name}">
                    <div class="artist-details">
                        <h3>${artist.name}</h3>
                        <p>${fansCount} fans</p>
                    </div>
                </div>
            `;

            //Click-Event hinzufügen, um zur Künstlerseite weiterzuleiten
            artistInfoContainer.querySelector('.artist-info').addEventListener('click', () => {
                window.location.href = `artist.html?id=${artist.id}`;
            });
        }
    };

    //Funktion, um die gefundenen Tracks anzuzeigen
    const displayTracks = (tracks) => {
        tracksList.innerHTML = '';  //Vorherige Tracks löschen
        if (tracks.length === 0) {
            tracksList.innerHTML = '<p>No tracks found.</p>';
        } else {
            //Erstelle ein Element für jeden gefundenen Track
            tracks.forEach(track => {
                const trackItem = document.createElement('div');
                trackItem.className = 'track-item';
                trackItem.innerHTML = `
                    <img src="${track.album.cover_medium}" alt="${track.title}">
                    <div class="track-info">
                        <h3>${track.title}</h3>
                        <p>${track.artist.name} - ${track.album.title}</p>
                    </div>
                `;
                //Hinzufügen des Track-Elements zur Track-Liste
                tracksList.appendChild(trackItem);
            });
        }
    };
});
