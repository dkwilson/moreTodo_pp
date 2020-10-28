const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { json } = require('body-parser');

const app = express();

const port = process.env.PORT = 3000;


// hbs setup
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}))
app.set('view engine', 'hbs')

app.use('/css', express.static(__dirname + '/public/css'))
const jsonParser = bodyParser.json();

// get
app.get('/', (req, res) => {
    fetch('http://localhost:3000/messages')
        .then(response => {
            response.json().then(json => {
                res.render('home', {
                    articles: json
                })
            })
        })
        .catch(error => {
            console.log(error)
        })
})

app.get('/add_note', (req, res) => {
    res.render('add_note')
})

app.get('/edit_note/:id', (req, res) => {
    fetch(`http://localhost:3000/messages/${req.params.id}`)
    .then(response => {
        response.json().then(json => {
            res.render('edit_note')
        })
    })
    .catch(error => {
        console.log(error)
    })
})


// post
app.post('/api/add_note', jsonParser, (req, res)=> {
    fetch('http://localhost:3000/messages', {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: {
            'Content-Type':'application/json'
        }
    }).then((response) => {
        res.status(200).send()
    })
    .catch(error => {
        console.log(error)
    })
})

// delete
app.delete('/api/delete/:id', (req,res) => {
    const id = req.params.id
    fetch(`http://localhost:3000/messages/${id}`, {
       method: 'DELETE'
    }).then(response => {
        res.status(200).send();
    })
    .catch(error => {
        console.log(error)
    })
})

// update 
app.patch('/api/edit_note/:id', jsonParser, (req, res) => {
    const id = req.params.id;

    fetch(`http://localhost:3000/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(req.body),
        headers: {
            'Content-Type':'application/json'
        }
    })
    .then(response => {
        res.status(200).send();
    })
    .catch(error => {
        console.log(error)
    })
})

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
})