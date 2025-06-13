const express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    sanitizer = require('sanitizer'),
    app = express(),
    port = 8000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.set('view engine', 'ejs');

let todolist = [];

/* Display Todo List */
app.get('/todo', function (req, res) {
    res.render('todo', { todolist });
});

/* Add a Task */
app.post('/todo/add/', function (req, res) {
    let newTodo = req.body.newtodo.trim();
    if (newTodo) {
        todolist.push({ text: sanitizer.escape(newTodo), completed: false, favorite: false });
    }
    res.redirect('/todo');
});

/* Delete a Task */
app.get('/todo/delete/:id', function (req, res) {
    let id = parseInt(req.params.id);
    if (!isNaN(id) && id >= 0 && id < todolist.length) {
        todolist.splice(id, 1);
    }
    res.redirect('/todo');
});

/* Toggle Complete Task */
app.get('/todo/complete/:id', function (req, res) {
    let id = parseInt(req.params.id);
    if (!isNaN(id) && id >= 0 && id < todolist.length) {
        todolist[id].completed = !todolist[id].completed;
    }
    res.redirect('/todo');
});

/* Toggle Favorite Task */
app.get('/todo/favorite/:id', function (req, res) {
    let id = parseInt(req.params.id);
    if (!isNaN(id) && id >= 0 && id < todolist.length) {
        todolist[id].favorite = !todolist[id].favorite;
    }
    res.redirect('/todo');
});

/* Edit Task - Render Edit Page */
app.get('/todo/:id', function (req, res) {
    let id = parseInt(req.params.id);
    if (!isNaN(id) && id >= 0 && id < todolist.length) {
        res.render('edititem', { todoIdx: id, todo: todolist[id].text });
    } else {
        res.redirect('/todo');
    }
});

/* Save Edited Task */
app.put('/todo/edit/:id', function (req, res) {
    let id = parseInt(req.params.id);
    let editTodo = req.body.editTodo.trim();
    if (!isNaN(id) && id >= 0 && id < todolist.length && editTodo) {
        todolist[id].text = sanitizer.escape(editTodo);
    }
    res.redirect('/todo');
});

/* Redirect Unknown Routes */
app.use((req, res) => res.redirect('/todo'));

/* Start Server */
app.listen(port, () => console.log(`Todo List is live on http://0.0.0.0:${port}`));
