document.addEventListener("DOMContentLoaded", () => {
    //Liste von Künstler-IDs, die zur zufälligen Auswahl verwendet werden
    const artistIds = [
        1, 357, 45, 1, 412, 61, 4, 5, 197, 2,
        105, 74, 59, 194, 88, 106, 99, 309, 243, 320,
        82, 205, 153, 307, 166, 137, 331, 457, 659, 354,
        633, 143, 757, 1234, 429675, 384236, 288166, 246791, 4050205, 1562681,
        9635624, 5996035, 1361234, 1309082, 657938, 1531592, 412, 892, 371, 38,
        73, 45, 2, 123, 56, 150, 68, 129, 89, 52,
        69, 60, 407, 231, 97, 119, 87, 234, 109, 91,
        100, 308, 108, 79, 394, 389, 932, 1238, 1668, 907,
        580, 1201, 1118, 5889, 1897, 13, 170, 300, 523, 860,
        1170, 408, 132, 574, 719, 1104, 240, 420, 800, 850
    ];
    //API-Schlüssel und Host-URL für Deezer API
    const apiKey = "deezer API key";
    const apiHost = "deezerdevs-deezer.p.rapidapi.com";

    //Funktion zur zufälligen Auswahl einer Künstler-ID aus der Liste
    function getRandomArtistId() {
        const randomIndex = Math.floor(Math.random() * artistIds.length);
        return artistIds[randomIndex];
    }

    //Funktion zum Laden eines zufälligen Künstlers über die Deezer API
    function loadRandomArtist() {
        const randomId = getRandomArtistId();
        const apiUrl = `https://deezerdevs-deezer.p.rapidapi.com/artist/${randomId}`;

        fetch(apiUrl, {
            method: "GET",
            headers: {
                "x-rapidapi-key": apiKey,
                "x-rapidapi-host": apiHost
            }
        })
        .then(response => response.json()) //Die Antwort wird als JSON geparst
        .then(data => {
            //Überprüft, ob es einen Fehler gibt, wenn ja, wird ein neuer Künstler geladen
            if (data.error) {
                console.error('Error fetching the artist data:', data.error.message);
                loadRandomArtist(); // Retry on error
                return;
            }
            //Anzeigen vom Bild und Namen des Künstlers
            document.getElementById('artist-image').src = data.picture_big;
            document.getElementById('artist-name').textContent = data.name;
           
        })
        .catch(error => console.error('Error fetching the artist data:', error));
    }

    //Lade einen zufälligen Künstler und wiederhole es alle 5 Sekunden
    loadRandomArtist();
    setInterval(loadRandomArtist, 5000);
});


//Event Listener, der auf Scrollen reagiert
window.addEventListener('scroll', function() {
    const headlineContainer = document.getElementById('headline-container');
    const scrollPosition = window.scrollY; //aktuelle Scroll-Position
    const triggerPosition = 500; //Punkt, ab dem die Überschrift angezeigt werden soll (in Pixel)

    //wenn Scroll-Position größer als der Triggerpunkt ist, wird die Überschrift sichtbar
    if (scrollPosition > triggerPosition) {
        headlineContainer.classList.add('visible');
    } else {
        headlineContainer.classList.remove('visible');
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const mask = document.getElementById('mask');
    const section4 = document.getElementById('section4');
    let maskVisible = false;

    // Trigger-Scrollposition in Pixeln, ab der die Maske verschwinden soll
    const scrollHidePosition = 2000;

    //Mausposition tracken und prüfen, ob sie sich innerhalb von section4 befindet
    window.addEventListener('mousemove', (e) => {
        const rect = section4.getBoundingClientRect();

        //Prüfen, ob die Maus innerhalb von section4 ist
        if (e.clientY >= rect.top && e.clientY <= rect.bottom && e.clientX >= rect.left && e.clientX <= rect.right) {
            const relativeY = e.clientY - rect.top;

            //Wenn die Maus eine bestimmte Linie überschreitet, wird die Maske sichtbar gemacht
            if (relativeY >= 0) {
                maskVisible = true;
                mask.style.left = `${e.clientX}px`;
                mask.style.top = `${e.clientY}px`;
                mask.style.display = 'block'; 
            } else {
                mask.style.display = 'none';//Maske verbergen, wenn außerhalb der Linie
            }
        } else {
            mask.style.display = 'none'; //Maske verbergen, wenn Maus außerhalb von section4
        }
    });


    // Event Listener für Mausbewegungen in section4, um die Maske weiter zu bewegen
    section4.addEventListener('mousemove', (e) => {
        if (maskVisible) {
            mask.style.left = `${e.clientX}px`;
            mask.style.top = `${e.clientY}px`;
            mask.style.display = 'block'; // Maske sichtbar halten
        }
    });

});

/*Scan and go*/

document.addEventListener("DOMContentLoaded", () => {
    const mask = document.getElementById('mask');
    const qrCode = document.getElementById('qr-code');
    
    //Event Listener für Mausbewegungen
    document.querySelector('#section4').addEventListener('mousemove', (e) => {
        const section4 = document.querySelector('#section4');
        const rect = section4.getBoundingClientRect();

        // Aktualisiere die Position des mask-Elements
        mask.style.left = `${e.clientX - rect.left}px`;
        mask.style.top = `${e.clientY - rect.top}px`;

        // Überprüfen, ob der Kreis über dem QR-Code ist
        const qrRect = qrCode.getBoundingClientRect();
        const maskRect = mask.getBoundingClientRect();

        //Prüfen, ob die Maske mit dem QR-Code überlappt
        const isOverlapping = !(maskRect.right < qrRect.left || 
                                maskRect.left > qrRect.right || 
                                maskRect.bottom < qrRect.top || 
                                maskRect.top > qrRect.bottom);

        //Wenn die Maske den QR-Code überlappt, zeige ihn an                        
        if (isOverlapping) {
            qrCode.classList.add('visible'); //QR-Code sichtbar machen
        } else {
            qrCode.classList.remove('visible'); //QR-Code ausblenden
        }
    });
});










