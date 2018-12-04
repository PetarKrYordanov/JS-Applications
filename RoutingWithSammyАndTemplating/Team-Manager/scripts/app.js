$(() => {
    const app = Sammy('#main', function () {
        this.use("Handlebars", "hbs");
        this.get("/index.html", displayHome);
        this.get("#/home", displayHome);

        this.get('#/about', function (context) {

            context.loggedIn = sessionStorage.getItem("authtoken") !== null;
            context.username = sessionStorage.getItem("username");
            this.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs"
            }).then(function () {

                this.partial('./templates/about/about.hbs')
            })
        });

        this.get("#/register", function (context) {
            context.loggedIn = sessionStorage.getItem("authtoken") !== null;
            context.username = sessionStorage.getItem("username");
            this.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                registerForm: "./templates/register/registerForm.hbs"
            }).then(function () {
                this.partial("./templates/register/registerPage.hbs");
            }).catch(handleError);
        });

        this.post("#/register", function (context) {
            let username = this.params.username;
            let password = this.params.password;
            let repeatPassword = this.params.repeatPassword;

            if (password !== repeatPassword) {
                auth.showError("The passwords must be equals");
            } else {
                auth.register(username, password)
                    .then(function (response) {
                        auth.saveSession(response);
                        auth.showInfo("You register successfully");
                        displayHome(context);
                    })
                    .catch(auth.handleError);
            }
        });
        this.get("#/login", function (context) {
            context.loggedIn = sessionStorage.getItem("authtoken") !== null;
            context.username = sessionStorage.getItem("username");

            this.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                loginForm: "./templates/login/loginForm.hbs"
            }).then(function () {
                this.partial("./templates/login/loginPage.hbs");
            }).catch(handleError);
        })

        this.get("#/logout", function (context) {
            auth.logout()
                .then(function (response) {
                    sessionStorage.clear();
                    auth.showInfo("You successfully loged out");
                    displayHome(context);
                }).catch(auth.handleError());
        })

        this.post("#/login", function (context) {
            let username = context.params.username;
            let password = context.params.password;

            auth.login(username, password).then(function (userInfo) {
                auth.saveSession(userInfo)
                auth.showInfo("Logged in successfully");
                displayHome(context)
            }).catch(auth.handleError())
        });

        this.get("#/catalog", displayCatalog);

        this.get("#/create", function (context) {
            context.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                createForm: `./templates/create/createForm.hbs`
            }).then(
                function () {
                    this.partial("./templates/create/createPage.hbs")
                }
            ).catch(auth.handleError);
        });

        this.post("#/create", function (context) {

            let teamName = context.params.name;
            let teamComment = context.params.comment;

            teamsService.createTeam(teamName, teamComment)
                .then(function (teamInfo) {

                    teamsService.joinTeam(teamInfo._id)
                        .then(function (userInfo) {
                            auth.saveSession(userInfo);
                            auth.showInfo(`Team ${teamName} CREATED!`);
                            displayCatalog(context);
                        }).catch(auth.handleError)
                }).catch(auth.handleError)
        });

        // join team by id
        this.get("#/join/:id", function (context) {
            let teamId = context.params.id.substr(1);

            teamsService.joinTeam(teamId)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo("Joined team!")
                    displayCatalog(context);
                }).catch(auth.handleError)
        });

        this.get("#/leave", function (context) {
            teamsService.leaveTeam()
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo("You successfully leave team");
                    displayCatalog(context);
                }).catch(auth.handleError);
        });


        this.get("#/catalog/:id", function (context) {
            let id = context.params.id.substr(1);
            teamsService.loadTeamDetails(id)
                .then(function (teamInfo) {
                    context.loggedIn = sessionStorage.getItem("authtoken") !== null;
                    context.username = sessionStorage.getItem("username");
                    context.teamId = id;
                    context.name = teamInfo.name;
                    context.comment = teamInfo.comment;
                    context.isOnTeam = teamInfo._id === sessionStorage.getItem("teamId");
                    context.isAuthor = teamInfo._acl.creator === sessionStorage.getItem("userId");
                    context.loadPartials({
                        header: "./templates/common/header.hbs",
                        footer: "./templates/common/footer.hbs",
                        teamControls: './templates/catalog/teamControls.hbs',
                    }).then(function () {
                        this.partial('./templates/catalog/details.hbs')
                    })

                }).catch(auth.handleError)
        })

        this.get("#/edit/:id", function (context) {
            let teamId = context.params.id.substr(1);

            teamsService.loadTeamDetails(teamId)
                .then(function (teamInfo) {
                    context.teamId = teamId;
                    context.name = teamInfo.name;
                    context.comment = teamInfo.comment;

                    context.loadPartials({
                        header: "./templates/common/header.hbs",
                        footer: "./templates/common/footer.hbs",
                        editForm: `./templates/edit/editForm.hbs`
                    }).then(function () {
                        this.partial(`./templates/edit/editPage.hbs`)
                    })
                }).catch(auth.handleError);
        });

        this.post("#/edit/:id", function (context) {
            let teamName = context.params.name;
            let teamComment = context.params.comment;
            let teamId = context.params.id.substr(1);


            teamsService.edit(teamId, teamName, teamComment)
                .then(function () {
                    auth.showInfo("Team was edited correctly!");
                    displayCatalog(context);
                }).catch(auth.handleError);
        });

        function displayCatalog(context) {
            context.loggedIn = sessionStorage.getItem("authtoken") !== null;
            context.username = sessionStorage.getItem("username");

            teamsService.loadTeams()
                .then(function (teams) {
                    context.hasNoTeam = sessionStorage.getItem("teamId") === null
                        || sessionStorage.getItem("teamId") === "undefined";
                    context.teams = teams;
                    context.loadPartials({
                        header: "./templates/common/header.hbs",
                        footer: "./templates/common/footer.hbs",
                        team: "./templates/catalog/team.hbs"
                    }).then(function () {
                        this.partial("./templates/catalog/teamCatalog.hbs")
                    })
                })
        }
        function displayHome(context) {

            context.loggedIn = sessionStorage.getItem("authtoken") !== null;
            context.username = sessionStorage.getItem("username");
            context.teamId = sessionStorage.getItem("teadmid") !== undefined ||
                sessionStorage.getItem("teamId") !== null;

            context.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs"
            }).then(function () {
                this.partial("./templates/home/home.hbs")
            }).catch(auth.handleError);
        }
    });

    app.run();
});