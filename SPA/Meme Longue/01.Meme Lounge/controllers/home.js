const home = (function () {
    const index = function (ctx) {
        ctx.loggedIn = storage.getData("authToken") !== null;

        if (ctx.loggedIn) {

            ctx["username"] = localStorage.getItem("username");
        }


        ctx.loadPartials({
            header: "./views/common/header.hbs",
            footer: "./views/common/footer.hbs"
        }).then(function () {
            this.partial("./views/home/home.hbs")
        });


    };

    return {
        index
    };
}());