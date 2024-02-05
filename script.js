const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const ROW = 4;
const ROW_WIDTH = CANVAS_WIDTH;
const ROW_HEIGHT = CANVAS_HEIGHT / ROW;

const SIZE = ROW_HEIGHT;

// animation character
const character = document.getElementById("character");

let player = {
	w: SIZE,
	h: SIZE,
	displayWidth: SIZE - SIZE * 0, // change this number as % for size reduction
	displayHeight: SIZE - SIZE * 0, // change this number as % for size reduction
	x: 0,
	y: Math.floor(Math.random() * (CANVAS_HEIGHT / SIZE)) * SIZE,
	speed: 0.09,
	progress: 0,
};

let obstacles = [];
let obstacleImages = [];

let score = 0;
let level = 1;
let gameOver = false;

function spawnObstacle() {
	const obstacleImage = new Image();
	obstacleImage.src = `bird${Math.floor(Math.random() * 3) + 1}.png`;

	const newObstacle = {
		w: SIZE,
		h: SIZE,
		displayWidth: SIZE - SIZE * 0.5, // change this number as % for size reduction
		displayHeight: SIZE - SIZE * 0.5, // change this number as % for size reduction
		x: CANVAS_WIDTH + Math.floor(Math.random() * (ROW_WIDTH / SIZE)) * SIZE,
		y: Math.floor(Math.random() * (CANVAS_HEIGHT / SIZE)) * SIZE,
		// displayX: this.x / 2,
		// displayY: this.y / 2,
		speed: 0.09, // Increase obstacle speed with each level
	};

	obstacleImages.push(obstacleImage);
	obstacles.push(newObstacle);

	//   if (score % 1000 === 0 && score > 1000) {
	//     level++;
	//   }
}

function updateObstacles() {
	for (let i = 0; i < obstacles.length; i++) {
		obstacles[i].x -= SIZE * obstacles[i].speed;

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
	var centerX = player.x + player.w / 2;
	var centerY = player.y + player.h / 2;

	var smallBoxX = centerX - player.displayWidth / 2;
	var smallBoxY = centerY - player.displayHeight / 2;

	ctx.drawImage(
		character,
		smallBoxX,
		smallBoxY,
		player.displayWidth,
		player.displayHeight
	);
	ctx.strokeStyle = "blue";
	ctx.strokeRect(player.x, player.y, player.w, player.h);
}

function drawObstacles() {
	for (let i = 0; i < obstacles.length; i++) {
		var centerX = obstacles[i].x + obstacles[i].w / 2;
		var centerY = obstacles[i].y + obstacles[i].h / 2;

		var smallBoxX = centerX - obstacles[i].displayWidth / 2;
		var smallBoxY = centerY - obstacles[i].displayHeight / 2;

		ctx.drawImage(
			obstacleImages[i],
			smallBoxX,
			smallBoxY,
			obstacles[i].displayWidth,
			obstacles[i].displayHeight
		);

		ctx.strokeStyle = "red";
		ctx.strokeRect(
			obstacles[i].x,
			obstacles[i].y,
			obstacles[i].w,
			obstacles[i].h
		);
	}
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

function checkCollision() {
	// Simple collision check based on bounding boxes
	const player_minx = player.x;
	const player_maxx = player.x + player.w;
	const player_miny = player.y;
	const player_maxy = player.y + player.h;

	for (let i = 0; i < obstacles.length; i++) {
		const obstacle_minx = obstacles[i].x;
		const obstacle_maxx = obstacles[i].x + obstacles[i].w;
		const obstacle_miny = obstacles[i].y;
		const obstacle_maxy = obstacles[i].y + obstacles[i].h;

		if (
			player_minx < obstacle_maxx &&
			player_maxx > obstacle_minx &&
			player_miny < obstacle_maxy &&
			player_maxy > obstacle_miny
		) {
			// Collision occurred, you can handle this as needed (e.g., game over)
			gameOver = true;
			alert("Collision! Watch out");
			// restartGame();
		} else {
			// Player successfully avoided obstacle, increase score
			score++;
		}
	}
}

function updateScoreDisplay() {
	scoreElement.innerHTML = score;
}

function move(direction) {
	switch (direction) {
		case "left":
			player.x -= SIZE;
			break;
		case "right":
			player.x += SIZE;
			break;
		case "up":
			player.y -= SIZE;
			break;
		case "down":
			player.y += SIZE;
			break;
		default:
			break;
	}

	detectWalls();
}

document.addEventListener("keydown", handlePlayerMovement);
function handlePlayerMovement(e) {
	if (e.key === "ArrowRight" || e.key === "d") {
		move("right");
	} else if (e.key === "ArrowLeft" || e.key === "a") {
		move("left");
	} else if (e.key === "ArrowUp" || e.key === "w") {
		move("up");
	} else if (e.key === "ArrowDown" || e.key === "s") {
		move("down");
	}
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawRow() {
	for (r = 0; r < ROW; r++) {
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, r * ROW_HEIGHT, ROW_WIDTH, ROW_HEIGHT);
	}
}

function update() {
	updateObstacles();
	updateScoreDisplay();
	checkCollision();
}

function draw() {
	clear();

	drawRow();
	drawPlayer();
	drawObstacles();
}

let current_time = Date.now();

function animate() {
	let animate_time = Date.now();
	let delta_time = animate_time - current_time;

	if (delta_time > 1000 / 60) {
		draw();
		update();
		current_time = Date.now();
	}

	if (gameOver === false) {
		requestAnimationFrame(animate);
	}
}

animate();
