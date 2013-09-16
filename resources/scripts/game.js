var bgReady = false;
var canvas;
var ctx;
var bgImage;

var seatImageReady = false;
var seatImage;

var stepImageReady = false;
var stepImage;

var setUp = function()
{
	// Create the canvas
	canvas = document.createElement("canvas");
	ctx = canvas.getContext("2d");
	canvas.width = 960;
	canvas.height = 520;

	document.body.appendChild(canvas);

	// Background image
	
	bgImage = new Image();
	bgImage.onload = function () {
		bgReady = true;
	};
	bgImage.src = "resources/images/background.png";

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



}

var render = function () {
	if (bgReady) {
		ctx.fillStyle = "rgb(0,0,0)";
      	ctx.fillRect (0,0,canvas.width,canvas.height);
	}

	if (seatImageReady)
	{

	    drawStep(1,1);
		drawStep(1,2);
		drawStep(2,1);
		drawStep(2,2);
		drawStep(3,1);
		drawStep(3,2);

		drawSeat(1,1);
		drawSeat(1,2);
		drawSeat(2,2);


		
	
	}

	
}

var drawSeat = function ( x, y)
{
	ctx.drawImage(seatImage, y*32,(x*40)-2);
}

var drawStep = function ( x, y)
{
	ctx.drawImage(stepImage, y*32,x*40);
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


