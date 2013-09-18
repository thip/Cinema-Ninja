var canvas;
var context;

var refreshIntervalId;

var keysDown = {};
var delta

var won = false;
var lost = false;

var mouseX = 0;
var mouseY = 0;

var map;
var mapWidth = 31;
var mapHeight = 20;
var mapString =  
"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww \
wccc|csssssssscccssssssssc|cccw \
wccc|tsssssssstttsssssssst|cccw \
wccc|tsssssssstttsssssssst|cccw \
wccc|tsssssssstttsssssssst|cccw \
wccc|tsssssssstttsssssssst|cccw \
wccc.tsssssssstttsssssssst.cccw \
wcccccccccccccccccccccccccccccw \
wcccccccccccccccccccccccccccccw \
wccc[---------------------]cccw \
wttt|csssssssssssssssssssc|tttw \
wttt|csssssssssssssssssssc|tttw \
wttt|csssssssssssssssssssc|tttw \
wttt.csssssssssssssssssssc.tttw \
wcccccccccccccccccccccccccccccw \
wcccccccccccccccccccccccccccccw \
wcccccccccccccccccccccccccccccw \
wcccccccccccccccccccccccccccccw \
wcccccccccccccccccccccccccccccw \
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww";

var KIDS = 10;
var PUNTERS = 90;

var seats = []
var collidables = [];
var drawables = [];
var updateables = [];
var kids = [];
var punters = [];


var setUp = function()
{
	// Create the canvas
	canvas = document.createElement("canvas");
	context = canvas.getContext("2d");
	canvas.width = mapWidth*32;
	canvas.height = mapHeight*32;

	document.body.appendChild(canvas);

	//add event listeners
	addEventListener('mousemove', function(evt) {
			mouseX = getMousePos(canvas, evt).x;
			mouseY = getMousePos(canvas, evt).y;
		}, false);

	addEventListener("keydown", function (e) {
			keysDown[e.keyCode] = true;
		}, false);

	addEventListener("keyup", function (e) {
			delete keysDown[e.keyCode];
		}, false);


    // put the map together	
	map = new Array();
	map = mapString.split(' ');
	setupMap();

	for (var i = 0; i < KIDS; i++) 
	{
		var kid = new Kid();
		
	}

	for (var i = 0; i < PUNTERS; i++) 
	{
		var kid = new Punter();
		
	}

}


function getMousePos(canvas, evt) 
{
    var rect = canvas.getBoundingClientRect();
    return {
      	x: evt.clientX - rect.left,
      	y: evt.clientY - rect.top
    };
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

function getASeat()
{
	var randomnumber=Math.floor(Math.random()*seats.length);
	var seatPos = seats[randomnumber];
	seats.splice(randomnumber, 1);
	return seatPos;
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
		this.drawRotated(position, 0);
	}

	this.drawRotated = function(position, radians)
	{
		if (ready){
			context.save();
			context.translate(position.getX() + (image.width/2), position.getY() + (image.height/2));
			context.rotate(radians);
			context.drawImage(image, -(image.width/2),-(image.height/2));


			context.restore();
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
	var angle = 0;
	var position = new Position();

	this.collisions = [];

	
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
		drawable.drawRotated(position, angle);
	};

	this.setAngle = function(newAngle)
	{
		angle = newAngle;
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


function Punter () {

	var actor = new Actor(124, 30);
	actor.setDrawable((function(){
		var drawable = new Drawable();
		drawable.initialise("resources/images/punter.png");
		return drawable;
	})() )

	var mySeat = getASeat();

	actor.setPosition(mySeat.getX(), mySeat.getY());

	drawables.push(actor);


}

function Kid () {

	var actor = new Actor(124, 30);
	actor.setDrawable((function(){
		var drawable = new Drawable();
		drawable.initialise("resources/images/kid.png");
		return drawable;
	})() )

	var mySeat = getASeat();

	actor.setPosition(mySeat.getX(), mySeat.getY());

	drawables.push(actor);
	kids.push(this);

	updateables.push(this);

	this.update = function()
	{
		var x = actor.getPosition().getX() - holly.getPosition().getX();
				var y = actor.getPosition().getY() - holly.getPosition().getY();

				var d = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));

				

				if (d < 26) { lost = true ;}
	}

}

function Holly () {

	var actor = new Actor(124, 30);
	actor.setDrawable((function(){
		var drawable = new Drawable();
		drawable.initialise("resources/images/holly.png");
		return drawable;
	})() )

	var mySeat = getASeat();

	var pickme = new Actor(124, 30);
	pickme.setPosition(mySeat.getX(), mySeat.getY());
	pickme.setDrawable((function(){
		var drawable = new Drawable();
		drawable.initialise("resources/images/pickme.png");
		return drawable;
	})() )

	context.fillStyle = "yello";
    context.fillRect (mySeat.getX(),mySeat.getY , 10,10);

	actor.setPosition(100,100);

	collidables.push(actor);
	drawables.push(pickme);
	drawables.push(actor);
	updateables.push(this);

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


		//check to see if im at seat

				var x = actor.getPosition().getX() - mySeat.getX();
				var y = actor.getPosition().getY() - mySeat.getY();

				var d = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));

				

				if (d < 5) { won = true ;}


		//face mouse
		var targetX  = mouseX - actor.getPosition().getX() - 16
		,   targetY  = mouseY - actor.getPosition().getY() - 16
		,   rotation = Math.atan2(targetY, targetX);

		actor.setAngle(rotation - Math.PI/2 );
	};

	
}

