const app = Sammy('#container', function () {
    this.use('Handlebars', 'hbs');
    this.before({ except: {} }, function () {
        user.initializeLogin();
    });

    this.get('#/', home.index);
    this.get('#/login', user.getLogin);
    this.post('#/login', user.postLogin);
    this.get('#/logout', user.logout);
    this.get('#/register', user.getRegister);
    this.post('#/register', user.postRegister);
    this.get('#/memes', meme.getMemes);
    this.get('#/create', meme.getCreate);
    this.post('#/create', meme.postCreate);
    this.get('#/edit/:id', meme.getEdit);
    this.post('#/edit/:id', meme.postEdit);
    this.get('#/detail/:id', meme.getUserDetail);
    this.get('#/delete/:id', meme.deleteMeme);
    this.post('#/delete/:id', meme.deleteMeme);
});

$(function () {
    app.run('#/');
});