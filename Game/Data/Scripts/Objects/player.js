script.attachEvent(DIM3_EVENT_CONSTRUCT,'playerConstruct');
script.attachEvent(DIM3_EVENT_SPAWN,'playerSpawn');
script.attachEvent(DIM3_EVENT_MESSAGE,'playerMessage');

///////////////////////////
// Player Constructor   //
//////////////////////////

function playerConstruct(obj,subEvent,id,tick){
	
	// player model not ready yet
	//obj.model.on=true;
	//obj.model.name=Player;
	
	obj.setting.damage=true;
	obj.setting.crushable=true;
	obj.setting.bumpUp=true; 
	obj.setting.jump=true;
	obj.setting.duck=true;
	obj.setting.floating=true;
	
	// player speed
	
	obj.forwardSpeed.walk=55;
	obj.forwardSpeed.run=100;
	obj.forwardSpeed.crawl=35;
	obj.forwardSpeed.air=50;
	obj.forwardSpeed.acceleration=4;
	obj.forwardSpeed.deceleration=8;
	obj.forwardSpeed.accelerationAir=1.0;
	obj.forwardSpeed.decelerationAir=0.5;
	
	obj.turnSpeed.facingWalk=4;
	obj.turnSpeed.motionWalk=4;
	obj.turnSpeed.facingRun=4.2;
	obj.turnSpeed.motionRun=4.2;
	obj.turnSpeed.facingCrawl=3;
	obj.turnSpeed.motionCrawl=3;
	obj.turnSpeed.facingAir=3;
	obj.turnSpeed.motionAir=3;
	
	obj.sideSpeed.walk=50;
	obj.sideSpeed.run=90;
	obj.sideSpeed.crawl=30;
	obj.sideSpeed.air=50;
	obj.sideSpeed.acceleration=4;
	obj.sideSpeed.deceleration=8;
	obj.sideSpeed.accelerationAir=1.0;
	obj.sideSpeed.decelerationAir=0.5;

	obj.verticalSpeed.normal=50;
	obj.verticalSpeed.acceleration=20;
	obj.verticalSpeed.deceleration=40;

	obj.objectSpeed.jumpHeight=44;
	obj.objectSpeed.bumpHeight=1000;
	obj.objectSpeed.duckAdd=32;
	obj.objectSpeed.duckChange=800;
	
	// Player look up/down angles
	
	obj.look.upAngle=90;
	obj.look.downAngle=90;
	
	// Player health
	
	obj.health.maximum=100;
	obj.health.start=100;
	
	obj.health.fallDamageMinimumHeight=15000;
	obj.health.fallDamageFactor=0;
	
	obj.click.crosshairUp='interact';

}

///////////////////////
// Player Spawning   //
///////////////////////

function playerSpawn(obj,subEvent,id,tick){
	
	if ((subEvent==DIM3_EVENT_SPAWN_INIT) || (subEvent==DIM3_EVENT_SPAWN_REBORN) || (subEvent==DIM3_EVENT_SPAWN_GAME_RESET)) {
		
		obj.status.freezeInput(false);
		obj.weapon.hide(false);
		
		obj.setting.damage=true;
		obj.model.shadow.on=true;
		
		iface.bar.show('Health');
	}
	
}

///////////////////////////////
// Player Message Handler   //
//////////////////////////////

function playerMessage(obj,subEvent,id,tick){
	
	// key press messages
	
	if(subEvent==DIM3_EVENT_MESSAGE_FROM_KEY_DOWN) {
		
		switch (id) {
			
			// debug fly mode/third person toggles
			
			case 2:		// flying mode is player_2
				if (!obj.setting.fly) {
					obj.setting.fly=true;
					obj.setting.inputMode=DIM3_INPUT_MODE_FLY;
					obj.motionVector.alterGravity(0);	// reset gravity because now in flying
					iface.console.write('Fly Mode On');
				}
				else {
					obj.setting.fly=false;
					obj.setting.inputMode=DIM3_INPUT_MODE_FPP;
					iface.console.write('Fly Mode Off');
				}
				return;
			
			case 3:		// camera mode is player_3
				if (camera.setting.type!=DIM3_CAMERA_TYPE_FPP) {
					camera.setting.type=DIM3_CAMERA_TYPE_FPP;
					obj.look.upAngle=80;
					obj.look.downAngle=35;
					obj.look.effectWeapons=true;
					iface.console.write('Camera Mode FPP');
				}
				else {
				//	camera.setting.type=DIM3_CAMERA_TYPE_CHASE_STATIC;
				//	camera.chase.trackAngle.y=180;
					camera.setting.type=DIM3_CAMERA_TYPE_CHASE;
					camera.chase.distance=12000;
					obj.look.upAngle=10;
					obj.look.downAngle=30;
					obj.look.effectWeapons=false;
					iface.console.write('Camera Mode Chase');
				}
				return;
		}
		
	}
}