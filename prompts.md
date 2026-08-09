# 📝 Bioskop Projekat - Evidencija Rada (prompts.md)

Ovaj fajl hronološki beleži sve faze rada, urađene komponente i promene na projektu.

---

## Faza 1: Inicijalizacija Projekta i Arhitektura Podataka
**Datum:** 2026-08-09

### Urađeno:
- [x] Kreiran `prompts.md` za praćenje rada
- [x] Inicijalizovan React + Vite frontend projekat (`/frontend`)
- [x] Kreirana struktura Spring Boot backend projekta (`/backend`)
- [x] Definisani svi JPA entiteti (6 modela):
  - `User` (korisnik sa ulogama ROLE_USER, ROLE_ADMIN)
  - `Movie` (film sa posterom, žanrom, trajanjem, statusom)
  - `CinemaHall` (sala sa brojem redova i sedišta)
  - `Screening` (projekcija - povezuje film i salu sa terminom)
  - `Booking` (rezervacija - povezuje korisnika sa projekcijom)
  - `BookingSeat` (pojedinačno sedište u rezervaciji)
- [x] Konfigurisan `application.properties` za H2 bazu podataka (development)
- [x] Kreiran `pom.xml` sa svim potrebnim zavisnostima (Spring Web, JPA, Security, JWT, Mail, Stripe)
- [x] Kreirani Repository interfejsi za sve entitete
- [x] Postavljena osnovna struktura paketa (model, repository, service, controller, config, dto)

### Tehnologije korišćene:
- **Frontend:** React 18 + Vite 5, React Router DOM, Axios
- **Backend:** Spring Boot 3.3, Spring Data JPA, Spring Security, JWT (jjwt), H2/MySQL
- **Dodatno:** Mailtrap (JavaMailSender), Stripe Java SDK, QRGen (QR kodovi)

---

## Faza 2.1: Design System, Shared Komponente i Main Page
**Datum:** 2026-08-09

### Urađeno:
- [x] Generisano 7 filmskih postera + 1 hero banner slika (AI generisane)
  - Spider-Man, Dune, Batman, Oppenheimer, Gladiator, Interstellar, Inside Out, Hero Cinema Banner
- [x] Kreiran kompletan CSS Design System sa 300+ linija novih stilova:
  - Button komponenta (primary / secondary / ghost varijante, sm / md / lg veličine)
  - Modal komponenta (glassmorphism overlay, slide-up animacija, escape key close)
  - InputField komponenta (sa ikonama, password toggle, error stanja)
  - Toast notifikacije (success / error / info, auto-dismiss, slide-in animacija)
  - Auth forma (login/register toggle, grid layout za ime/prezime)
  - Hero action dugmići i movie card duration prikaz
- [x] Kreirane reusable React komponente:
  - `Button.jsx` — Višenamenska dugmad sa varijantama
  - `Modal.jsx` — Reusable modal sa backdrop click i Escape close
  - `InputField.jsx` — Input polje sa floating ikonama i password toggle
  - `Toast.jsx` + `ToastContainer` — Sistem notifikacija
  - `AuthModal.jsx` — Kombinovani Login/Register modal sa validacijom
- [x] Kreiran `AuthContext.jsx` — JWT upravljanje (login, logout, role-based access)
- [x] Ažuriran `Layout.jsx` — Auth integracija (login modal za goste, avatar za ulogovane, admin link)
- [x] Ažuriran `App.jsx` — Wrapped sa AuthProvider
- [x] Ažuriran `HomePage.jsx`:
  - Prave slike postera umesto placeholder gradijenata
  - Žanr filter pills koji filtriraju filmove
  - Hero action dugmići (Kupi Kartu, Detaljnije)
  - Prikaz trajanja filma na karticama
  - Navigacija ka detaljima filma na klik kartice

- [x] Unapređenja na HomePage prema zahtevu korisnika:
  - Zamenjene sve žanr "pills" sa jednim elegantnim **Žanr Dropdown** selektorom (`<select>`)
  - Redizajnirane komande za Hero slajder (`.hero-controls`) u donjem desnom uglu sa staklenim morfizmom i strelicama koje više ne prelaze preko teksta
  - Dodat `onError` fallback na slikama koji prikazuje elegantan poster ako slika u `/posters/` folderu još nije ubačena
  - Pripremljena lokacija za slike: `frontend/public/posters/`
- [x] Kreirani i konfigurisani `.gitignore` fajlovi za root i frontend projekat (ignorisanje `node_modules`, `target`, temp `.md` fajlova, `.env`, IDE i OS sistemskih fajlova, uz očuvanje `prompts.md` i `README.md`)

### Nove komponente:
```
frontend/src/
├── components/
│   ├── AuthModal.jsx    (Login/Register modal)
│   ├── Button.jsx       (Reusable button)
│   ├── InputField.jsx   (Reusable input)
│   ├── Layout.jsx       (Ažuriran sa auth)
│   ├── Modal.jsx        (Reusable modal)
│   └── Toast.jsx        (Toast notifikacije)
├── context/
│   └── AuthContext.jsx   (JWT auth context)
└── public/posters/       (Folder za slike postera filmova)
```

---

