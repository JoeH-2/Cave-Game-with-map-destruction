let myGamePiece
let point
let box
let Obstacles = []
let testNodes = []
let currentObjects = []
let Checks = []
let Rock = []

let directionX = [0]
let directionY = [0]

let reasons = []

let overwriteX = 0
let overwriteY = 0

let cursorX = 0
let cursorY = 0
let confirmHit = 0

let radius = 135

function Start() {
    x = 5
    y = 5
    Rocks = []
    Rock = []
    console.log((Math.floor(Math.random() * 30) + 15) / 100)
    myGameArea.stop()
    myGameArea.start()
    GenerateSquare()
    GenerateRock()
    for (i = 0; i < Rock.length; i ++) {
        Create = new component(Rock[i][0], Rock[i][1], "rgb(27,27,27)", "rgb(27,27,27)", Rock[i][2],  Rock[i][3])
        Rocks.splice(-1,0,Create)
    }
}

// function cut(x,y,radius){
//     ctx = myGameArea.context
//     ctx.save();
//     ctx.globalCompositeOperation='destination-in';
//     ctx.beginPath();
//     ctx.arc(x,y,radius, 0, 2 * Math.PI, false);
//     ctx.fill();
//     ctx.restore();
// }

function updateGameArea() {
    currentObjects = []
    confirmHit = 0
    overwriteX = 0
    overwriteY = 0
    myGameArea.clear()
    myGamePiece.newPos()
    sensor.lead()
    // ctx = myGameArea.context;
    // ctx.fillStyle = "rgb(17, 17, 17)"
    // ctx.fillRect(0,0,canvas.width,canvas.height);
    document.addEventListener("mousemove", CursorCheck);
    box = new component (120, 120, "rgb(27, 27, 27, 0)", "rgb(27, 27, 27, 0)", myGamePiece.x-(myGamePiece.width/2), myGamePiece.y-(myGamePiece.height/2))
    box.update()
    point = new component (10, 10, "rgb(27, 27, 27, 0)", "rgb(27, 27, 27, 0)", cursorX + 10, cursorY + 10)
    point.update()
    if (!point.objectCheck(box)) {
        for (i = 0; i < Rocks.length; i ++) {
            if (!point.objectCheck(Rocks[i])) {
                Rocks[i] = new component (35, 35, "rgb(27, 27, 27)", "white", cursorX, cursorY)
            }
            else {
                Rocks[i] = new component (35, 35, "rgb(27, 27, 27)", "rgb(27, 27, 27)", Rocks[i].x, Rocks[i].y)
            }
        }
    }
    else {
        for (i = 0; i < Rocks.length; i ++) {
            Rocks[i] = new component (35, 35, "rgb(27, 27, 27)", "rgb(27, 27, 27)", Rocks[i].x, Rocks[i].y)
        }
    }
    document.addEventListener("click", Mine);
    for (i = 0; i < Rocks.length; i++) {
        Rocks[i].update()
        if (!sensor.collide(Rocks[i])) {
            confirmHit = 1
            console.log("Collision")
        }
        else {
            for (x = 0; x < currentObjects.length; x ++) {
                if (currentObjects[x] == Rocks[i]) {
                    currentObjects.splice(x,1)
                    console.log("BREEEEEE")
                }
            }
        }
    }
    //CREATE OUTLINE
    coords = []
    x = 0
    y = 0
    let num = 0
    for (i = 0; i < Rocks.length; i++) {
        marker = new component (10, 10, "rgb(27, 27, 27)", "rgb(27, 27, 27)", x, y)
        for (z = 0; z < Rocks.length; z++) {
            if (!marker.objectCheck(Rocks[z])) {
                num ++
            }
        }
        if (num == 1 || num == 2 || num == 3) {
            coords.splice(-1,0,[Rocks[i].x, Rocks[i].y])
        }
        x += 35
        y += 35
    }
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    for (i = 0; i < coords.length; i ++) {
        if (i == 0) {
            ctx.moveTo(coords[i][0], coords[i][1]);
        }
        else {
            ctx.lineTo(coords[i][0], coords[i][1]);
        }
    }
    ctx.closePath();
    ctx.stroke();
    // for (i = 0; i < Checks.length; i++) {
    //     Checks[i].update()
    // }
    // cut(myGamePiece.x + myGamePiece.width/2,myGamePiece.y + myGamePiece.height/2,radius)
    // for (i = 0; i < testNodes.length; i++) {
    //     testNodes[i].update()
    // }
    if (myGamePiece.y + (directionY[0] * 2) < 0) {
        myGamePiece.speedY = 0
        overwriteY = 1
    }
    else if (myGamePiece.y + (directionY[0] * 2) > canvas.height-60) {
        myGamePiece.speedY = 0
        overwriteY = 1
    }

    if (myGamePiece.x + (directionX[0] * 2) < 0) {
        myGamePiece.speedX = 0
        overwriteX = 1
    }
    else if (myGamePiece.x + (directionX[0] * 2) > canvas.width-60) {
        myGamePiece.speedX = 0
        overwriteX = 1
    }
    if (confirmHit == 1) {
        if (reasons.includes("top") || reasons.includes("bot")) {
            myGamePiece.speedY = 0
            overwriteY = 1
        }
        if (reasons.includes("left") || reasons.includes("right")) {
            myGamePiece.speedX = 0
            overwriteX = 1
        }
    }

    if (overwriteX == 0) {
        myGamePiece.speedX = directionX[0]
        
    }
    if (overwriteY == 0) {
        myGamePiece.speedY = directionY[0]
    }
    // sensor.update()
    myGamePiece.update()
    reasons = []
}

