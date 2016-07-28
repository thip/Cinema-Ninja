var canvas;
var context;

var shh = new Audio("resources/sound/shh.wav");
var roar = new Audio("resources/sound/roar.wav");
var win = new Audio("resources/sound/win.wav");
var jaws = new Audio("resources/sound/jaws.mp3");

var jawsStarted = false;

var refreshIntervalId;

var keysDown = {};
var delta

var gameState = 0;

var won = false;
var noise = false;
var spotted = false;

var mouseX = 0;
var mouseY = 0;

var map;
var mapWidth = 31;
var mapHeight = 20;
var mapString =  
"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww \
wlcr|csssssssscccssssssssc|lcrw \
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
wccccc###################cccccw \
wccccc###################cccccw \
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww";

var KIDS = 20;
var PUNTERS = 90;
var LITTER = 90;

var seats = []
var collidables = [];
var drawables = [];
var updateables = [];
var kids = [];
var punters = [];
var walkables = [];
var litter = [];

var viewDistance = 110;


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


	for (var i = 0; i < PUNTERS; i++) 
	{
		new Punter();
		
	}

	for (var i = 0; i < KIDS; i++) 
	{
		new Kid();
		
	}

	for (var i = 0; i < LITTER; i++) 
	{
		new Litter();
		
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

function getAWalkable()
{
	var randomnumber=Math.floor(Math.random()*walkables.length);
	var walkablePos = walkables[randomnumber];
	walkables.splice(randomnumber, 1);



	return walkablePos;
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
			context.translate(position.getX() + (image.width/2), position.getY() + 16);//+ (image.height/2));
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

	this.getAngle = function()
	{
		return angle;
	}

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

function Litter () {

	var triggered = false;

	var snd = new Audio("resources/sound/crunch.wav")

	var actor = new Actor(124, 30);
	actor.setDrawable((function(){
		var drawable = new Drawable();
		drawable.initialise("resources/images/trash.png");
		return drawable;
	})() )

	actor.setAngle(Math.random()*Math.PI*2);

	var myPos = getAWalkable();



	actor.setPosition(myPos.getX()+(Math.random()*24)-12,
					 	myPos.getY()+(Math.random()*24)-12);

	drawables.push(actor);
	updateables.push(this);

	this.update = function()
	{
		var x = holly.getPosition().getX() - actor.getPosition().getX()  ;
				var y = holly.getPosition().getY() - actor.getPosition().getY() ;

				var d = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));

		if ( (d < 10) && !triggered )
		{
			triggered = true;
			snd.play();
			holly.hurt();
		}

		if ( ( d > 10) && triggered )
		{
			triggered = false;
		}

	}

}

function Kid () {

	var lookTarget = Math.random()*Math.PI*2;
	var idle = true;
	var angularV = 0.01;

	var actor = new Actor(124, 30);
	actor.setDrawable((function(){
		var drawable = new Drawable();
		drawable.initialise("resources/images/kid.png");
		return drawable;
	})() )

	var mySeat = getASeat();

	actor.setPosition(mySeat.getX(), mySeat.getY());
	actor.setAngle((Math.random()*(Math.PI*2)-(Math.PI)%(Math.PI*2)));

	drawables.push(actor);
	kids.push(this);

	updateables.push(this);

	this.faceHolly = function()
	{
		var x = holly.getPosition().getX() - actor.getPosition().getX()  ;
		var y = holly.getPosition().getY() - actor.getPosition().getY() ;

		actor.setAngle(Math.atan2(y, x) - Math.PI/2);
	}

	this.update = function()
	{
				var x = holly.getPosition().getX() - actor.getPosition().getX()  ;
				var y = holly.getPosition().getY() - actor.getPosition().getY() ;

				var d = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
				
				//if Holly has collided with me lose
				if (d < 22) { 


					spotted = true ;
					
		

				}

				//if I can see Holly, lose (for now)				
				var rotdif = (actor.getAngle()   - ( Math.atan2(y, x) - Math.PI/2)  );

				if (( (rotdif < 0.2) && (rotdif > - 0.2) ) && (d < viewDistance )){ spotted = true; }


				//look around randomly
				if ( idle )
				{
					var ting = (actor.getAngle() - lookTarget); 
					
					if ( ting > 0.1)
					{
						actor.setAngle((actor.getAngle() - (angularV ) )%(Math.PI*2));
					} else if ( ting < -0.1) {
						actor.setAngle((actor.getAngle() + (angularV ) )%(Math.PI*2));
					} else {
						lookTarget = (Math.random()*(Math.PI*2)-Math.PI)%(Math.PI*2);
						
					}
				}


	}

}

