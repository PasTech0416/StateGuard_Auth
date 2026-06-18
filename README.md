# 🛡️ StateGuard_Auth

Focus ingegneristico sui meccanismi di autenticazione persistenza dello stato e gestione avanzata della sicurezza dei cookie HTTP un approccio ottimizzato per il monitoraggio dei flussi di rete interamente da Command Line Interface (CLI)

---

## 🚀 Caratteristiche Architetturali

* **Isolamento dello Stato:** Gestione rigorosa tra le preferenze d'interfaccia lato client e i contesti di autenticazione sensibili lato server via sessioni blindate
  
* **Persistenza Stato Stateful:** Integrazione di un modulo FileStore per la storicizzazione asincrona su disco delle sessioni attive, superando i limiti di allocazione in memoria RAM
  
* **Mitigazione XSS/CSRF:** Configurazione nativa del flag httpOnly: true per impedire la lettura del token via JavaScript client-side e direttive sameSite: 'lax' per neutralizzare attacchi Cross-Site Request Forgery

* **Security by Obscurity:** Offuscamento dell'identificativo tecnologico di default del framework Express tramite la firma personalizzata del cookie nel token proprietario stateguard.sid

---

## 🛠️ Stack Tecnologico

* **Core Runtime:** Node.js
* **Backend Framework:** Express.js
* **Session Management:** Express-Session e Session-File-Store
* **Security e Parsing:** Dotenv e Cookie-Parser
* **Testing e CLI Utility:** Curl, Bash e Json_pp

---

## 📦 Guida all'Uso e Condotta dei Test CLI

### 1. Inizializzazione Ambiente
Inizializza l'ambiente installando le dipendenze locali e avviando il server in modalità di sviluppo con hot-reload attivo:

npm install
npm start

### 2. Ispezione dello Stato Iniziale Anonimo
Esegui il controllo iniziale per validare l'assenza di sessioni attive sul client e sul server:

curl -s http://localhost:3000/status | json_pp

### 3. Autenticazione e Cattura Cookie Blindato
Autenticazione via POST con payload JSON e cattura del cookie inviato dall'header Set-Cookie:

curl -i -X POST -H "Content-Type: application/json" -d '{"username":"admin_developer"}' -c cookie.txt http://localhost:3000/login

### 4. Verifica della Mutazione dello Stato
Esegui il test iniettando il cookie precedentemente memorizzato nel file locale:

curl -s -b cookie.txt http://localhost:3000/status | json_pp

### 5. Audit del File Store di Sessione sul Server
Ispezione dell'ultimo record JSON registrato su disco per verificare la persistenza fisica della sessione:

ls -t sessions/*.json | head -n 1 | xargs cat | json_pp
