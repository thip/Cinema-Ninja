var keysDown = {};
var deltat
var idProvider = 0;

addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);


var collidables = [];



var bgReady = false;
var canvas;
var context;
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

var hollyImageReady = false;
var hollyImage;

var mapWidth = 29;
var mapHeight = 15;
var mapString =  "w/d/qqqqqqqqqqqqqqqqqqqqq/d/w w///xsssssssstttssssssssx///w w///xsssssssstttssssssssx///w wcccxsssssssstttssssssssxcccw wcccxsssssssstttssssssssxcccw wcccxsssssssstttssssssssxcccw wccc.sssssssstttssssssss.cccw wcccccccccccccccccccccccccccw wccc.-------.ccc.-------.cccw wtttxsssssssstttssssssssxtttw wtttxsssssssstttssssssssxtttw wtttxsssssssstttssssssssxtttw wtttxsssssssstttssssssssxtttw wcccccccccccccccccccccccccccw qqqqqqqqqqqqqqqqqqqqqqqqqqqqq";

//wcccxcccccccccccccccccccxcccw
var map 

var setUp = function()
{
	// Create the canvas
	canvas = document.createElement("canvas");
	context = canvas.getContext("2d");
	canvas.width = mapWidth*32;
	canvas.height = mapHeight*32;

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

	hollyImage = new Image();
	hollyImage.onload = function () {
		hollyImageReady = true;
	};
	hollyImage.src = "resources/images/holly.png";



}



function Position(){
	var x = 0;
	var y = 0;

	this.getX = function(){
		return x;
	};

	this.getY = function(){
		return y;
	};

	this.setPosition = function( newX, newY )
	{
		x = newX;
		y = newY;
	}
}

function Drawable()
{
	var ready = false;
	var image = new Image();
	
	this.initialise = function(imagePath)
	{
		image.src = imagePath;
		ready = true;
	}
	

	this.zIndex = 0;

	this.draw = function(position)
	{
		if (ready){
			context.drawImage(image, position.getX(), position.getY());
		}	
	}

}

function Scenery()
{
	var ready = false;
	var position
	var drawable

	this.setDrawable = function(newDrawable)
	{
		drawable = newDrawable;
	} 
}

function Actor(newSpeed, newSize){
	var speed = newSpeed;
	var size = newSize;
	var position = new Position();

	this.collisions = [];

	this.id = idProvider;
	idProvider++;
	
	var drawable

	this.getPosition = function()
	{
		return position;
	};

	this.setPosition = function(newX,newY)
	{
		position.setPosition(newX,newY);
	};

	this.move = function (newX, newY)
	{
		
		position.setPosition(position.getX() + (newX * (delta/1000) * speed), position.getY() - (newY * (delta/1000) * speed));
	};

	this.setDrawable = function(newDrawable)
	{
		drawable = newDrawable;
	}; 

	this.draw = function()
	{
		drawable.draw(position);
	};


	this.getSize = function()
	{
		return size;
	};

	this.checkCollisions = function()
	{
		this.collisions = [];
		var collidable;
		for (var ii = 0; ii < collidables.length; ii++)
		{
			collidable = collidables[ii];

			if (collidable != this)
			{
				var x = position.getX() - collidable.getPosition().getX();
				var y = position.getY() - collidable.getPosition().getY();

				var d = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));

				

				if (d < ((size + collidable.getSize())/2))
				{
					this.collisions.push(collidable);
				}
			}
		}
	};


}

function Holly () {

	



	var actor = new Actor(124, 32);
	actor.setDrawable((function(){
		var drawable = new Drawable();
		drawable.initialise("resources/images/holly.png");
		return drawable;
	})() )



	actor.setPosition(100,100);

	collidables.push(actor);

	this.getPosition = function()
	{
		return actor.getPosition();
	}

	this.draw = function(){
		actor.draw();
	};

	this.update = function()
	{

		actor.checkCollisions();

		blockLeft = false;
		blockRight = false;
		blockUp = false;
		blockDown = false;

		for (var i = 0; i < actor.collisions.length; i++) {
			var otherPosition = actor.collisions[i].getPosition();

			if (otherPosition.getX() < actor.getPosition().getX())
			{
				blockLeft = true;

			}

			if (otherPosition.getX() > actor.getPosition().getX())
			{
				blockRight = true;
			}

			if (otherPosition.getY() > actor.getPosition().getY())
			{
				blockDown = true;

			}

			if (otherPosition.getY() < actor.getPosition().getY())
			{
				blockUp = true;
			}

		};

		if ((40 in keysDown || 83 in keysDown)) // down
		{
			if (blockDown)
			{
				if ( blockLeft &! blockRight ){
					actor.move(1,0);
				} else if ( blockRight &! blockLeft) {
					actor.move(-1,0);
				}
			} else {
				actor.move(0,-1);
			}
		}

		if ((38 in keysDown || 87 in keysDown)) //up
		{
			if (blockUp)
			{
				if ( blockLeft &! blockRight ){
					actor.move(1,0);
				} else if ( blockRight &! blockLeft) {
					actor.move(-1,0);
				}
			} else {
				actor.move(0,1);
			}
		}

		if ((37 in keysDown || 65 in keysDown)) { // Player holding left
			if (blockLeft)
			{
				if ( blockUp &! blockDown ){
					actor.move(0,-1);
				} else if ( blockDown &! blockUp) {
					actor.move(0,1);
				}
			} else {
				actor.move(-1,0);
			}
		}

		if ((39 in keysDown || 68 in keysDown)) { // Player holding right
			if (blockRight)
			{
				if ( blockUp &! blockDown ){
					actor.move(0,-1);
				} else if ( blockDown &! blockUp) {
					actor.move(0,1);
				}
			} else {
				actor.move(1,0);
			}
		}
	};

	
}

var render = function () {

	context.fillStyle = "rgb(0,0,0)";
    context.fillRect (0,0,canvas.width,canvas.height);


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

	

		holly.draw();
		bleh.draw();
		blah.draw();
		bluh.draw();

	

	
}

var drawStep = function ( x, y)
{
	context.drawImage(stepImage, y*32, x*32);
}

var drawWall = function ( x, y)
{
	context.drawImage(wallImage, y*32, x*32);
}

var drawEdgeWall = function ( x, y)
{
	context.drawImage(edgeWallImage, y*32, x*32);
}

var drawSeat = function ( x, y)
{
	context.drawImage(seatImage, y*32,(x*32)-15);
}

var drawCorridoor = function ( x, y)
{
	context.drawImage(corridoorImage, y*32,x*32);
}

var drawDoor = function ( x, y)
{
	context.drawImage(doorImage, (y-1)*32, x*32);
}



setUp();

var holly = new Holly();

var bleh = new Actor(0, 10);
bleh.setPosition(250,250);
bleh.setDrawable((function(){
		var drawable = new Drawable();
		drawable.initialise("resources/images/holly.png");
		return drawable;
	})() );
collidables.push(bleh);

var blah = new Actor(0, 10);
blah.setPosition(400,250);
blah.setDrawable((function(){
		var drawable = new Drawable();
		drawable.initialise("resources/images/holly.png");
		return drawable;
	})() );
collidables.push(blah);

var bluh = new Actor(0, 10);
bluh.setPosition(300,300);
bluh.setDrawable((function(){
		var drawable = new Drawable();
		drawable.initialise("resources/images/holly.png");
		return drawable;
	})() );
collidables.push(bluh);

var main = function () {
	var now = Date.now();
	delta = now - then;

	//update(delta / 1000);
	holly.update();
	render();

	then = now;
};

var then = Date.now();
setInterval(main, 1); 