function Projector ()
{
	var actor = new Actor(0,0);
	actor.setDrawable((function(){
		var drawable = new Drawable();
		drawable.initialise("resources/images/projecter.png");
		return drawable;
	})() )

	actor.setPosition(192, canvas.height/2 - 28);

	drawables.push(actor);

}

function Holly () {

	var health = 100;

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



	actor.setPosition(36,36);

	collidables.push(actor);
	drawables.push(pickme);
	drawables.push(actor);
	updateables.push(this);

	this.getHealth = function()
	{
		return health;
	}

	this.hurt = function()
	{
		health = health - 20;
		//alert("shhh");
	}

	this.getPosition = function()
	{
		return actor.getPosition();
	}

	this.draw = function(){
		actor.draw();
	};

	this.update = function()
	{

		if (health <= 0)
		{
			noise = true;
		}

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
			context.fillStyle = "rgb(255,255,255)";
			context.font = 'bold 20pt Arial';
		context.fillText("Punter annoyance Level: " + (100- holly.getHealth() ) + "%", 5, 25);

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

		   	 		case '#':
		   	 			//drawWall(ii,jj);

		   	 			var wall = new Actor(0, 34);
						wall.setPosition(jj*32,ii*32);
						wall.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/stage.png");
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
						walkables.push(corridoor.getPosition());
		   	 		 	break;

		   	 		case 'l':
		   	 		 	var corridoor = new Actor(0, 34);
						corridoor.setPosition(jj*32,ii*32);
						corridoor.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/corridoor.png");
								return drawable;
							})() );

						var door = new Actor(0, 34);
						door.setPosition(jj*32,ii*32);
						door.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/doorL.png");
								return drawable;
							})() );

						
						drawables.push(corridoor);
						drawables.push(door);
		   	 		 	break;

		   	 		case 'r':
		   	 		 	var corridoor = new Actor(0, 34);
						corridoor.setPosition(jj*32,ii*32);
						corridoor.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/corridoor.png");
								return drawable;
							})() );

						var door = new Actor(0, 34);
						door.setPosition(jj*32,ii*32);
						door.setDrawable((function(){
								var drawable = new Drawable();
								drawable.initialise("resources/images/doorR.png");
								return drawable;
							})() );

						
						drawables.push(corridoor);
						drawables.push(door);
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
								drawable.initialise("resources/images/Step.png");
								return drawable;
							})() );
						drawables.push(step);
						walkables.push(step.getPosition());
		   	 			break;
		   	 		
		   	 		case '|':
		   	 			var rail = new Actor(0, 33);
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
var projector = new Projector();





var main = function () {
	var now = Date.now();
	delta = now - then;

	switch(gameState)
	{
		case 0:
		{



			context.fillStyle = "rgb(0,0,0)";
			context.font = 'normal 15pt Lucida Console';
			context.fillText("While buying tickets at the cinema you insult a group of school children. As you enter the screen (late, you", 5, 25);
			context.fillText("were buying snacks) you realise \n that the school children are already here. Try and get to your seat without ", 5, 45);
		    context.fillText("being  noticed by the angry children or disturbing the other film-goers.", 5, 65);

		    var drawable = new Drawable();
		    var pos = new Position();
		    pos.setPosition(0, 80);
		   	drawable.initialise("resources/images/pickme.png");
		   	drawable.draw(pos);
		    context.fillText("<- this marks your seat", 40, 105);
		    context.fillText("press space to play! (refresh to reset)", 5 , 145);

		    context.fillText("(I put this together pretty quickly, sorry it's a bit rough!)", 5 , 205);

			break;
		}
		case 1:
		{
			if(!jawsStarted){
				jaws.currentTime = 60;
				jaws.play();
				jawsStarted = true;
			}

			for (var i = 0; i < updateables.length; i++) {
				updateables[i].update();
			};

			if (!( won || noise || spotted)){
				render();

			} else {
				if (won)
				{
					win.play();
					alert("you got to your seat without incident :)");
				}

				if (spotted)
				{
					for (var i = 0; i < kids.length; i++) {
						kids[i].faceHolly();
					};


					render();
					roar.play();

					alert("you got assaulted by a school child :( you never made it to your seat.");

				}	

				if (noise)
				{
					render();
					shh.play();
					alert("You made too much noise");
				}

				clearInterval(refreshIntervalId);

			}
			break;
		}

	}

	
				if ( 32 in keysDown)
			{
				gameState = 1;
			}



	then = now;
};

var then = Date.now();
refreshIntervalId = setInterval(main, 1); 


