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

app.get('/admin', function(req, res) {
    ssn = req.session;
    if (!ssn.mail) {
        res.redirect('/');
    } else {
        res.render('admin.ejs', { root: path.join(__dirname, './views') });
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
                req.flash('error', 'No existe el usuario.');
                res.redirect('/');
            } else {
                let savedPass = result[0].password;
                let idSchool = result[0].id_colegio;
                bcrypt.compare(pass, savedPass, function (err, result) {
                    if (result) {
                        ssn = req.session;
                        ssn.mail = mail;
                        ssn.id_school = idSchool;
                        if (mail == 'admin@infile.com') {
                            res.redirect('/admin');
                        } else {
                            res.redirect('/home');
                        }
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

// TODO - Modificar esta api a POST
app.get('/registerStudent', function(req, res){
    
    ssn = req.session;
    
    let nombre = req.query.aname;
    let apellido = req.query.alastname;
    let genero = req.query.agenero;

    if (nombre != '' && apellido != '' && genero != '') {
        let sql = "INSERT INTO alumno (nombre, apellido, genero, estado) VALUES (?, ?, ?, 1)";
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

app.get('/getStudents', function(req, res){

    ssn = req.session;

    let sql = `
        SELECT a.*, m.*, g.*
        FROM alumno a
        JOIN registro r
        ON a.id_alumno = r.ref_id_alumno
        LEFT JOIN matricula m
        ON a.id_alumno = m.ref_id_alumno
        LEFT JOIN grado g
        ON m.ref_id_grado = g.id_grado
        WHERE r.ref_id_colegio = ?
        AND a.estado = 1
    `;

    // let sql = "SELECT a.* FROM alumno a JOIN registro r ON a.id_alumno = r.ref_id_alumno WHERE r.ref_id_colegio = ? AND a.estado = 1";
    conn.query(sql, [ssn.id_school], function (err, result, fields) {
        if (err) {
            console.log(err);
            req.flash('error', 'Ocurrió un error al obtener los alumnos.');
            res.redirect('/home');
        } else {
            res.json({ 'data' : result });
        }
    });

});

app.get('/getStudent/:id', function(req, res){

    let sql = "SELECT * FROM alumno WHERE id_alumno = ?";
    conn.query(sql, [req.params.id], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.json({ 'status': false });
        } else {
            res.json({ 'status': true, 'data' : result });
        }
    });

});

app.post('/updateStudent', function(req, res) {
    let sql = "UPDATE alumno SET nombre = ?, apellido = ?, genero = ? WHERE id_alumno = ?";
    conn.query(sql, [ req.body.ename, req.body.elastname, req.body.egenero, req.body.eid ], function (err, result, fields) {
        if (err) {
            console.log(err);
            req.flash('error', 'Ocurrió un error al obtener los alumnos.');
            res.redirect('/home');
        } else {
            req.flash('info', 'Alumno editado correctamente.');
            res.redirect('/home');
        }
    });
});

app.post('/deleteStudent/:id', function(req, res) {
    let sql = "UPDATE alumno SET estado = 0 WHERE id_alumno = ?";
    conn.query(sql, [ req.params.id ], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.json({ 'status': false, 'msg' : 'Ocurrió un error al eliminar al alumno.' });
        } else {
            res.json({ 'status': true, 'msg' : 'Alumno eliminado correctamente.' });
        }
    });
});

app.get('/getGrados', function(req, res){
    let sql = "SELECT * FROM grado WHERE estado = 1";
    conn.query(sql, [req.params.id], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.json({ 'status': false });
        } else {
            res.json({ 'status': true, 'data' : result });
        }
    });
});

app.get('/getGradoStudent/:id', function(req, res){

    let sql = "SELECT ref_id_grado FROM matricula WHERE id_matricula = ?";
    conn.query(sql, [req.params.id], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.json({ 'status': false });
        } else {
            res.json({ 'status': true, 'data' : result });
        }
    });

});

app.post('/addMatricula', function(req, res){
    let sql = "INSERT INTO matricula (estado, ref_id_alumno, ref_id_grado) VALUES (1, ?, ?)";
    conn.query(sql, [ req.body.m_id_student, req.body.m_grado ], function (err, result, fields) {
        if (err) {
            console.log(err);
            req.flash('error', 'Ocurrió un error al registrar la matricula.');
            res.redirect('/home');
        } else {
            req.flash('info', 'Alumno matriculado correctamente.');
            res.redirect('/home');
        }
    });
});

app.post('/editMatricula', function(req, res){
    let sql = "UPDATE matricula SET ref_id_grado = ? WHERE id_matricula = ?";
    conn.query(sql, [ req.body.me_grado, req.body.me_id_mat ], function (err, result, fields) {
        if (err) {
            console.log(err);
            req.flash('error', 'Ocurrió un error al editar la matricula.');
            res.redirect('/home');
        } else {
            req.flash('info', 'Matricula editada correctamente.');
            res.redirect('/home');
        }
    });
});

app.get('/getCursos', function(req, res){

    let sql = "SELECT * FROM curso WHERE estado = 1";
    conn.query(sql, [], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.json({ 'status': false });
        } else {
            res.json({ 'status': true, 'data' : result });
        }
    });

});

