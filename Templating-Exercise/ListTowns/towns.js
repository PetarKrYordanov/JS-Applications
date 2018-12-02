; function attachEvents() {
    let t = $("#btnLoadTowns").on('click', getTowns)

    function getTowns() {
        let townsData = $("#towns").val()
            .split(/\s*,\s*/g)
        // .reduce((acc, cur) => {
        //     acc.towns.push({ 'town': cur });
        //     return acc;
        // }, { 'towns': [] });
        console.log(townsData);
        renderTowns(townsData)
    }

    async function renderTowns(towns) {
        let source = await $.get('./template.hbs');
        let templ = Handlebars.compile(source);

        $("#root").html(templ(towns));
        $("#towns").val("");
    }
}