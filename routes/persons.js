const express = require('express'); // se inyecta la dependencia
const router = express.Router(); // generamos la instancia del router
const mongoose = require('../node_modules/mongoose'); // se inyecta la dependencia de mongoose

let Person = require('../models/person'); //inyecta dependencia del modelo person
const { route } = require('express/lib/application');

//se agrega ruta persons => metodo GET
//aqui nos renderizara la vista en vez del objeto json
// router.get('/persons', function (req, res, next) {
//     Person.find(function (err, persons) {
//         if(err) return next(err);
//         res.render('persons',{'persons' : persons} ); //cambia el tipo de objeto json par q se envie un objeto formateado
//     });
// });

//////////////////////////////////////////////////////////////////////
//PRACTICA 22
//aqui se contiene el object Id de mongo db, el cual se asigna automaticamente a cada documento q se agrega a la coleccion,
// y cuando se renderice la vista listado, se pasa un objeto {persons}, q contiene todos los docs con sus keys (id, nombre, edad, tipoSangre, nss)
router.get('/persons', function (req, res, next) {
    Person.find(function (err, persons) {
        if(err) return next(err);
        res.render('persons',{persons} ) //cambia el tipo de objeto json par q se envie un objeto formateado
    });
});

// usaremos la key id para ejecutar metodo findByIdAndRemove
//DELETE PERSON
router.get('/deletePerson/:id', function(req, res, next) {
    Person.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if(err) return next(err);
        res.redirect('/persons');
    });
});

//FIND PERSON BY ID
router.get('/findById/:id', function(req, res, next) {
    Person.findById(req.params.id, function (err, person) {
        if(err) return next(err);
        res.render('personUpdate', {person});
    });
});

//UPDATE PERSON
router.post('/updatePerson', function(req, res, next) {
    Person.findByIdAndUpdate(req.body.objId, {
        nombre: req.body.nombre,
        edad:req.body.edad,
        tipoSangre: req.body.tipoSangre,
        nss: req.body.nss }, function (err, post) {
            if (err) return next (err);
            res.redirect('/persons');
        });
});
///////////////////////////////////////////////////////////////////

//ruta GET - permite mostrar el formulario en pantalla para insertar los datos a nuestra database, aqui se renderiza la vista del form en html
router.get('/person', function(req, res) {
    res.render('person');
});


//ruta POST - atiende la peticion, aqui agregamos la ruta POST, para poder agregar un nuevo documento a la coleccion
router.post('/addPerson', function(req, res) {
    //creamos la entidad - toma como valores los que son introducidos al body de la pericion
    const myPerson = new Person ({
        nombre: req.body.nombre,
        edad: req.body.edad,
        tipoSangre: req.body.tipoSangre,
        nss: req.body.nss });
    //se guarda en la database
    myPerson.save();
});

//ruta GET - permite mostrar la pagina principal
router.get('/main', function(req, res) {
    res.render('main');
});




//exportar el router
module.exports = router;