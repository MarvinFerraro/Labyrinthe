let allData;

$.getJSON("./data/labyrinthes.json", function(data) {

    allData = data

}).fail(function() {
    console.log("An error has occurred. On allData");
});

$(document).ready(function() {

    /******************
     * Function Clear*
     ******************/
    const clear = (elementRemove) => {
        $(`${elementRemove}`).remove();
    }

    /******************
     * Function GetDataWithParam*
     ******************/
    const getDataChoose = (param1, param2) => {
        return allData[param1][param2];
    }

    /******************
     * Function Click for prepare the display form*
     ******************/
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

    /******************
     * On change of maze choose, for display exemple *
     ******************/
    $("#mazeChoose").on('change', function() {

        clear("#exempleChoose option");
        let exemple = $("#mazeChoose").val();

        for (const ex in allData[exemple]) {
            $('#exempleChoose').append(
                `<option value="${ex}"> ${ex} </option>`
            );
        }
    })

    /******************
     * On change of exemple, display the maze chosen *
     ******************/
    let mazeSelected;

    $("#exempleChoose").on('change', function() {

        let size = $("#mazeChoose").val();
        let exemple = $("#exempleChoose").val();

        mazeSelected = getDataChoose(`${size}`, `${exemple}`);
        console.log(mazeSelected);
        clear("#grid-container div");
        displayMaze(size, mazeSelected);
    })

    /******************
     * Function for Display the maze *
     ******************/
    const displayMaze = (size, maze) => {

        let box = 100;

        if (size >= 15) {
            box = 30;
        }

        if (size >= 10) {
            box = 50;
        }
        if (size >= 20) {
            box = 20;
        }


        document.getElementById(
            "grid-container"
        ).style.gridTemplateColumns = `repeat(${size}, ${box}px)`;
        document.getElementById(
            "grid-container"
        ).style.gridTemplateRows = `repeat(${size}, ${box}px)`;

        for (let i = 0; i < maze.length; i++) {
            let borderstyle = "";

            for (let j = 0; j < maze[i]["walls"].length; j++) {
                if (maze[i]["walls"][j]) {
                    borderstyle = borderstyle + "solid ";
                } else {
                    borderstyle = borderstyle + "none ";
                }
            }

            console.log(borderstyle, "cell n° " + i);

            let element = document.createElement("DIV");
            element.className = "cell cell_" + i;
            if (i == maze.length - 1) {
                element.className = "cell_end";
            }
            element.style.borderStyle = borderstyle;
            document.getElementById("grid-container").appendChild(element);
        }
    }
});