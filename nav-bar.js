class NavBar extends HTMLElement {
    constructor() {
        super();
        //Shadow DOM erstellen
        const shadow = this.attachShadow({ mode: 'open' });

        //Hauptcontainer
        const nav = document.createElement('nav');
        nav.classList.add('nav-bar');

        //Logo-Element
        const logoContainer = document.createElement('div');
        logoContainer.classList.add('logo');
        const logo = document.createElement('img');
        logo.src = this.getAttribute('logo-src');
        logo.alt = 'Logo';
        logo.id = 'logo';
        logoContainer.appendChild(logo);

       //Link und Link-Name
        const linkContainer = document.createElement('div');
        linkContainer.id = 'options';
        const link = document.createElement('a');
        link.href = this.getAttribute('link-url'); //Dynamischer Link
        link.textContent = this.getAttribute('link-name'); //Dynamischer Link-Name
        link.classList.add('nav');
        linkContainer.appendChild(link);

        nav.appendChild(logoContainer);
        nav.appendChild(linkContainer);

        //Shadow DOM wird mit dem nav-Element befüllt
        shadow.appendChild(nav);

        //Styles im Shadow DOM hinzufügen
        const style = document.createElement('style');
        style.textContent = `
          .nav-bar {
            position: fixed;
            width: 100%;
            top:0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.5); 
            z-index: 1000;
        }

        .nav {
            margin-right: 0.1%;
            color: aliceblue;
            text-decoration: none;
        }


        @media (max-width: 480px) {
            .nav {
                margin-right: 5%;
            }
            .nav-bar {
                height: 8%;
                padding: 2%;
            }
            #logo {
                width: 30%; 
                height: auto;
                margin-left: -5%;
            }
            #options a {
                font-size: small;
                font-weight: 1000;
                margin-right: 20px;
            }
        }

        @media (min-width: 1025px) {
            .nav-bar {
                height: 10%;
                padding: 0.5%;
            }
            #logo {
                width: 15%;
                height: auto;
                margin-left: 30px;
                margin-top:5px;
                margin-bottom:2px;
            }
            #options a {
                font-size: large;
                font-weight: 700;
                margin-right: 80px;
            }
            #options a:hover {
                color: #ddd;
            }
        }
        `;
        shadow.appendChild(style);
    }
}

// Definiere das neue HTML-Element <nav-bar>
customElements.define('nav-bar', NavBar);
