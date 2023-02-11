const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const Users = require('./users/UsersController');


app.set('view engine', 'ejs');

app.use(session({
    secret: "palavrasupersecreta123@",
    cookie: { maxAge: 30000 }
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection.authenticate().then(() => {
    console.log('Conexão feita com o banco de dados');
}).catch((error) => {
    console.log(error);
});

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', Users);

app.get('/', (req, res) => {
    Article.findAll({
        order: [['id', 'DESC']],
        limit: 4,
        include: [{ model: Category }]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', { articles: articles, categories: categories });
        });
    });
});

app.get('/article/:slug', (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Category }]
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('article', { article: article, categories: categories });
            });
        } else {
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article }]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render('index', { articles: category.articles, categories: categories });
            });
        } else {
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    });
});


app.get('/session', (req, res) => {
    req.session.treinamento = "Formação NodeJS";
    req.session.ano = 2020;
    req.session.email = "asd",
        req.session.user = {
            username: "Lucas",
            email: "asd",
            id: 10
        }
    res.send("Sessão gerada");
});

app.get('/leitura', (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    });
});







app.listen(3000, () => { });