let myGameArea = {
    canvas: document.getElementById("myCanvas"),
    start : function() {
        this.canvas.width = 1050;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d")
        document.body.insertBefore(this.canvas, document.body.childNodes[0])
        this.interval = setInterval(updateGameArea, 20)
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    stop : function() {
        clearInterval(this.interval)
    }
}

function GenerateDimensions(max, min) {
    canvas = document.getElementById("myCanvas")
    width = Math.floor(Math.random() * (max-min)) + min
    height = Math.floor(Math.random() * (max-min)) + min
    while (width % 20 != 0) {
        width = Math.floor(Math.random() * (max-min)) + min
    }
    while (height % 20 != 0) {
        height = Math.floor(Math.random() * (max-min)) + min
    }
    bx = Math.floor(Math.random() * (canvas.width - width))
    by = Math.floor(Math.random() * (canvas.height - height))
    while (bx % 20 != 0) {
        bx = Math.floor(Math.random() * (canvas.width - width))
    }
    while (by % 20 != 0) {
        by = Math.floor(Math.random() * (canvas.height - height))
    }
    return {
        width,
        height,
        bx,
        by
    }
}

function GenerateRock() {
    for (y = 0; y < canvas.height; y += 35) {
        for (x = 0; x < canvas.width; x += 35) {
            Create = new component(35, 35, "rgb(27,27,27)", "rgb(27,27,27)", x, y)
            confirm = 1
            for (i = 0; i < Obstacles.length; i ++) {
                if (!Create.objectCheck(Obstacles[i])) {
                    confirm = 0
                }
            }
            if (confirm == 1) {
                Rock.splice(-1,0,[35, 35, x, y])
            }
        }
    }
}

function GenerateSquare() {
    Obstacles = []
    let color = 'hsl('+ 360 * Math.random() + ', 75%, 50%)'
    let { bx, by } = GenerateDimensions(300, 150)
    myGamePiece = new component(60, 60, "black", "white", bx, by)
    sensor = new component(60, 60, "green", "green", bx, by)
    canvas = document.getElementById("myCanvas")
    let confirm = 0
    color = "rgb(26, 26, 26)"
    let i = 0
    let sArea = 0
    let cancel = 0
    let caveNode = 0
    let chance = Math.floor(Math.random() * 1)
    let caveChance = document.getElementById("caveChance")
    caveChance.innerHTML = "Cave spawn: 100%: N0"
    if (chance == 0) {
        caveChance.innerHTML = "Cave spawn: 100%: YES"
        let { width, height, bx, by } = GenerateDimensions(300, 150)
        Obstacles[0] = new component(width, height, "green", "white", myGamePiece.x, myGamePiece.y)
        i++
        for (q = 0; q < Math.floor(Math.random() * 5) + 5; q++) {
            caveNode ++
            console.log("Test")
            let { width, height, bx, by } = GenerateDimensions(125, 75)
            Obstacles[i] = new component(width, height, "red", "white", bx, by)
            let overwrite = 1
            while (Obstacles[i].objectCheck(Obstacles[0]) || (overwrite == 1)) {
                let count = 0
                console.log("Attempt")
                let { width, height, bx, by } = GenerateDimensions(125, 75)
                Obstacles[i] = new component(width, height, "red", "white", bx, by)
                testNodes[0] = new component(30, 30, "blue", "white", bx - 15, by - 15)
                testNodes[1] = new component(30, 30, "blue", "white", bx - 15 + width, by - 15)
                testNodes[2] = new component(30, 30, "blue", "white", bx - 15, by + height - 15)
                testNodes[3] = new component(30, 30, "blue", "white", bx - 15 + width, by + height - 15)
                for (x = 0; x < testNodes.length; x ++) {
                    if (testNodes[x].objectCheck(Obstacles[0])) {
                        count ++
                    }
                }
                console.log("Count: " + count)
                if (count == 4 || count == 0) {
                    overwrite = 1
                    console.log("Fail")
                }
                else {
                    overwrite = 0
                    console.log("Pass")
                }
            }

            i++
        }
    }
    else {
        chance = false
    }
    // while (Obstacles.length - caveNode < 6 && cancel == 0) { //(sArea < ((canvas.width * canvas.height) * ((Math.floor(Math.random() * 25)+25)/100)) && cancel == 0)
    //     let { width, height, bx, by } = GenerateDimensions(300, 150)
    //     Obstacles[i] = new component(width, height, color, "white", bx,  by)
    //     confirm = 0
    //     while (confirm == 0) {
    //         z = 0
    //         let attempts = 0
    //         let sAttempt = 0
    //         while (z < Obstacles.length) {
    //             if (Obstacles[i] != Obstacles[z]) {
    //                 //console.log(Obstacles[i])
    //                 //console.log(Obstacles[i].objectCheck(Obstacles[z]))
    //                 if ((!Obstacles[i].objectCheck(Obstacles[z])) || (!Obstacles[i].objectCheck(myGamePiece))) {
    //                     //console.log("Change")
    //                     //console.log(Obstacles[z].x)
    //                     //console.log(Obstacles[z].y)
    //                     //console.log(Obstacles[i].x)
    //                     //console.log(Obstacles[i].y)
    //                     bx = Math.floor(Math.random() * (canvas.width - width))
    //                     by = Math.floor(Math.random() * (canvas.height - height))           
    //                     while (bx % 20 != 0) {
    //                         bx = Math.floor(Math.random() * (canvas.width - width))
    //                     }
    //                     while (by % 20 != 0) {
    //                         by = Math.floor(Math.random() * (canvas.height - height))
    //                     }
    //                     if (attempts == 100) {
    //                         width -= 5
    //                         height -= 5
    //                         sAttempt += 1
    //                         attempts = 0
    //                     }
    //                     if (sAttempt == 15) {
    //                         cancel = 1
    //                         confirm = 1
    //                         Obstacles.splice(i, 1)
    //                         console.log("CANCEL")
    //                         break
    //                     }
    //                     Obstacles[i] = new component(width, height, color, "white", bx, by)
    //                     z = 0
    //                     confirm = 0
    //                     attempts ++

    //                 }
    //                 else if ((Obstacles[i].objectCheck(Obstacles[z])) && (Obstacles[i].objectCheck(myGamePiece))) {
    //                     //console.log(Obstacles[z].x)
    //                     //console.log(Obstacles[z].y)
    //                     //console.log(Obstacles[i].x)
    //                     //console.log(Obstacles[i].y)
    //                     confirm = 1
    //                     //console.log("fine")
    //                     z++
                        
    //                 }
    //             }
    //             else if (Obstacles[i].objectCheck(myGamePiece)) {
    //                 confirm = 1
    //                 //console.log(Obstacles[i])
    //                 //console.log("Skip")
    //                 z++
    //             }
    //             else {
    //                 bx = Math.floor(Math.random() * (canvas.width - width))
    //                 by = Math.floor(Math.random() * (canvas.height - height))           
    //                 while (bx % 20 != 0) {
    //                     bx = Math.floor(Math.random() * (canvas.width - width))
    //                 }
    //                 while (by % 20 != 0) {
    //                     by = Math.floor(Math.random() * (canvas.height - height))
    //                 }
    //                 Obstacles[i] = new component(width, height, color, "white", bx, by)
    //                 z = 0
    //                 confirm = 0
    //             }
    //         }
    //     }
    //     if (cancel == 0) {
    //         i++
    //         sArea += (width * height)
    //         console.log(sArea + ": " + width + " x " + height)
            
    //     }
    // }
    // if (chance == false) {
    //     testNodes = []
    //     for (x = 0; x < (caveNode + 1); x++) {
    //         Obstacles.splice(0,1)
    //     }
    // }
    // let mapCover = document.getElementById("mapCover")
    // mapCover.innerHTML = "Map Coverage: " + Math.floor((sArea / (canvas.width * canvas.height)) * 100) + "%"
    // for (i = 0; i < Obstacles.length; i ++) {
    //     check = new component(40, 40, "magenta", "white", Obstacles[i].x, Obstacles[i].y)
    //     Checks.splice(0,0,check)
    // }
}


function component(width, height, color, border, x, y) {
    this.width = width
    this.height = height
    this.speedX = 0
    this.speedY = 0
    this.x = x
    this.y = y
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.strokeStyle = border
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
    this.newPos = function() {
        this.x += this.speedX
        this.y += this.speedY
    }
    this.lead = function() {
        if (directionX[0] == -5) {
            this.x = myGamePiece.x + directionX[0]
            this.width = myGamePiece.width + directionX[0] * -1
        }
        if (directionX[0] == 5) {
            this.x = myGamePiece.x
            this.width = myGamePiece.width + directionX[0]
        }
        if (directionY[0] == -5) {
            this.y = myGamePiece.y + directionY[0]
            this.height = myGamePiece.height  + directionY[0] * -1
        }
        if (directionY[0] == 5) {
            this.y = myGamePiece.y
            this.height = myGamePiece.height + directionY[0]
        }
        if (directionX[0] == 0){
            this.x = myGamePiece.x
            this.width = myGamePiece.width
        }
        if (directionY[0] == 0){
            this.y = myGamePiece.y
            this.height = myGamePiece.height
        }
    }
    this.collide = function(object) {
        let playerLeft = this.x
        let playerRight = this.x + (this.width)
        let playerTop = this.y
        let playerBottom = this.y + (this.height)
        let objectLeft = object.x
        let objectRight = object.x + (object.width)
        let objectTop = object.y
        let objectBottom = object.y + (object.height)
        collision = false

        if ((playerBottom < objectTop) ||
        (playerTop > objectBottom) ||
        (playerRight < objectLeft) ||
        (playerLeft > objectRight)) {
            collision = true
    }
        if (collision == false) {
            if (!currentObjects.includes(object)) {
                currentObjects.splice(0, 0, object)
            }

            if (objectLeft == playerRight) {
                if (!reasons.includes("right")){
                    reasons.splice(0,0,"right")
                }
            }
            if (playerLeft == objectRight) {
                if (!reasons.includes("left")){
                    reasons.splice(0,0,"left")
                }
            }
            if (objectTop == playerBottom) {
                if (!reasons.includes("bot")) {
                    reasons.splice(0,0,"bot")
                }
            }

            if (playerTop == objectBottom) {
                if (!reasons.includes("top")){
                    reasons.splice(0,0,"top")
                }
            }
            console.log(reasons)
            console.log("Objects touching: " + currentObjects.length)
            if (currentObjects.length == 2) {
                if ((currentObjects[0].x == currentObjects[1].x) ||
                (currentObjects[0].y == currentObjects[1].y) ||
                (currentObjects[0].x + currentObjects[0].width  == currentObjects[1].x + currentObjects[1].width) ||
                (currentObjects[0].y + currentObjects[0].height == currentObjects[1].y + currentObjects[1].height)) {
                    if (currentObjects[0].x == currentObjects[1].x && reasons.includes("right")) {
                        if (reasons[0] == "right") {
                            reasons.splice(1,1)
                        }
                        else {
                            reasons.splice(0,1)
                        }
                    }
                    else if (currentObjects[0].y == currentObjects[1].y && reasons.includes("bot")) {
                        if (reasons[0] == "bot") {
                            reasons.splice(1,1)
                        }
                        else {
                            reasons.splice(0,1)
                        }
                    }
                    else if (currentObjects[0].x + currentObjects[0].width == currentObjects[1].x + currentObjects[1].width && reasons.includes("left")) {
                        if (reasons[0] == "left") {
                            reasons.splice(1,1)
                        }
                        else {
                            reasons.splice(0,1)
                        }
                    }
                    else if (currentObjects[0].y + currentObjects[0].height == currentObjects[1].y + currentObjects[1].height  && reasons.includes("top")) {
                        if (reasons[0] == "top") {
                            reasons.splice(1,1)
                        }
                        else {
                            reasons.splice(0,1)
                        }
                    }
                }
            }
            if (currentObjects.length == 3) {
                if ((currentObjects[0].x == currentObjects[1].x) ||
                (currentObjects[0].y == currentObjects[1].y) ||
                (currentObjects[0].x + currentObjects[0].width  == currentObjects[1].x + currentObjects[1].width) ||
                (currentObjects[0].y + currentObjects[0].height == currentObjects[1].y + currentObjects[1].height)) {
                    if (currentObjects[0].x == currentObjects[1].x && currentObjects[1].x == currentObjects[2].x && reasons.includes("right")) {
                        if (reasons[0] == "right") {
                            reasons.splice(1,1)
                        }
                        else {
                            reasons.splice(0,1)
                        }
                    }
                    else if (currentObjects[0].y == currentObjects[1].y && currentObjects[1].y == currentObjects[2].y && reasons.includes("bot")) {
                        if (reasons[0] == "bot") {
                            reasons.splice(1,1)
                        }
                        else {
                            reasons.splice(0,1)
                        }
                    }
                    else if (currentObjects[0].x + currentObjects[0].width == currentObjects[1].x + currentObjects[1].width && currentObjects[1].x + currentObjects[1].width == currentObjects[2].x + currentObjects[2].width && reasons.includes("left")) {
                        if (reasons[0] == "left") {
                            reasons.splice(1,1)
                        }
                        else {
                            reasons.splice(0,1)
                        }
                    }
                    else if (currentObjects[0].y + currentObjects[0].height == currentObjects[1].y + currentObjects[1].height && currentObjects[1].y + currentObjects[1].height == currentObjects[2].y + currentObjects[2].height && reasons.includes("top")) {
                        if (reasons[0] == "top") {
                            reasons.splice(1,1)
                        }
                        else {
                            reasons.splice(0,1)
                        }
                    }
                }
            }
            // On corner hit directly
            if (reasons.length > 1 && currentObjects.length < 2) {
                if (playerRight == objectLeft && playerBottom == objectTop) {
                    if (directionY[0] == 5) {
                        reasons.splice(1,1)
                        console.log("3")
                    }
                    else {
                        reasons.splice(0,1)
                        console.log("3.5")
                    }
                }
                else if (playerLeft == objectRight && playerBottom == objectTop) {
                    if (directionY[0] == 5) {
                        reasons.splice(1,1)
                        console.log("4")
                    }
                    else {
                        reasons.splice(0,1)
                        console.log("4.5")
                    }
                }
                else if (playerRight == objectLeft && playerTop == objectBottom) {
                    if (directionY[0] == -5) {
                        reasons.splice(1,1)
                        console.log("5")
                    }
                    else {
                        reasons.splice(0,1)
                        console.log("5.5")
                    }
                }
                else if (playerLeft == objectRight && playerTop == objectBottom) {
                    if (directionY[0] == -5) {
                        reasons.splice(1,1)
                        console.log("6")
                    }
                    else {
                        reasons.splice(0,1)
                        console.log("6.5")
                    }
                }
            }
            if (reasons.length > 2) {
                if (reasons.includes("bot") && reasons.includes("top")) {
                    for (i = 0; i < reasons.length; i ++) {
                        if (reasons[i] == "bot" || reasons[i] == "top") {
                            reasons.splice(i,1)
                        }
                    }
                }
                if (reasons.includes("left") && reasons.includes("right")) {
                    for (i = 0; i < reasons.length; i ++) {
                        if (reasons[i] == "left" || reasons[i] == "right") {
                            reasons.splice(i,1)
                        }
                    }
                }
            }

        }
        return collision
    }
    this.objectCheck = function(object) {
        let playerLeft = this.x
        let playerRight = this.x + (this.width)
        let playerTop = this.y
        let playerBottom = this.y + (this.height)
        let objectLeft = object.x
        let objectRight = object.x + (object.width)
        let objectTop = object.y
        let objectBottom = object.y + (object.height)
        collision = false
        if ((playerBottom < objectTop) ||
            (playerTop > objectBottom) ||
            (playerRight < objectLeft) ||
            (playerLeft > objectRight)) {
                collision = true
        }
        return collision
    }
}

window.onkeydown = function (event) {
    if (event.keyCode == "13") {
        Start()
    }
    if (event.key == "w") {
        if (directionY[0] != -5) {
            if (directionY.length > 0) {
                directionY.splice(1,1,directionY[0])
            }
            directionY.splice(0,1,-5)
        }
    }
    if (event.key == "a") {
        if (directionX[0] != -5) {
            if (directionX.length > 0) {
                directionX.splice(1,1,directionX[0])
            }
            directionX.splice(0,1,-5)
        }
        
    }
    if (event.key == "s") {
        if (directionY[0] != 5) {
            if (directionY.length > 0) {
                directionY.splice(1,1,directionY[0])
            }
            directionY.splice(0,1,5)
        }
    }
    if (event.key == "d") {
        if (directionX[0] != 5) {
            if (directionX.length > 0) {
                directionX.splice(1,1,directionX[0])
            }
            directionX.splice(0,1,5)
        }
    }
}

window.onkeyup = function (event) {
    if (event.key == "w") {
        for (i = 0; i < directionY.length; i ++) {
            if (directionY[i] == -5) {
                directionY.splice(i,1)
                if (directionY.length == 0) {
                    directionY.splice(0,1,0)
                }
            }
        }
    }
    if (event.key == "a") {
        for (i = 0; i < directionX.length; i ++) {
            if (directionX[i] == -5) {
                directionX.splice(i,1)
                if (directionX.length == 0) {
                    directionX.splice(0,1,0)
                }
            }
        }
    }
    if (event.key == "s") {
        for (i = 0; i < directionY.length; i ++) {
            if (directionY[i] == 5) {
                directionY.splice(i,1)
                if (directionY.length == 0) {
                    directionY.splice(0,1,0)
                }
            }
        }
    }
    if (event.key == "d") {
        for (i = 0; i < directionX.length; i ++) {
            if (directionX[i] == 5) {
                directionX.splice(i,1)
                if (directionX.length == 0) {
                    directionX.splice(0,1,0)
                }
            }
        }
    }
}

function Mine() {
    for (i = 0; i < Rocks.length; i ++) {
        if (!point.objectCheck(Rocks[i]) && !point.objectCheck(box)) {
            Rocks.splice(i,1)
            break
        }
    }
}

function CursorCheck(event) {
    cursorX = event.pageX - 8
    if (cursorX % 35 != 0) {
        cursorX = Math.floor(cursorX / 35) * 35
    }
    cursorY = event.pageY - 8
    if (cursorY % 35 != 0) {
        cursorY = Math.floor(cursorY / 35) * 35
    }
    // console.log(event.pageX + " = " + x)
    // console.log(event.pageY + " = " + y)
    updateCursor = 1
    return cursorX, cursorY, updateCursor
}