app.post('/asignarCurso', function(req, res){

    // Verifico que el alumno no se encuentre asignado ya al curso.
    let sql = "SELECT * FROM asignacion WHERE ref_id_alumno = ? AND ref_id_curso = ? AND estado = 1";
    conn.query(sql, [req.body.asi_alumno, req.body.asi_curso], function (err, result, fields) {
        if (err) {
            console.log(err);
            req.flash('error', 'Error. No se pudieron obtener las asignaciones.');
            res.redirect('/home');
        } else {
            if (result === undefined || result.length == 0) {
                sql = "INSERT INTO asignacion (zona, final, estado, ref_id_alumno, ref_id_curso) VALUES (0, 0, 1, ?, ?)";
                conn.query(sql, [req.body.asi_alumno, req.body.asi_curso], function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        req.flash('error', 'Ocurrió un error al asignar al alumno al curso.');
                        res.redirect('/home');
                    } else {
                        req.flash('info', 'Curso asignado correctamente.');
                        res.redirect('/home');
                    }
                });
            } else {
                req.flash('error', 'Error. El alumno ya se encuentra asignado a ese curso.');
                res.redirect('/home');
            }
        }
    });

});

app.get('/getNotas', function(req, res){

    ssn = req.session;

    let sql = `
        SELECT a.*, c.nombre as curso, g.grado, al.*
        FROM asignacion a
        JOIN curso c
        ON a.ref_id_curso = c.id_curso
        JOIN alumno al
        ON a.ref_id_alumno = al.id_alumno
        JOIN registro r
        ON r.ref_id_alumno = al.id_alumno
        JOIN matricula m
        ON m.ref_id_alumno = al.id_alumno
        JOIN grado g
        ON m.ref_id_grado = g.id_grado
        WHERE r.ref_id_colegio = ?
    `;

    conn.query(sql, [ssn.id_school], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.json({ 'status': false });
        } else {
            res.json({ 'status': true, 'data' : result });
        }
    });

});

app.put('/updateNotas', function(req, res){
    if (req.body.zona < 0 || req.body.zona > 75) {
        res.json({ 'status': false, 'msg' : 'Error. La zona tiene que ser mayor a cero y menor a 75.' });
    } else if (req.body.final < 0 || req.body.final > 25) {
        res.json({ 'status': false, 'msg' : 'Error. La zona tiene que ser mayor a cero y menor a 25.' });
    } else {
        let sql = "UPDATE asignacion SET zona = ?, final = ? WHERE id_asignacion = ?";
        conn.query(sql, [ req.body.zona, req.body.final, req.body.idAsig ], function (err, result, fields) {
            if (err) {
                console.log(err);
                res.json({ 'status': false, 'msg' : 'Ocurrió un error al actualizar las notas.' });
            } else {
                res.json({ 'status': true, 'msg' : 'Notas actualizadas correctamente.' });
            }
        });
    }
});

/** CONSULTAS */
app.get('/consulta_uno', function(req, res){
    
    // Listar todos los alumnos del colegio DEMO1 que esten en primero, segundo y tercero primaria.

    let sql = `
        SELECT c.nombre AS colegio, a.nombre, a.apellido, g.grado
        FROM colegio c
        JOIN registro r
        ON c.id_colegio = r.ref_id_colegio
        JOIN alumno a
        ON r.ref_id_alumno = a.id_alumno
        JOIN matricula m
        ON r.ref_id_alumno = m.ref_id_alumno
        JOIN grado g
        ON m.ref_id_grado = g.id_grado
        WHERE c.nombre = "DEMO1"
        AND g.id_grado IN (1,2,3)
    `;

    conn.query(sql, [], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.json({ 'status': false, 'msg' : 'Ocurrió un error al obtener la consulta.', 'data' : [] });
        } else {
            res.json({ 'status': true, 'msg' : 'OK', 'data' : result });
        }
    });

});

app.get('/consulta_dos', function(req, res){
    
    // Listar promedio de calificaciones de los alumnos de 2do primaria del colegio DEMO2

    let sql = `
        SELECT c.nombre AS colegio, g.grado, AVG(a.zona + a.final) AS promedio
        FROM colegio c
        JOIN registro r
        ON c.id_colegio = r.ref_id_colegio
        JOIN matricula m
        ON r.ref_id_alumno = m.ref_id_alumno
        JOIN grado g
        ON m.ref_id_grado = g.id_grado
        JOIN asignacion a
        ON r.ref_id_alumno = a.ref_id_alumno
        WHERE c.nombre = "DEMO2"
        AND g.id_grado = 2
        GROUP BY c.nombre, g.grado
    `;

    conn.query(sql, [], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.json({ 'status': false, 'msg' : 'Ocurrió un error al obtener la consulta.', 'data' : [] });
        } else {
            res.json({ 'status': true, 'msg' : 'OK', 'data' : result });
        }
    });

});

app.get('/consulta_tres', function(req, res){
    
    // Listar todos lo alumnos del colegio DEMO2 cuya nota final en matematica es mayor a 90, agrupador por grado, sexo

    let sql = `
        SELECT c.nombre as colegio, a.nombre, a.apellido, a.genero, g.grado, cu.nombre as curso, (ag.zona + ag.final) AS nota_final
        FROM colegio c
        JOIN registro r
        ON r.ref_id_colegio = c.id_colegio
        JOIN asignacion ag
        ON r.ref_id_alumno = ag.ref_id_alumno
        JOIN alumno a
        ON r.ref_id_alumno = a.id_alumno
        JOIN matricula m
        ON r.ref_id_alumno = m.ref_id_alumno
        JOIN curso cu
        ON ag.ref_id_curso = cu.id_curso
        JOIN grado g
        ON m.ref_id_grado = g.id_grado
        WHERE (ag.zona + ag.final) > 90
        AND c.nombre = "DEMO2"
        AND cu.nombre = "Matemática"
        GROUP BY g.grado, a.genero
    `;

    conn.query(sql, [], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.json({ 'status': false, 'msg' : 'Ocurrió un error al obtener la consulta.', 'data' : [] });
        } else {
            res.json({ 'status': true, 'msg' : 'OK', 'data' : result });
        }
    });

});