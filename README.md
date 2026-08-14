# HypeCinema - Sistem za rezervaciju i kupovinu bioskopskih karata

HypeCinema je savremeni veb sistem namenjen automatizaciji procesa rezervacije i kupovine bioskopskih karata. Projekat je realizovan primenom klijent-server arhitekture, gde backend koristi robustan i bezbedan Java Spring Boot REST API, dok je frontend razvijen kao klijentska Single Page aplikacija (SPA) bazirana na React biblioteci.

Sistem omogućava interaktivnu selekciju sedišta u realnom vremenu, upravljanje programom lojalnosti korisnika, generisanje jedinstvenih identifikatora rezervacije sa QR kodom za validaciju, kao i administrativno upravljanje celokupnim sistemom (CRUD nad filmovima, salama i projekcijama). Klijentska aplikacija poseduje ugrađen hibridni mehanizam perzistencije koji obezbeđuje automatski prelazak na lokalni režim rada (offline fallback) u slučaju nedostupnosti backend servera.

---

## Sadržaj
- [Tehnološki stek](#tehnološki-stek)
- [Ključne funkcionalnosti](#ključne-funkcionalnosti)
- [Arhitektura sistema](#arhitektura-sistema)
  - [Baza podataka i modeli](#baza-podataka-i-modeli)
  - [API Endpoints](#api-endpoints)
- [Arhitektura klijentske aplikacije](#arhitektura-klijentske-aplikacije)
- [Instalacija i pokretanje](#instalacija-i-pokretanje)
  - [Pokretanje Backend-a](#pokretanje-backend-a)
  - [Pokretanje Frontend-a](#pokretanje-frontend-a)
- [Kredencijali za testiranje](#kredencijali-za-testiranje)

---

## Tehnološki stek

### Server (Backend)
- **Razvojna platforma:** Java 17
- **Radni okvir:** Spring Boot 3.x
- **Bezbednost:** Spring Security, JWT (JSON Web Token) za stateless autentifikaciju i autorizaciju zasnovanu na ulogama (RBAC)
- **Rad sa podacima:** Spring Data JPA, Hibernate ORM
- **Baza podataka:** H2 Database Engine (fajl-bazirana perzistencija u `./backend/data/hypecinemadb`)
- **Validacija:** Jakarta Validation API

### Klijent (Frontend)
- **Biblioteka:** React 18
- **Alat za izgradnju:** Vite
- **Rutiranje:** React Router DOM v6
- **Autentifikacija:** JWT-Decode za parsiranje korisničkih tokena
- **Vizuelizacija karata:** QRCode biblioteka za generisanje 2D kodova na kartama
- **Grafički elementi:** Lucide React paket vektorskih ikona
- **Stilovi:** Prilagođeni Vanilla CSS sa podrškom za tamni režim (dark mode) i responzivni dizajn

---

## Ključne funkcionalnosti

1. **Autentifikacija i autorizacija:**
   - Registracija novih korisnika i prijava na sistem uz izdavanje JWT tokena.
   - Kontrola pristupa zasnovana na ulogama korisnika: klijent (`ROLE_USER`) i administrator (`ROLE_ADMIN`).
   - Kriptovanje korisničkih lozinki primenom BCrypt algoritma.

2. **Program lojalnosti (Loyalty Program):**
   - Praćenje nivoa lojalnosti na osnovu sakupljenih poena pri kupovini karata.
   - Kategorizacija korisnika u tri ranga: **BRONZE** (0-500 poena), **SILVER** (500-1000 poena) i **GOLD** (preko 1000 poena).
   - Automatsko ažuriranje ranga i dodela poena nakon svake uspešne transakcije.

3. **Interaktivni grafički prikaz sala:**
   - Dinamičko iscrtavanje rasporeda sedišta na osnovu dimenzija izabrane bioskopske sale.
   - Prikaz statusa sedišta (slobodno, odabrano, rezervisano) u realnom vremenu za selektovanu projekciju.

4. **Rezervacioni sistem i izdavanje karata:**
   - Pregledna kalkulacija ukupne vrednosti porudžbine na klijentskoj strani.
   - Generisanje jedinstvenog referentnog koda rezervacije i pratećeg QR koda koji služi za elektronsku validaciju karte.
   - Mogućnost otkazivanja rezervacije od strane klijenta sa automatskim oslobađanjem mesta i povratom lojaliti poena (ukoliko se otkazivanje izvrši pre početka projekcije).

5. **Administrativni panel:**
   - Potpuna administracija kataloga filmova (kreiranje, izmena, brisanje i ažuriranje statusa prikazivanja).
   - Upravljanje salama i definisanje njihovih kapaciteta.
   - Kreiranje i brisanje termina projekcija.

6. **Hibridni offline fallback režim:**
   - Detekcija statusa mrežne veze i automatsko preusmeravanje na lokalnu bazu (`localStorage`) u slučaju nedostupnosti servera.
   - Sinhronizacija i osvežavanje stanja odmah po ponovnom uspostavljanju veze sa API-jem.

---

## Arhitektura sistema

Backend aplikacija je strukturirana u skladu sa višeslojnom arhitekturom kako bi se postiglo logičko razdvajanje odgovornosti, lakše testiranje i visoka modularnost koda:

```
com.bioskop.hypecinema/
├── HypeCinemaApplication.java      # Ulazna tačka Spring Boot aplikacije
├── config/                         # Klase za konfiguraciju bezbednosti i inicijalizaciju podataka
├── controller/                     # REST Kontroleri (izlaganje API endpoint-a)
├── dto/                            # Objekti za prenos podataka (Data Transfer Objects)
├── model/                          # JPA entiteti (mapiranje relacionih tabela)
├── repository/                     # Spring Data JPA repozitorijumi za direktan rad sa bazom
├── security/                       # Sigurnosne komponente (JWT filteri, provajderi)
└── service/                        # Poslovna logika aplikacije (servisi i implementacije)
```

### Baza podataka i modeli

Relaciona struktura baze podataka sastoji se od šest entiteta koji precizno modeluju domen poslovanja bioskopa:

```
   +--------------+             +----------------+             +----------------+
   |     User     |1         0..*|    Booking     |1         0..*|  BookingSeat   |
   +--------------+             +----------------+             +----------------+
   | id (PK)      |             | id (PK)        |             | id (PK)        |
   | username     |             | bookingRef     |             | booking_id (FK)|
   | email        |             | user_id (FK)   |             | rowNum         |
   | loyaltyTier  |             | screening (FK) |             | seatNum        |
   | points       |             | totalPrice     |             +----------------+
   +--------------+             +----------------+
                                        |*
                                        |
                                        |1
   +--------------+             +----------------+
   |    Movie     |1         0..*|   Screening    |
   +--------------+             +----------------+
   | id (PK)      |             | id (PK)        |
   | title        |             | movie_id (FK)  |
   | genre        |             | hall_id (FK)   |
   | duration     |             | startTime      |
   | status       |             | ticketPrice    |
   +--------------+             +----------------+
                                        |*
                                        |
                                        |1
                                +----------------+
                                |   CinemaHall   |
                                +----------------+
                                | id (PK)        |
                                | name           |
                                | totalSeats     |
                                +----------------+
```

#### Opis entiteta:
- **User:** Predstavlja registrovanog korisnika sistema. Čuva lojaliti poene, nivo lojalnosti, ulogu, kao i metapodatke o kreiranju i izmeni naloga.
- **Movie:** Definiše film na repertoaru sa detaljima o naslovu, žanru, trajanju, oceni, režiseru, glumačkoj postavi i statusu (`NOW_SHOWING` / `COMING_SOON`).
- **CinemaHall:** Predstavlja salu u bioskopu sa definisanim brojem redova i brojem sedišta po redu na osnovu kojih se automatski izračunava ukupan kapacitet.
- **Screening:** Predstavlja pojedinačni termin prikazivanja filma u određenoj sali sa definisanom cenom karte i vremenom početka.
- **Booking:** Predstavlja kreiranu rezervaciju karata od strane klijenta za određenu projekciju. Sadrži referentni kod, ukupnu cenu i status rezervacije.
- **BookingSeat:** Predstavlja instancu rezervisanog sedišta (broj reda i broj sedišta u redu) povezanu sa krovnom rezervacijom.

---

### API Endpoints

REST API se nalazi na baznoj URI putanji `/api` na portu `8080`. Sve rute osim javnih zahtevaju prosleđivanje ispravnog JWT tokena unutar zaglavlja zahteva u formatu: `Authorization: Bearer <token>`.

| Kontroler | Metoda | Putanja | Nivo pristupa | Opis rute |
| :--- | :---: | :--- | :---: | :--- |
| **Auth** | `POST` | `/api/auth/register` | Javni pristup | Registracija novog klijentskog naloga |
| **Auth** | `POST` | `/api/auth/login` | Javni pristup | Prijava na sistem (vraća JWT token i detalje o sesiji) |
| **Auth** | `GET` | `/api/auth/me` | Korisnik / Admin | Dobavljanje podataka o trenutno prijavljenom korisniku |
| **Auth** | `GET` | `/api/auth/admin-check` | Admin | Validacija administratorskih privilegija |
| **Movies** | `GET` | `/api/movies` | Javni pristup | Pregled celokupnog repertoara filmova |
| **Movies** | `GET` | `/api/movies/{id}` | Javni pristup | Dobavljanje informacija o pojedinačnom filmu |
| **Movies** | `POST` | `/api/movies` | Admin | Dodavanje novog filma u bazu podataka |
| **Movies** | `PUT` | `/api/movies/{id}` | Admin | Izmena postojećih podataka o filmu |
| **Movies** | `DELETE` | `/api/movies/{id}` | Admin | Trajno uklanjanje filma sa repertoara |
| **Halls** | `GET` | `/api/halls` | Javni pristup | Dobavljanje liste svih bioskopskih sala |
| **Halls** | `GET` | `/api/halls/{id}` | Javni pristup | Dobavljanje podataka o specifičnoj sali |
| **Halls** | `POST` | `/api/halls` | Admin | Registrovanje nove bioskopske sale |
| **Halls** | `DELETE` | `/api/halls/{id}` | Admin | Uklanjanje bioskopske sale iz sistema |
| **Screenings** | `GET` | `/api/screenings` | Javni pristup | Dobavljanje liste svih aktivnih projekcija |
| **Screenings** | `GET` | `/api/screenings/movie/{movieId}` | Javni pristup | Dobavljanje svih projekcija za izabrani film |
| **Screenings** | `GET` | `/api/screenings/{id}` | Javni pristup | Pregled pojedinačne projekcije |
| **Screenings** | `POST` | `/api/screenings` | Admin | Dodavanje novog termina projekcije |
| **Screenings** | `DELETE` | `/api/screenings/{id}` | Admin | Brisanje termina projekcije |
| **Bookings** | `POST` | `/api/bookings` | Korisnik | Kreiranje rezervacije i kupovina karata |
| **Bookings** | `GET` | `/api/bookings/my-bookings` | Korisnik | Istorija rezervacija za prijavljenog korisnika |
| **Bookings** | `GET` | `/api/bookings/all` | Admin | Centralni pregled svih rezervacija u sistemu |
| **Bookings** | `GET` | `/api/bookings/reference/{ref}`| Korisnik / Admin | Pretraga rezervacije preko referentne šifre |
| **Bookings** | `GET` | `/api/bookings/occupied-seats/{id}` | Javni pristup | Spisak zauzetih sedišta za odabranu projekciju |
| **Bookings** | `PUT` | `/api/bookings/{id}/cancel` | Korisnik | Otkazivanje rezervacije i oslobađanje sedišta |

---

## Arhitektura klijentske aplikacije

Klijentska aplikacija je implementirana kao Single Page Application (SPA) i struktuirana na sledeći način:

```
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx             # Definicija klijentskih ruta i kontrola globalnog stanja
    ├── index.css           # Globalni CSS stilovi i sistemske promenljive (teme)
    ├── main.jsx            # Glavna ulazna tačka klijentske aplikacije
    ├── components/         # Višekratno upotrebljive UI komponente
    │   ├── AuthModal.jsx   # Modal za registraciju i prijavu sa validacijom formi
    │   ├── Button.jsx      # Generička komponenta tastera sa varijacijama u dizajnu
    │   ├── Layout.jsx      # Glavni okvir stranice (zaglavlje, podnožje, navigacija)
    │   ├── Modal.jsx       # Standardni kontejner za modalne prozore
    │   └── Toast.jsx       # Sistem za prikazivanje brzih obaveštenja korisniku
    ├── context/
    │   └── AuthContext.jsx # Globalno stanje autentifikacije i korisničkog profila
    ├── data/               # Statički podaci korišćeni za inicijalizaciju i offline režim
    │   ├── bookings.js
    │   ├── cinemas.js
    │   ├── movies.js
    │   └── watchlist.js
    ├── pages/              # Pogledi (stranice) aplikacije
    │   ├── HomePage.jsx          # Početni ekran sa pretragom i katalogom filmova
    │   ├── MovieDetailsPage.jsx  # Prikaz detalja o filmu sa pripadajućim projekcijama
    │   ├── SeatSelectionPage.jsx # Interaktivni modul za odabir sedišta u sali
    │   ├── CheckoutPage.jsx      # Završni korak rezervacije sa unosom podataka
    │   ├── ReservationsPage.jsx  # Korisnički profil sa istorijom transakcija
    │   ├── SchedulePage.jsx      # Kalendarski raspored projekcija sa filterima
    │   └── AdminPage.jsx         # Kontrolna tabla za administratorske operacije
    └── services/
        └── api.js          # Servis za mrežnu komunikaciju i automatsku lokalnu perzistenciju
```

---

## Instalacija i pokretanje

### Preduslovi
Pre započinjanja instalacije, uverite se da na svom sistemu imate instalirane sledeće alate:
- **Java SE Development Kit (JDK) 17** ili noviji
- **Apache Maven** (opciono, ukoliko želite da koristite lokalnu instalaciju umesto priloženog omotača)
- **Node.js** (verzija 18 ili novija) i **npm** paket menadžer

### Pokretanje Backend-a

1. Pozicionirajte se u direktorijum `backend`:
   ```bash
   cd backend
   ```

2. Pokrenite server pomoću Maven omotača:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(Za Windows operativne sisteme, koristite komandu `mvnw.cmd spring-boot:run` ili sistemsku instalaciju `mvn spring-boot:run`)*

Nakon uspešnog pokretanja:
- Backend server će biti dostupan na adresi: `http://localhost:8080`
- Konzola za nadgledanje i upravljanje H2 bazom podataka se pokreće na adresi: `http://localhost:8080/h2-console`
  - **JDBC URL:** `jdbc:h2:file:./data/hypecinemadb`
  - **Username:** `sa`
  - **Password:** *(ostaviti prazno polje)*

---

### Pokretanje Frontend-a

1. Pozicionirajte se u direktorijum `frontend`:
   ```bash
   cd frontend
   ```

2. Instalirajte sve zavisnosti navedene u `package.json` datoteci:
   ```bash
   npm install
   ```

3. Pokrenite lokalni razvojni server:
   ```bash
   npm run dev
   ```

Klijentska aplikacija će po završetku prevođenja biti dostupna na adresi:
- `http://localhost:5173`

---

## Kredencijali za testiranje

Prilikom inicijalnog startovanja servera, baza podataka se automatski popunjava podacima neophodnim za testiranje svih funkcionalnosti aplikacije:

### Administratorski nalog
- **Korisničko ime (Username):** `admin`
- **Lozinka (Password):** `admin123`
- **Uloga:** `ROLE_ADMIN`
- **Nivo lojalnosti:** `GOLD` (1850 poena)
- *Napomena:* Ovaj nalog se koristi za administraciju celokupnog sistema i ima pristup kontrolnoj tabli na ruti `/admin`.

### Demo korisnički nalog
- **Korisničko ime (Username):** `john_doe`
- **Lozinka (Password):** `user123`
- **Uloga:** `ROLE_USER`
- **Nivo lojalnosti:** `SILVER` (650 poena)
- *Napomena:* Ovaj nalog se koristi za simulaciju standardnog klijentskog ponašanja, rezervaciju sedišta i proveru stanja na profilu.

### Registracija novog klijenta
Sistem takođe omogućava kreiranje potpuno novog naloga direktno kroz grafički interfejs klikom na opciju "Prijavi se" -> "Registruj se". Svaki novoregistrovani nalog automatski dobija ulogu običnog korisnika (`ROLE_USER`) sa rangom lojalnosti `BRONZE` (0 poena).
