var bgReady = false;
var canvas;
var ctx;
var bgImage;

var seatImageReady = false;
var seatImage;

var stepImageReady = false;
var stepImage;

var corridoorImageReady = false;
var corridoorImage;

var wallImageReady = false;
var wallImage;

var edgeWallImageReady = false;
var edgeWallImage;

var doorImageReady = false;
var doorImage;

var mapWidth = 29;
var mapHeight = 14;
var mapString =  "w/d/qqqqqqqqqqqqqqqqqqqqq/d/w w///xsssssssstttssssssssx///w w///xsssssssstttssssssssx///w wcccxsssssssstttssssssssxcccw wcccxsssssssstttssssssssxcccw wccc.sssssssstttssssssss.cccw wcccccccccccccccccccccccccccw wccc.-------.ccc.-------.cccw wtttxsssssssstttssssssssxtttw wtttxsssssssstttssssssssxtttw wtttxsssssssstttssssssssxtttw wcccccccccccccccccccccccccccw qqqqqqqqqqqqqqqqqqqqqqqqqqqqq";

//wcccxcccccccccccccccccccxcccw
var map 

var setUp = function()
{
	// Create the canvas
	canvas = document.createElement("canvas");
	ctx = canvas.getContext("2d");
	canvas.width = mapWidth*32;
	canvas.height = mapHeight*40;

	document.body.appendChild(canvas);

	// Background image
	
	map = new Array();
	map = mapString.split(' ');

	seatImage = new Image();
	seatImage.onload = function () {
		seatImageReady = true;
	};
	seatImage.src = "resources/images/Seat.png";

	stepImage = new Image();
	stepImage.onload = function () {
		stepImageReady = true;
	};
	stepImage.src = "resources/images/Step.png";

	corridoorImage = new Image();
	corridoorImage.onload = function () {
		corridoorImageReady = true;
	};
	corridoorImage.src = "resources/images/corridoor.png";

	wallImage = new Image();
	wallImage.onload = function () {
		wallImageReady = true;
	};
	wallImage.src = "resources/images/Wall.png";

	edgeWallImage = new Image();
	edgeWallImage.onload = function () {
		edgeWallImageReady = true;
	};
	edgeWallImage.src = "resources/images/edgewall.png";

	doorImage = new Image();
	doorImage.onload = function () {
		doorImageReady = true;
	};
	doorImage.src = "resources/images/door.png";



}

var render = function () {

	ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect (0,0,canvas.width,canvas.height);


	if (seatImageReady)
	{
		var image;
		for (var ii = 0; ii < map.length; ii++) {
			//alert(map[ii]);
		   	for (var jj = 0; jj < map[ii].length; jj++) {
		   	 	
		   		//alert(map[ii].charAt(jj));

		   	 	switch(map[ii].charAt(jj)){
		   	 		case 'q':
		   	 			drawEdgeWall(ii,jj);
		   	 			
		   	 			break;
		   	 		case 'w':
		   	 			drawWall(ii,jj);
		   	 			
		   	 			break;
		   	 		case 'c':
		   	 		 	drawCorridoor(ii,jj);
		   	 		 	break;
		   	 		case 's':
		   	 			drawStep(ii,jj);
		   	 			drawSeat(ii,jj);
		   	 		
		   	 			break;
		   	 		case 't':
		   	 			drawStep(ii,jj);
		   	 			break;
		   	 		case 'd':
		   	 			drawDoor(ii,jj);
		   	 			break;
		   	 		default:
		   	 			break;


		   	 	}

		   	 	
		   	};
		};	
	
	}

	
}

var drawStep = function ( x, y)
{
	ctx.drawImage(stepImage, y*32, x*40);
}

var drawWall = function ( x, y)
{
	ctx.drawImage(wallImage, y*32, x*40);
}

var drawEdgeWall = function ( x, y)
{
	ctx.drawImage(edgeWallImage, y*32, x*40);
}

var drawSeat = function ( x, y)
{
	ctx.drawImage(seatImage, y*32,(x*40)-15);
}

var drawCorridoor = function ( x, y)
{
	ctx.drawImage(corridoorImage, y*32,x*40);
}

var drawDoor = function ( x, y)
{
	ctx.drawImage(doorImage, (y-1)*32, x*40);
}



setUp();
render();

var main = function () {
	var now = Date.now();
	var delta = now - then;

	//update(delta / 1000);
	render();

	then = now;
};

var then = Date.now();
setInterval(main, 1); 


