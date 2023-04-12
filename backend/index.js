import express from 'express';
import DB from './db.js'

const PORT = process.env.PORT || 3000;

/** Zentrales Objekt für unsere Express-Applikation */
const app = express();

app.use(express.json());

/** global instance of our database */
let db = new DB();

/** Initialize database connection */
async function initDB() {
    await db.connect();
    console.log("Connected to database");
}

// implement API routes

/** Return all todos. 
 *  Be aware that the db methods return promises, so we need to use either `await` or `then` here! 
 */
app.get('/todos', async (req, res) => {
    let todos = await db.queryAll();
    res.json(todos);
});

app.get('/todos/:id', async (request, response) => {

    // request.params.id kann alphanumerisch sein, deshalb in Typ number konvertieren
    const id = request.params.id;

    const todo = await db.queryById(id);

    console.log(todo);

    // Todo als JSON-Antwort senden
    response.json(todo);

});

/**
 * Todo anlegen
 */
app.post('/todos', (request, response) => {

    // geparsten Inhalt an todo übergeben
    const todo = request.body;

    db.insert(todo);

    response.json(todo);

});

/**
 * Todo mit bestimmter Id aktualisieren
 */
app.put('/todos/:id', (request, response) => {

    const id = request.params.id;

    console.log(id);

    db.update(id, request.body);

    response.status(200).json(request.body);

});

/**
 * Todo mit bestimmter Id löschen
 */
app.delete('/todos/:id', (request, response) => {

    // request.params.id kann alphanumerisch sein, deshalb in Typ number konvertieren
    const id = request.params.id;

    db.delete(id);

    // Status senden
    response.sendStatus(204);

});

initDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        })
    })

