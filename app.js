(function() {
    // Dynamisches HTML für die Seite erstellen
    const root = document.getElementById('app'); // Das Ziel-Element, in das alles eingefügt wird

    // Überprüfen, ob das Element mit der ID "root" existiert
    if (!root) {
        console.error('Das Element mit der ID "root" wurde nicht gefunden.');
        return;
    }

    // Dynamischer Inhalt für die Seite
    const body = document.createElement('div');
    body.id = 'top-bar';

    // Logo und Navigation
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const logoImg = document.createElement('img');
    logoImg.src = `https://bayram-usta.de/img/logo.png?id=${Date.now()}`;
    logoImg.width = 40;
    logoImg.height = 40;
    logoImg.alt = 'Logo';
    logoDiv.appendChild(logoImg);
    const logoText = document.createElement('span');
    logoText.textContent = 'Bayram-Usta-Wetzlar';
    logoDiv.appendChild(logoText);
    body.appendChild(logoDiv);

    // Hamburger-Menü
    const navIcon = document.createElement('i');
    navIcon.id = 'navicon';
    navIcon.classList.add('fa-solid', 'fa-bars');
    body.appendChild(navIcon);

    // Header-Bereich
    const header = document.createElement('header');
    header.id = 'header';
    const headerTitle = document.createElement('h1');
    headerTitle.textContent = 'Willkommen bei Bayram Usta';
    const headerDescription = document.createElement('p');
    headerDescription.textContent = 'Das Restaurant für türkische Spezialitäten in Wetzlar';
    const openingHours = document.createElement('p');
    openingHours.id = 'opening-hours';
    openingHours.textContent = 'Öffnungszeiten: Mo-So 11:00-22:00 Uhr';
    header.appendChild(headerTitle);
    header.appendChild(headerDescription);
    header.appendChild(openingHours);
    body.appendChild(header);

    // Seite mit Platz für Inhalte
    const page = document.createElement('div');
    page.id = 'page';
    const speisekarteDiv = document.createElement('div');
    speisekarteDiv.classList.add('speisekarte');
    page.appendChild(speisekarteDiv);
    body.appendChild(page);

    // Side Navigation
    const sideNav = document.createElement('div');
    sideNav.id = 'side-nav';
    const navList = document.createElement('ul');
    const navItems = ['Startseite', 'Speisekarte', 'Über uns', 'Kontakt'];

    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = item;
        if (item === 'Speisekarte') {
            a.id = 'speisekarte';
        }
        li.appendChild(a);
        navList.appendChild(li);
    });

    sideNav.appendChild(navList);
    body.appendChild(sideNav);
    root.appendChild(body); // Den gesamten HTML-Inhalt ins "root"-Element einfügen

    // Slide Menü Toggle
    sideNav.style.cssText = "position:fixed; top:0; right:-250px; width:250px; height:100%; background:#e5d3c9; box-shadow:0 0 10px rgba(0,0,0,0.3); transition:right 0.3s ease; padding:20px;";
    navIcon.onclick = () => {
        sideNav.style.right = sideNav.style.right === '0px' ? '-250px' : '0px';
    };

    // Öffnungszeiten Logik
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const openingTime = 11 * 60; // 11:00 Uhr in Minuten
    const closingTime = 22 * 60; // 22:00 Uhr in Minuten

    if (currentTimeInMinutes >= openingTime && currentTimeInMinutes < closingTime) {
        openingHours.textContent = 'Wir haben geöffnet';
    } else {
        openingHours.textContent = 'Wir haben geschlossen';
    }

    // Speisekarte laden
    document.getElementById('speisekarte').addEventListener('click', function() {
        fetch('speisekarte.js') // Lade die speisekarte.js
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Netzwerkantwort war nicht ok: ${response.statusText}`);
                }
                return response.text();
            })
            .then(scriptContent => {
                const scriptElement = document.createElement('script');
                scriptElement.textContent = scriptContent;
                document.body.appendChild(scriptElement); // Script an Body anhängen
                console.log('speisekarte.js wurde erfolgreich geladen und ausgeführt.');
            })
            .catch(error => {
                console.error('Fehler beim Laden der speisekarte.js:', error);
            });
    });
});
document.title = 'Bayram Usta Wetzlar'; // Setze den Titel des Dokuments
