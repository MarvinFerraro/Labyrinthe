let allData;

$.getJSON("./data/labyrinthes.json", function(data) {

    allData = data

}).fail(function() {
    console.log("An error has occurred. On allData");
});

$(document).ready(function() {

    const getDataChoose = (param1, param2) => {
        return allData[param1][param2];
    }

    $("#isReady").click(function() {
        isReady();
        $("#formReady").removeClass("d-none");
        $(this).addClass("d-none");
    });

    const isReady = () => {
        for (const size in allData) {
            $('#mazeChoose').append(
                `<option value="${size}"> ${size}x${size} </option>`
            );
        }
    }

    $("#mazeChoose").on('change', function() {

        $("#exempleChoose option").remove();
        let exemple = $("#mazeChoose").val();

        for (const ex in allData[exemple]) {
            $('#exempleChoose').append(
                `<option value="${ex}"> ${ex} </option>`
            );
        }
    })

    let mazeSelected;

    $("#exempleChoose").on('change', function() {

        let size = $("#mazeChoose").val();
        let exemple = $("#exempleChoose").val();

        mazeSelected = getDataChoose(`${size}`, `${exemple}`);
        console.log(mazeSelected);
        display(size, mazeSelected);
    })

    const display = (size, mazeSelected) => {

        $("#trTable tr").remove();

        let td = `<td></td>`;

        let tr = `<tr>${td.repeat(size)}</tr>`;

        let allRow = tr.repeat(size);

        $("#trTable").append(allRow);

    }

});