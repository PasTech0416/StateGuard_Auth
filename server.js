/**
 * ARCHITETTURA DI SISTEMA: StateGuard-Auth (CLI Edition)
 * Ambito: Monitoraggio dello stato utente e sicurezza dei cookie via Terminale.
 */

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const FileStore = require('session-file-store')(session);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Configurazione dello Store delle Sessioni con log di debug via CLI
app.use(session({
    store: new FileStore({ path: './sessions', logFn: () => {} }),
    secret: process.env.SESSION_SECRET || 'stateguard_cli_secret_key_9921',
    resave: false,
    saveUninitialized: false,
    name: 'stateguard.sid',
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 15
    }
}));

// Middleware di logging per vedere le richieste in tempo reale sul terminale
app.use((req, res, next) => {
    console.log(`\n[REQUEST] ${req.method} ${req.url}`);
    console.log(`[CLIENT COOKIES]`, req.cookies);
    console.log(`[SERVER SESSION]`, req.session ? req.session.user : 'Nessuna sessione attiva');
    next();
});

// Endpoint Principale: Ispezione dello stato corrente
app.get('/status', (req, res) => {
    res.json({
        status: "ACTIVE",
        sistema: "StateGuard-Auth Core",
        statoClient: {
            cookieTheme: req.cookies.user_theme || 'non impostato'
        },
        statoServer: {
            autenticato: !!req.session.user,
            datiUtente: req.session.user || null
        }
    });
});

// Endpoint: Impostazione del Cookie del Tema
app.get('/imposta-tema', (req, res) => {
    const { scelta } = req.query;
    res.cookie('user_theme', scelta, { maxAge: 1000 * 60 * 60, path: '/' });
    console.log(`[SICUREZZA] Cookie 'user_theme' impostato a: ${scelta}`);
    res.json({ messaggio: `Cookie user_theme impostato a ${scelta}` });
});

// Endpoint: Inizializzazione della Sessione (Login)
app.post('/login', (req, res) => {
    const { username } = req.body;
    req.session.user = {
        username: username,
        creatoIl: new Date().toLocaleTimeString('it-IT')
    };
    console.log(`[SICUREZZA] Nuova sessione inizializzata per l'utente: ${username}`);
    res.json({ messaggio: "Sessione inizializzata con successo sul server" });
});

// Endpoint: Logout
app.get('/logout', (req, res) => {
    req.session.destroy((errore) => {
        if (errore) return res.status(500).json({ errore: "Impossibile distruggere la sessione" });
        res.clearCookie('stateguard.sid');
        console.log(`[SICUREZZA] Sessione distrutta e cookie rimosso`);
        res.json({ messaggio: "Sessione terminata correttamente" });
    });
});

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🛡️  StateGuard-Auth: Core Engine in ascolto sulla porta ${PORT}`);
    console.log(`====================================================`);
});
