document.addEventListener('DOMContentLoaded', async () => {
    const genresContainer = document.getElementById('genres-container');
    const carousel = document.getElementById('genres-carousel');
    const leftButton = document.querySelector('.carousel-button.left');
    const rightButton = document.querySelector('.carousel-button.right');

     //Überprüfen, ob der Genres-Container existiert
    if (!genresContainer) {
        console.error('Element mit der ID "genres-container" nicht gefunden.');
        return;
    }

    //Liste der Genre-IDs, die für die API-Anfragen verwendet werden
    const genreIds = [132, 152, , 85, 95, 129, 165, 116, 144, 173, 98, 169, 113]; 
    const genrePromises = genreIds.map(id => fetchGenreData(id));

    try {
        //Alle Genre-Daten von der API abrufen
        const allGenres = await Promise.all(genrePromises);
        allGenres.forEach(genreData => {
            if (genreData) {
                //Wenn Daten vorhanden sind, das Genre anzeigen
                displayGenre(genreData);
            } else {
                console.error('Keine Genre-Daten gefunden.');
            }
        });
    } catch (error) {
        console.error('Fehler beim Laden der Genre-Daten:', error);
    }

    let currentIndex = 0; //Aktueller Index für das Karussell

    //Funktion, um die ersten und letzten Elemente zu duplizieren (für Endlosschleifen-Effekt)
    function duplicateItems() {
        const container = document.getElementById('genres-container');
        const items = Array.from(container.children);
        const numOfDuplicates = 2; // Anzahl der zu duplizierenden Elemente
    
        // Die letzten zwei Elemente werden an den Anfang kopiert
        items.slice(-numOfDuplicates).forEach(item => {
            const clone = item.cloneNode(true);
            container.insertBefore(clone, container.firstChild);
        });
    
        // Die ersten zwei Elemente werden ans Ende kopiert
        items.slice(0, numOfDuplicates).forEach(item => {
            const clone = item.cloneNode(true);
            container.appendChild(clone);
        });
    }
    
    duplicateItems(); //Aufruf der Funktion
    

    //Klick-Event für den rechten Button (Vorwärtsbewegen im Karussell)
    rightButton.addEventListener('click', () => {
        const totalItems = genresContainer.children.length;
        const visibleItems = 2; //Anzahl der sichtbaren Elemente im Karussell
    
        //Wenn der aktuelle Index noch innerhalb des sichtbaren Bereichs ist, vorwärts bewegen
        if (currentIndex < totalItems - visibleItems) {
            currentIndex++;
        } else {
            //Wenn das Ende erreicht ist, springe zum Anfang und setze die Animation zurück
            genresContainer.style.transition = "none";
            currentIndex = visibleItems; 
            updateCarousel();
    
            setTimeout(() => {
                genresContainer.style.transition = "transform 0.5s ease-in-out";
                currentIndex++;
                updateCarousel();
            }, 50); //leichte Verzögerung, um den Übergang zu aktualisieren
        }
    
        updateCarousel(); //Karussell aktualisieren
    });
    
    
     
    
    
    //Klick-Event für den linken Button (Rückwärtsbewegen im Karussell)
    leftButton.addEventListener('click', () => {
        const totalItems = genresContainer.children.length;
        const visibleItems = 2; //anzahl der sichtbaren Elemente im Karussell
    
        //wenn der aktuelle Index noch größer als 0 ist-> rückwärts bewegen
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            // Wenn der Anfang erreicht ist _>zum Ende springen und Animation zurücksetzen
            genresContainer.style.transition = "none"; 
            currentIndex = totalItems - visibleItems * 2; 
            updateCarousel();
    
            setTimeout(() => {
                genresContainer.style.transition = "transform 0.5s ease-in-out"; 
                currentIndex--;
                updateCarousel();
            }, 50);//Leichte Verzögerung, um den Übergang zu aktualisieren
        }
    
        updateCarousel(); //Karussell aktualisieren
    });
    
    
    
    

    //Funktion, um das Karussell zu aktualisieren (Position der Elemente basierend auf dem aktuellen Index)
    function updateCarousel() {
        const genreWidth = genresContainer.children[currentIndex].offsetWidth; //Breite eines Genre-Elements
        const offset = currentIndex * -genreWidth; //Verschiebung für Karussel-Bewegung berechnen
        genresContainer.style.transform = `translateX(${offset}px)`;
    }
    
    
    //Funktion, um die Genre-Daten von der API abzurufen
    async function fetchGenreData(id) {
        const url = `https://deezerdevs-deezer.p.rapidapi.com/genre/${id}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '38b065bafemsh4592292504f0750p1ddfc0jsn6d0f55dc976e',
                'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        };

        try {
            //Verzögerung einfügrn, um die API-Anfragen zu regulieren (Vermeidung von Rate-Limits)
            await new Promise(resolve => setTimeout(resolve, 700)); 
            const response = await fetch(url, options);
            
            // Überprüfen, ob das Rate-Limit überschritten wurde
            if (response.status === 429) {
                console.error('Rate limit exceeded. Waiting to retry...');
                await new Promise(resolve => setTimeout(resolve, 5000)); // 5 Sekunden warten, bevor erneut versucht wird
                return fetchGenreData(id); //erneuter Versuch der API-Anfrage
            }
    
            const result = await response.json();
            return result; //Genre-Daten zurückgeben
        } catch (error) {
            console.error('Fehler beim Abrufen der Genre-Daten:', error);
            return null;
        }
    }



    //Funktion, um ein Genre-Element im DOM anzuzeigen
    function displayGenre(genre) {
        const genreDiv = document.createElement('div'); //Neues div-Element für das Genre erstellen
        genreDiv.className = 'genre'; //CSS-Klasse für das Genre-Element
        genreDiv.innerHTML = `
            <img src="${genre.picture_medium}" alt="${genre.name}">
            <h3>${genre.name}</h3>
        `;
        //Genre-Element dem Container hinzufügen
        genresContainer.appendChild(genreDiv);
    }
});






