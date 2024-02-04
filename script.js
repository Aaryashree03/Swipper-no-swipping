const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// animation-2 character
const character = document.getElementById("character");
const obstaclee = new Image();
obstaclee.src = 'obstacle.png';

let player = {
    w: 80,
    h: 80,
    x: 20,
    y: 200,
    speed: 1,
    dx: 0,
    dy: 0,
    progress: 0,
};

let obstacles = [];
let score = 0;
let level = 1;

function spawnObstacle() {
    const newObstacle = {
        w: 50,
        h: 50,
        x: canvas.width + Math.random() * canvas.width,
        y: [50, 200, 350, 500][Math.floor(Math.random() * 4)],
        speed: 6 // Increase obstacle speed with each level
    };

    obstacles.push(newObstacle);

    //   if (score % 1000 === 0 && score > 1000) {
    //     level++;
    //   }
}

function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacles[i].speed;

        // Check if the obstacle has moved off the screen
        if (obstacles[i].x + obstacles[i].w < 0) {
            // Remove the obstacle from the array
            obstacles.splice(i, 1);
            i--; // Adjust the loop index
        }
    }

    // Spawn new obstacles randomly
    if (Math.random() < 0.02 && obstacles.length < 3) {
        spawnObstacle();
    }
}



function drawPlayer() {
    ctx.drawImage(character, player.x, player.y, player.w, player.h);
}
function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        ctx.drawImage(obstaclee, obstacles[i].x, obstacles[i].y, obstacles[i].w, obstacles[i].h);
    }
}

// function update() {
//     // Increment progress to move along the line
//     player.progress += player.speed / canvas.width;

//     // Calculate new position based on the path
//     const pathX = canvas.width * player.progress;
//     player.x = pathX - player.w / 2;


//     // Request animation frame
//     requestAnimationFrame(update);

//     // Draw player
//     drawPlayer();
//     newpos();
// }

// //Start the animation loop
// update();


function newpos() {
    player.x += player.dx;

    if (player.dy < 0) {
        // Move up only if the character is not already on the top line
        if (player.y > 50 && player.y <= 200) {
            player.y -= 50;
        } else if (player.y > 200 && player.y <= 350) {
            player.y = 200;
        } else if (player.y > 350 && player.y <= 500) {
            player.y = 350;
        }
    } else if (player.dy > 0) {
        if (player.y < 500) {
            player.y += 50;
        }
    }
    detectWalls();

}

let current_time = Date.now();

function animate() {
    let animate_time = Date.now();
    let delta_time = animate_time - current_time;
    if (delta_time > 100) {
        clear();
        drawline();
        drawPlayer();
        drawObstacles();
        newpos();
        updateObstacles();
        checkCollision();
        drawScoreAndLevel();
        current_time = Date.now();
    }
    requestAnimationFrame(animate);
}
function detectWalls() {
    // left wall
    if (player.x < 0) {
        player.x = 0;
    }
    // right wall
    if (player.x + player.w > canvas.width) {
        player.x = canvas.width - player.w;
    }

    // bottom wall
    if (player.y + player.h > canvas.height) {
        player.y = canvas.height - player.h;
    }

    // top wall
    if (player.y < 0) {
        player.y = 0;
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}
function drawline() {

    // set line stroke and line width
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;

    // draw a first line
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(1000, 50);
    ctx.stroke();
    // second line
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(1000, 200);
    ctx.stroke();

    // third line
    ctx.beginPath();
    ctx.moveTo(0, 350);
    ctx.lineTo(1000, 350);
    ctx.stroke();

    // fourth line
    ctx.beginPath();
    ctx.moveTo(0, 500);
    ctx.lineTo(1000, 500);
    ctx.stroke();
    drawScoreAndLevel();
}


function checkCollision() {
    // Simple collision check based on bounding boxes
    for (let i = 0; i < obstacles.length; i++) {
        if (
            player.x < obstacles[i].x + obstacles[i].w &&
            player.x + player.w > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].h &&
            player.y + player.h > obstacles[i].y
        ) {
            // Collision occurred, you can handle this as needed (e.g., game over)
            console.log("Collision! Watch out");
            // restartGame();
        }
        else {
            // Player successfully avoided obstacle, increase score
            score = score + 1
        }
    }
}


function drawScoreAndLevel() {
    ctx.fillStyle = '#000'; // Set text color to black
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score} | Level: ${level}`, 10, 30);
}

function updateScoreDisplay() {
    document.getElementById('score').textContent = score;
}

// Event listener for the button click to increment the score
document.getElementById('incrementButton').addEventListener('click', function () {
    // Increment the score
    score++;

    // Update the score display
    updateScoreDisplay();
});

// function restartGame(){
//     clear();
//     player={  
//             x:20,
//             y:200,
//             speed:1,
//             dx:0,
//             dy:0,
//             progress: 0,
//            }
//            console.log("game restarted");
//            obstacles.length = 0;
//            score = 0;
//            level= 1;
//            animate();
// }

// function restartGame(){
//    player={  
//     x:20,
//     y:200,
//     speed:1,
//     dx:0,
//     dy:0,
//     progress: 0,
//    }
//    console.log("game restarted");
//    obstacles.length = 0;
//    score = 0;
//    level= 1;
//    animate();
// }

// function restartGame() {
//     // Reset game variables
//     player.x = 20;
//     player.y = 200;
//     player.speed = 1;
//     player.dx = 0;
//     player.dy = 0;
//     player.progress = 0;

//     obstacles.length = 0;
//     score = 0;
//     level = 1;

//     // Restart the game
//     animate();
// }


function MoveUp() {
    player.dy = -player.speed;
    setTimeout(() => {
        player.dy = 0;
    }, 100); //
}
function MoveDown() {
    player.dy = player.speed;
    setTimeout(() => {
        player.dy = 0;
    }, 100); //
}
function MoveRight() {
    player.dx = player.speed;
}
function MoveLeft() {
    player.dx = -player.speed;
}
function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        MoveRight();
    }
    else if (e.key === 'ArrowLeft' || e.key === 'a') {
        MoveLeft();
    }
    if (e.key === 'ArrowUp' || e.key === 'w') {
        MoveUp();
    }
    if (e.key === 'ArrowDown' || e.key === 's') {
        MoveDown();
    }
}

function keyUp(e) {
    if (
        e.key == 'Right' ||
        e.key == 'ArrowRight' ||
        e.key == 'Left' ||
        e.key == 'ArrowLeft' ||
        e.key == 'Up' ||
        e.key == 'ArrowUp' ||
        e.key == 'Down' ||
        e.key == 'ArrowDown'
    ) {
        player.dx = 0;
        player.dy = 0;
    }
}



animate();


document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);