var render = function () {

	context.fillStyle = "rgb(0,0,0)";
    context.fillRect (0,0,canvas.width,canvas.height);

	

	for (var i = 0; i < drawables.length; i++) {
		drawables[i].draw();
	};

}

var setupMap = function () {

	

	for (var ii = 0; ii < map.length; ii++) {
			//alert(map[ii]);
		   	for (var jj = 0; jj < map[ii].length; jj++) {
		   	 	
		   		//alert(map[ii].charAt(jj));

		   	 	switch(map[ii].charAt(jj)){
		   	 		
		   	 		case 'w':
		   	 			//drawWall(ii,jj);

		   	 			var wall = new Actor(0, 34);
						wall.setPosition(jj*32,ii*32);
						wall.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/Wall.png");
								return drawable;
							})() );
						collidables.push(wall);
						drawables.push(wall);
		   	 			
		   	 			break;
		   	 		case 'c':
		   	 		 	var corridoor = new Actor(0, 34);
						corridoor.setPosition(jj*32,ii*32);
						corridoor.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/corridoor.png");
								return drawable;
							})() );
						drawables.push(corridoor);
		   	 		 	break;
		   	 		case 's':
		   	 		
		   	 			

		   	 			var seat = new Actor(0, 0);
						seat.setPosition(jj*32,ii*32);
						seat.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/Seat.png");
								return drawable;
							})() );

						var seatColliderL = new Actor (0,1);
						seatColliderL.setPosition((jj*32)-8,(ii*32)-14);

						var seatColliderR = new Actor (0,1);
						seatColliderR.setPosition((jj*32)+8,(ii*32)-14);

						collidables.push(seatColliderL);
						collidables.push(seatColliderR);

						var corridoor = new Actor(0, 34);
						corridoor.setPosition(jj*32,ii*32);
						corridoor.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/corridoor.png");
								return drawable;
							})() );
						drawables.push(corridoor);

						drawables.push(seat);

						seats.push(seat.getPosition());
		   	 		
		   	 			break;
		   	 		case 't':
		   	 			var step = new Actor(0, 34);
						step.setPosition(jj*32,ii*32);
						step.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/step.png");
								return drawable;
							})() );
						drawables.push(step);
		   	 			break;
		   	 		
		   	 		case '|':
		   	 			var rail = new Actor(0, 32);
						rail.setPosition(jj*32,ii*32);
						rail.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/railTB.png");
								return drawable;
							})() );


						collidables.push(rail);

						drawables.push(rail);
		   	 			break;

		   	 		case '.':
		   	 			var rail = new Actor(0, 32);
						rail.setPosition(jj*32,ii*32);
						rail.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/railB.png");
								return drawable;
							})() );

						collidables.push(rail);

						drawables.push(rail);
		   	 			break;

		   	 		case '-':
		   	 			var rail = new Actor(0, 32);
						rail.setPosition(jj*32,ii*32);
						rail.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/railLR.png");
								return drawable;
							})() );


						collidables.push(rail);

						drawables.push(rail);
		   	 			break;

		   	 		case '[':
		   	 		var rail = new Actor(0, 32);
						rail.setPosition(jj*32,ii*32);
						rail.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/railBR.png");
								return drawable;
							})() );


						collidables.push(rail);

						drawables.push(rail);
		   	 			break;

		   	 		case ']':
		   	 		var rail = new Actor(0, 32);
						rail.setPosition(jj*32,ii*32);
						rail.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/railBL.png");
								return drawable;
							})() );

						collidables.push(rail);

						drawables.push(rail);
		   	 			break;

		   	 		case '<':
		   	 			var rail = new Actor(0, 32);
						rail.setPosition(jj*32,ii*32);
						rail.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/railL.png");
								return drawable;
							})() );

						

						

						collidables.push(rail);
					

						drawables.push(rail);
		   	 			break;

		   	 		case '>':
		   	 			var rail = new Actor(0, 32);
						rail.setPosition(jj*32,ii*32);
						rail.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/railR.png");
								return drawable;
							})() );

					

						collidables.push(rail);

						drawables.push(rail);
		   	 			break;
		   	 		
		   	 		default:
		   	 			break;


		   	 	}

		   	 	
		   	};
		};	
}




setUp();

var holly = new Holly();





var main = function () {
	var now = Date.now();
	delta = now - then;

	for (var i = 0; i < updateables.length; i++) {
		updateables[i].update();
	};

	if (!( won || lost)){
		render();
	} else {
		if (won)
		{
			alert("you got to your seat without incident :)");
		}

		if (lost)
		{
			alert("you got assaulted by a school child :( you never made it to your seat.");
		}

		clearInterval(refreshIntervalId);

	}
	



	then = now;
};

var then = Date.now();
refreshIntervalId = setInterval(main, 1); 


