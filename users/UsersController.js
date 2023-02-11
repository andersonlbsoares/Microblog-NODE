const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Category = require('../categories/Category');

const User = require('./User');

router.get('/admin/users/users', (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/users', { users: users });
    });
});

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create');
});

router.post('/users/save', (req, res) => {

    User.findOne({ where: { username: req.body.username } }).then(user => {
        if (user == undefined) {
            var salt = bcrypt.genSaltSync(10);
            var username = req.body.username;
            var password = bcrypt.hashSync(req.body.password, salt);

            User.create({
                username: username,
                password: password
            }).then(() => {
                res.redirect('/admin/users/users');
            });
        } else {
            res.redirect('/admin/users/create');
        }
    });
});

router.get("/login", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/users/login", { categories: categories });
    });
});

router.post("/authenticate", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({ where: { username: username } }).then(user => {
        if (user != undefined) {
            var correct = bcrypt.compareSync(password, user.password);

            if (correct) {
                req.session.user = {
                    id: user.id,
                    username: user.username
                }
                res.redirect("/admin/articles");
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    });
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});




module.exports = router;