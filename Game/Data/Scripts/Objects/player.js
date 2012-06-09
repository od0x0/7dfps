script.attachEvent(DIM3_EVENT_CONSTRUCT, 'OnConstruct');
script.attachEvent(DIM3_EVENT_SPAWN, 'OnSpawn');
script.attachEvent(DIM3_EVENT_DAMAGE, 'OnDamage');
script.attachEvent(DIM3_EVENT_HEALTH, 'OnHealthUpdate');
script.attachEvent(DIM3_EVENT_DIE, 'OnDeath');
script.attachEvent(DIM3_EVENT_PICKUP, 'OnPickup');
script.attachEvent(DIM3_EVENT_TIMER, "OnTimer")

const LineOfSightTimerID = 1;

function Weapon(name)
{
	this.name=name;
}

var Weapons=new Array(2);
Weapons[1]=new Weapon("AssaultRifle"); //"This is my rifle!"
Weapons[2]=new Weapon("Shotgun"); //"This is my gun!"
Weapons[3]=new Weapon("ParticleBeamCannon"); //"This is for shooting!"
Weapons[0]=new Weapon("Nothing"); //"This is for fun!"

function OnConstruct(object, subevent, id, tick)
{
	object.model.on=false;
	//object.model.name="Player";
	object.model.shadow.on=false;
	
	object.size.x=1800;
	object.size.z=1800;	
	object.size.y=1800;
	object.size.eyeOffset=-1600;
	object.size.weight=180;
	
	object.setting.bumpUp=true;
	object.objectSpeed.bumpHeight=3000;
	
	object.click.crosshairUp="Use";
	object.click.crosshairDown="Use";
	
	object.turnSpeed.facingWalk=4;
	object.turnSpeed.motionWalk=4;
	object.turnSpeed.facingRun=4.2;
	object.turnSpeed.motionRun=4.2;
	object.turnSpeed.facingCrawl=3;
	object.turnSpeed.motionCrawl=3;
	object.turnSpeed.facingAir=3;
	object.turnSpeed.motionAir=3;
	
	object.forwardSpeed.walk=120;
	object.forwardSpeed.run=75;
	object.forwardSpeed.crawl=50;
	object.forwardSpeed.air=80;
	object.forwardSpeed.acceleration=4;
	object.forwardSpeed.deceleration=8;
	object.forwardSpeed.accelerationAir=1.0;
	object.forwardSpeed.decelerationAir=0.5;
	
	object.sideSpeed.walk=115;
	object.sideSpeed.run=75;
	object.sideSpeed.crawl=60;
	object.sideSpeed.air=50;
	object.sideSpeed.acceleration=4;
	object.sideSpeed.deceleration=8;
	object.sideSpeed.accelerationAir=1.0;
	object.sideSpeed.decelerationAir=0.5;

	object.verticalSpeed.normal=70;
	object.verticalSpeed.acceleration=20;
	object.verticalSpeed.deceleration=20;
	
	object.objectSpeed.jumpHeight=45;
	object.objectSpeed.bumpHeight=800;
	object.objectSpeed.duckAdd=32;
	object.objectSpeed.duckChange=1000;
	
	object.look.upAngle=90;
	object.look.downAngle=90;
	
	object.health.maximum=100;
	object.health.start=100;
	object.health.recoverTick=0;
	object.health.recoverAmount=0;
	
	object.setting.ignorePickUpItems=false;
	object.setting.damage=true;
	object.setting.invincible=false;
	
	
	for(var i = 0; i < Weapons.length; i++)
	{
		object.weapon.add(Weapons[i].name);
		//object.weapon.hideSingle(Weapons[i].name, true);
	}

	object.weapon.add("LineOfSight");
	object.weapon.hideSingle("LineOfSight", true);
	
	object.model.light.index=0;
	object.model.light.on=false;
	object.model.light.intensity=5000;
	object.model.lightColor.red=1;
	object.model.lightColor.green=0.3;
	object.model.lightColor.blue=0.3;
	
   // object.setting.contactProjectile=false;
}

function OnSpawn(object, subevent, id, tick)
{
	object.size.eyeOffset=-1600;
	object.setting.contact=true;
	object.setting.suspend=false;
	object.health.reset();
	object.position.reset();
	for(var i = 0; i < Weapons.length; i++)
	{
		//object.weapon.hideSingle(Weapons[i].name, true);
	}
	object.weapon.setSelect(Weapons[2].name);
	//iface.bitmap.setAlpha("Blood", 1-(object.health.current/object.health.maximum));
	//iface.text.setText("AmmoTextbox"," ");

	//object.event.startTimer(10, LineOfSightTimerID);
}

function OnDamage(object, subevent, id, tick)
{
	object.status.tintView(new Color(1, 0, 0), 0.5, 500, 300, 1000);
	OnHealthUpdate();
}

function OnHealthUpdate(object, subevent, id, tick)
{
	iface.bar.setValue("Health", object.health.current / object.health.maximum);
	//iface.bitmap.setAlpha("Blood", 1-(object.health.current/object.health.maximum));
}

function OnDeath(object, subevent, id, tick)
{
	object.event.clearTimer();
	map.action.restartMap();
}

function OnPickup(object, subevent, id, tick)
{
	//if(!object.pickup.itemName) return;
	object.weapon.setSelect(object.pickup.itemName);
}

function OnTimer(object, subevent, id, tick)
{
	if(id == LineOfSightTimerID) 
	{
		object.weapon.fire("LineOfSight", 0);
		iface.console.write("Timer Fired After " + tick + " Ticks");
	}
}
