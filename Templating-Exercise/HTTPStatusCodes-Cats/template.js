$(() => {
    renderCatTemplate();

    function renderCatTemplate() {
        $("#allCats").empty();

        let source = $.get('./catTemplate.hbs').then((res) => {
            let template = Handlebars.compile(res);

            $("#allCats").html(template({ 'cats': cats }));

            let a = $("button").each(function (i, btn) {
                $(this).on('click', ShowAndHideInfo)
            });

            function ShowAndHideInfo() {
                console.log(this.nextElementSibling);
                this.nextElementSibling.style.display = "inline-block";
                $(this).text('Hide status code').on("click", hideInfo)


            }

            function hideInfo() {
                $(this).text('Show status code').on("click", ShowAndHideInfo)
                this.nextElementSibling.style.display = "none";
            }
        });
    }
})
