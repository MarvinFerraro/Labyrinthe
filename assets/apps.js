/*******************************
 * Function LoadJson Async *
 ***************************/
let allData;

$.getJSON("./data/labyrinthes.json", function(data) {

    allData = data

}).fail(function() {
    console.log("An error has occurred. On allData");
});

$(document).ready(function() {

    /*****************
     * Function Clear*
     *****************/
    const clear = (elementRemove) => {
        $(`${elementRemove}`).remove();
    }

    /*****************************
     * Function GetDataWithParam *
     *****************************/
    const getDataChoose = (param1, param2) => {
        return allData[param1][param2];
    }

    /**********************************************
     * Function Click for prepare the display form *
     ***********************************************/
    $("#isReady").click(function() {
        isReady();
        $("#formReady").removeClass("d-none");
        $(this).addClass("d-none");
    });

    const isReady = () => {

        $('#mazeChoose').append(
            `<option selected disabled>Choose a Maze</option>`
        );

        for (const size in allData) {
            $('#mazeChoose').append(
                `<option value="${size}"> ${size}x${size} </option>`
            );
        }
    }

    /*************************************************
     * On change of maze choose, for display exemple *
     *************************************************/
    $("#mazeChoose").on('change', function() {

        clear("#exempleChoose option");
        let exemple = $("#mazeChoose").val();

        $('#exempleChoose').append(
            `<option selected disabled>Choose a exemple </option>`
        );

        for (const ex in allData[exemple]) {
            $('#exempleChoose').append(
                `<option value="${ex}"> ${ex} </option>`
            );
        }
    })

    /*************************************************
     * On change of exemple, display the maze chosen *
     *************************************************/
    let mazeSelected;

    $("#exempleChoose").on('change', function() {

        let size = $("#mazeChoose").val();
        let exemple = $("#exempleChoose").val();

        mazeSelected = getDataChoose(`${size}`, `${exemple}`);
        clear("#grid-container div");
        displayMaze(size, mazeSelected);
    })

    /*********************************
     * Function for Display the maze *
     *********************************/
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

            // console.log(borderstyle, "cell n° " + i);

            let element = document.createElement("DIV");
            element.className = "cell cell_" + i;
            element.id = "id_" + i;
            if (i == maze.length - 1) {
                element.className = "cell_end";
            }
            element.style.borderStyle = borderstyle;
            document.getElementById("grid-container").appendChild(element);
        }
    }

    /***********************
     * Function Neighbours *
     ***********************/
    let displayBuffer = [];
    let displayBufferBestWay = [];

    const neighbours = (maze, cell, size) => {

        size = parseInt(size);
        const neighbours = [];

        const index_cell = maze.indexOf(cell);

        //Define neighbours top, right, bottom, left
        let top_cell;
        if (index_cell > size) {
            top_cell = index_cell - size;
        } else top_cell = null;

        let bottom_cell;
        if (index_cell < maze.length - size) {
            bottom_cell = index_cell + size;
        } else bottom_cell = null;

        let right_cell = index_cell + 1;

        let left_cell = index_cell - 1;

        //Push neighbours in neighbours array

        if (cell.walls[0] == false && top_cell) {
            neighbours.push(top_cell);
        }
        if (cell.walls[3] == false && left_cell) {
            neighbours.push(left_cell);
        }
        if (cell.walls[1] == false && right_cell) {
            neighbours.push(right_cell);
        }
        if (cell.walls[2] == false && bottom_cell) {
            neighbours.push(bottom_cell);
        }
        return neighbours;
    };

    /****************
     * Function DFS *
     ****************/
    const dfs = (size, maze) => {

        const start = maze[0];
        let count = 0;

        for (let i = 0; i < maze.length; i++) {
            maze[i].isVisited = false;
        };

        let stack = [];

        stack.push(start);
        start.isVisited = true;

        while (stack.length != 0) {

            let current_cell = stack.pop();
            displayBuffer.push(maze.indexOf(current_cell));

            let arrayNeighbours = neighbours(maze, current_cell, size);
            console.log(arrayNeighbours);

            if (current_cell == maze[maze.length - 1]) {
                console.log("Win");
                displayChemin(maze.indexOf(current_cell), maze)
                return
            };

            arrayNeighbours.forEach(neighbours => {

                if (maze[neighbours].isVisited === false) {

                    console.log(neighbours);
                    maze[neighbours].parent = maze.indexOf(current_cell);

                    stack.push(maze[neighbours]);
                    maze[neighbours].isVisited = true;
                }
            });

        };

        return false;
    };

    /****************
     * Function BFS *
     ****************/
    const bfs = (size, maze) => {

        const start = maze[0];

        for (let i = 0; i < maze.length; i++) {
            maze[i].isVisited = false;
        };

        let queue = [];

        queue.push(start);
        start.isVisited = true;

        while (queue.length != 0) {

            let current_cell = queue.shift();
            displayBuffer.push(maze.indexOf(current_cell));

            let arrayNeighbours = neighbours(maze, current_cell, size);

            if (current_cell == maze[maze.length - 1]) {
                console.log("Win");
                displayChemin(maze.indexOf(current_cell), maze)
                return
            };

            arrayNeighbours.forEach(neighbours => {

                if (maze[neighbours].isVisited === false) {

                    console.log(neighbours);

                    maze[neighbours].parent = maze.indexOf(current_cell);
                    queue.push(maze[neighbours]);
                    maze[neighbours].isVisited = true;
                }
            });
        };
        return false;
    };

    /************************
     * Function DisplayTimer *
     ************************/
    const startDisplay = () => {

        setInterval(() => {
            $("#id_" + displayBuffer.shift()).addClass("good");
        }, 300)

        setTimeout(() => {
            setInterval(() => {
                $("#id_" + displayBufferBestWay.shift()).addClass("way");
            }, 300)
        }, 300 * displayBuffer.length)
    }

    /************************
     * Function Save the route *
     ************************/
    const displayChemin = (end_id, maze) => {
        let id = end_id;
        while (id != 0) {
            console.log(maze[id].parent);
            displayBufferBestWay.push(id);
            id = maze[id].parent;
        }
        displayBufferBestWay.push(id);
    }

    /********************************
     * Function on click on DFS do  *
     *********************************/
    $("#DFS").click(function() {

        let size = $("#mazeChoose").val();
        let exemple = $("#exempleChoose").val();
        mazeSelected = getDataChoose(`${size}`, `${exemple}`);

        dfs(size, mazeSelected);
        startDisplay();
    })

    /********************************
     * Function on click on BFS do  *
     ********************************/
    $("#BFS").click(function() {

        let size = $("#mazeChoose").val();
        let exemple = $("#exempleChoose").val();
        mazeSelected = getDataChoose(`${size}`, `${exemple}`);

        bfs(size, mazeSelected);
        startDisplay();
    })








});