const path = require("path");
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const express = require('express');
const flash = require('connect-flash');
const favicon = require("serve-favicon");
const bodyparser = require("body-parser");
const session = require('express-session');
const app = express();

/**
 * Variables.
 */
let ssn;
const saltRounds = 10;

/**
 * MySQL Connection.
 */
let conn = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'infile'
});
conn.connect();

/**
 * Express configuration.
 */
app.use(session({
    secret:'The milk would do that',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});
app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.use('/js', express.static(path.join(__dirname, '/public/js')));
app.use('/css', express.static(path.join(__dirname, '/public/css')));
app.use(flash());
// app.engine('html', require('ejs').renderFile);
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);

/**
 * Start Express server.
 */
app.listen(app.get("port"), function () {
    console.log(("App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
    console.log("Press CTRL-C to stop\n");
});

/**
 * Primary app routes.
 */
app.get('/', function (req, res) {
    ssn = req.session;
    if (ssn.mail) {
        res.redirect('/home');
    } else {
        res.render('index.ejs', { root: path.join(__dirname, './views') });
    }
});

app.get('/home', function(req, res) {
    ssn = req.session;
    if (!ssn.mail) {
        res.redirect('/');
    } else {
        res.render('home.ejs', { root: path.join(__dirname, './views') });
    }
});

app.post('/updatePassSchool', function(req, res) {
    let idSchool = req.body.id_school;
    let pass = req.body.pass;
    bcrypt.hash(pass, saltRounds, function(err, hash) {
        let sql = "UPDATE colegio SET password = ? WHERE id_colegio = ?";
        conn.query(sql, [hash, idSchool], function (err, result, fields) {
            if (err) throw err;
            res.send({message: 'Table Data', Total_record:result.length, result:result});
        });
    });
});

app.post('/login', function(req, res){
    let mail = req.body.mail;
    let pass = req.body.pass;
    if (mail != '' && pass != '') {
        let sql = "SELECT * FROM colegio WHERE correo = ?";
        conn.query(sql, [mail], function (err, result, fields) {
            if (err) {
                req.flash('info', 'No existe el usuario.');
                res.redirect('/');
            } else {
                let savedPass = result[0].password;
                let idSchool = result[0].id_colegio;
                bcrypt.compare(pass, savedPass, function (err, result) {
                    if (result) {
                        ssn = req.session;
                        ssn.mail = mail;
                        ssn.id_school = idSchool;
                        res.redirect('/home');
                    } else {
                        req.flash('error', 'Credenciales incorrectas.');
                        res.redirect('/');
                    }
                });
            }
        });
    } else {
        res.redirect('/');
    }
});

app.get('/logout',function(req,res){
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

app.get('/registerStudent', function(req, res){
    
    ssn = req.session;
    
    let nombre = req.query.aname;
    let apellido = req.query.alastname;
    let genero = req.query.agenero;

    console.log(nombre);
    console.log(apellido);
    console.log(genero);

    if (nombre != '' && apellido != '' && genero != '') {
        let sql = "INSERT INTO alumno (nombre, apellido, genero) VALUES (?, ?, ?)";
        conn.query(sql, [nombre, apellido, genero], function (err, result, fields) {
            if (err) {
                console.log(err);
                req.flash('error', 'Ocurrió un error al registrar al alumno.');
                res.redirect('/home');
            } else {
                let idAlumno = result.insertId;
                sql = "INSERT INTO registro (estado, ref_id_colegio, ref_id_alumno) VALUES (?, ?, ?)";
                conn.query(sql, [1, ssn.id_school, idAlumno], function (err, result, fields) {
                    if (err) {
                        req.flash('error', 'Ocurrió un error al vincular al alumno con el colegio.');
                        res.redirect('/home');
                    } else {
                        req.flash('info', 'Alumno registrado y vinculado correctamente.');
                        res.redirect('/home');
                    }
                });
            }
        });
    } else {
        res.redirect('/');
    }

});