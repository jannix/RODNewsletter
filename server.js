'use strict';
var http = require('http');
var url = require('url');
let bodyParser = require('body-parser');
const mongoose = require('mongoose');
let express = require('express');
const Registered = require('./backend/models/registered');
let app = express();

const port = 8080;

app.set('view engine', 'ejs');

//Middlewares
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://Jadmin:Chocolat10@testcluster-sy6u3.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.get('/', (req, res) => {
    res.render('pages/index');

});

app.post('/', (req, res) => {
    if (req.body.registeringEmail === undefined || req.body.registeringEmail === '') {
        res.render('pages/index', {error : "Where is your mail?"});
    } else {
        Registered.findOne({ email: req.body.registeringEmail })
            .then(registered => {
                if (registered === null)
                {
                    const registered = new Registered({
                        email: req.body.registeringEmail,
                    });
                    registered.save()
                        .then(() => {
                            res.render('pages/index', {registered : "Thank you for riding with us!"});
                        })
                        .catch(error => res.status(400).json({ error }));
                }
                else
                {
                    res.render('pages/index', {registered : "Thank you, you already are riding with us ;)"});
                }

            })
            .catch(error => {
                console.log('cant found this one, create it');
                console.log(error);
            });
    }
});

app.delete('/api/registered/:email', (req, res, next) => {
    Registered.deleteOne({ email: req.params.email })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
});

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

app.listen(port);