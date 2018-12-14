const user = (function () {
    const getLogin = function (ctx) {

        ctx.loggedin = localStorage.getItem("authtoken") !== null;
        this.loadPartials({
            header: "./views/common/header.hbs",
            footer: "./views/common/footer.hbs"
        }).then(function () {
            this.partial("./views/user/loginPage.hbs")
        });
    };


    const postLogin = function (ctx) {
        var username = ctx.params.username;
        var password = ctx.params.password;

        userModel.login(username, password).done(function (data) {
            storage.saveUser(data);
            localStorage.setItem('username', data.username)
            localStorage.setItem('userId', data._acl.creator);
            ctx.redirect('#/memes');

        });
    };

    const logout = function (ctx) {
        userModel.logout().done(function () {
            localStorage.clear()

            ctx.redirect('#/');
        });
    }

    const getRegister = function (ctx) {
        ctx.login = localStorage.getItem("authToken") !== null;
        //
        this.loadPartials({
            header: "./views/common/header.hbs",
            footer: "./views/common/footer.hbs"
        }).then(function () {
            this.partial("./views/user/registerPage.hbs")
        });
    };

    const postRegister = function (ctx) {
        userModel.register(ctx.params).done(function (data) {
            storage.saveUser(data);
            userModel.showInfo("You register successfully")
            ctx.loggedin = true;
            ctx.username = data.username;
            console.log(ctx.username);
            ctx.redirect('#/memes');
        });
    }

    const initializeLogin = function () {
        if (userModel.isAuthorized()) {

        }
    };

    return {
        getLogin,
        postLogin,
        logout,
        getRegister,
        postRegister,
        initializeLogin,
    };
}());