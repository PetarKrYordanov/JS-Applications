const meme = (function () {
    var url = `appdata/${storage.appKey}/memes`
    //let url = 'appdata/${storage.appKey}/memes/query={"creator":"username"}&sort={"_kmd.ect": -1}'
    const getMemes = function (ctx) {

        memeModel.listAll()
            .then((memes) => {
                ctx.memes = memes;
                ctx.loggedIn = localStorage.getItem('authToken') != null;
                ctx.username = localStorage.getItem('username');
                memes.map((value) => {
                    value['isAuthor'] = ctx.username === value.creator;
                    return value;
                });

                console.log(memes);
                if (!ctx.memes) {
                    ctx.memes = false;
                }

                ctx.loadPartials({
                    header: "./views/common/header.hbs",
                    footer: "./views/common/footer.hbs"
                }).then(function () {
                    this.partial("./views/memes/listAll.hbs")
                });
            });
    }

    const getUserDetail = function (ctx) {
        let userId = ctx.params.id.substr(1);
        console.log(ctx)
        memeModel.userById(userId)
            .then((user) => {
                console.log(user)
                ctx.username = localStorage.getItem("username")
                ctx.detUsername = user.username;
                ctx.email = user.email;
                ctx.avatarUrl = user.avatarUrl;
                ctx.loggedIn = localStorage.getItem("authToken") !== null;

                console.log(ctx.detUsername)
                memeModel.getMemesByCreator(ctx.detUsername)
                    .then((memes) => {
                        console.log(ctx);

                        ctx.memes = memes;
                    }).then(function () {

                        ctx.loadPartials({
                            header: "./views/common/header.hbs",
                            footer: "./views/common/footer.hbs"
                        }).then(function () {
                            this.partial("./views/user/detail.hbs")
                        });

                    })

            })
    };

    const getCreate = function (ctx) {
        ctx.loadPartials({
            header: "./views/common/header.hbs",
            footer: "./views/common/footer.hbs"
        }).then(function () {
            this.partial("./views/memes/create.hbs")
        });

    }

    const postCreate = function (ctx) {
        memeModel.createPost(ctx.params)
            .then(function (response) {
                memeModel.showInfo("You create meme successfully");
                ctx.redirect('#/memes');
            })
    }

    const getEdit = function (ctx) {
        let id = ctx.params.id.substr(1);

        memeModel.getById(id)
            .then(function (res) {
                ctx.loggedIn = localStorage.getItem('authToken') != null;
                ctx.username = localStorage.getItem('username');

                ctx.description = res.description;
                ctx.imageUrl = res.imageUrl;
                ctx.title = res.title;
                ctx.id = id;

                ctx.loadPartials({
                    header: "./views/common/header.hbs",
                    footer: "./views/common/footer.hbs"
                }).then(function () {
                    this.partial("./views/memes/edit.hbs")
                });

            })
    };

    const postEdit = function (ctx) {


        memeModel.makePutQuery(ctx.params)
            .then(function () {

                memeModel.showInfo("You successfully edit meme");
                ctx.redirect('#/memes');
            })
    };

    const deleteMeme = function (ctx) {
        let id = ctx.params.id.substr(1);
        console.log(id);
        memeModel.deleteMeme(id)
            .then(function () {
                ctx.redirect('#/memes');
            });
    }

    return {
        getMemes,
        getCreate,
        postCreate,
        getEdit,
        postEdit,
        getUserDetail,
        deleteMeme,
    };
})()