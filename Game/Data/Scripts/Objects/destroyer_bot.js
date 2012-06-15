//
// Test Enemy Script
//


script.implements('enemy_base');
script.attachEvent(DIM3_EVENT_CONSTRUCT,"enemyConstruct");

const HEALTH_BASE = 100;

var fireBone = 1;
var shotsFired = -1;
var grenadesFired = -1;
var reloadWait = 2000;
var grenadeWait = 5000; // how long to wait before firing the next grenades
var reloadTick = 0;
var grenadeTick = 0;
var grenadeMinDistance = 2000;
var grenadeMaxDistance = 8000;
var fireWait = 1;

function enemyConstruct(obj,subEvent,id,tick) {
    script.callParent();

    obj.model.name = "Big Guy"; // TODO: Change this
    //obj.weapon.add("SecurityBot_Weapon");
    obj.weapon.add("DestroyerBot_Weapon");
    obj.health.maximum = HEALTH_BASE;
    obj.health.start = HEALTH_BASE;
}

function enemyAttack(obj,tick) {
    obj.model.animation.change("Idle");
    obj.motionVector.stop();
    obj.motionVector.turnToPlayer();
    startFire(obj,tick);
}

function startFire(obj,tick) { // fires for a few seconds? randomly
    obj.model.animation.change("Idle"); // make sure we're not swiveling while aiming
    if (tick < reloadTick) return; //still reloading
    obj.motionVector.stop(); // stop movement to fire
	
	// decide what to fire
	/*if(grenadeMinDistance < obj.position.distanceToPlayer() < grenadeMaxDistance) {
	    fireGrenade(obj,tick);
	    fireWait = 5;
	} else {
	    //fireGun(obj,tick);
	    fireWait = 1;
    }*/
	
    shotsFired += 1; // We just fired!
    if (shotsFired <= 0) return; // first "empty" shot to delay a bit
    reloadTick = parseInt(tick); // we didnt reload, so were fine here
    if (shotsFired > 4) { // you fired enough for now
        shotsFired = -1; // reset this
        reloadTick += grenadeWait; // gotta reload
        return;
    }
    obj.weapon.fire("DestroyerBot_Weapon",1); // BAM
    fireWait = 1;
    
    // Lights and Sounds
    //spawn.particle(obj.model.bone.findPosition("Idle","Fire"+fireBone),"Bot Muzzle Flash");
	//spawn.particle(obj.model.bone.findPosition("Idle","Fire"+fireBone),"Explosion White Center");
    //sound.playAtObject("Gun Fire",obj.setting.id,1.0);


	// repeat
	obj.event.chain(fireWait,"startFire");
}

function fireGun(obj,tick) {
    shotsFired += 1; // We just fired!
    if (shotsFired <= 0) return; // first "empty" shot to delay a bit
    reloadTick = parseInt(tick); // we didnt reload, so were fine here
    if (shotsFired > 6) { // you fired enough for now
        shotsFired = -1; // reset this
        reloadTick += reloadWait; // gotta reload
        return;
    }
    obj.weapon.fire("SecurityBot_Weapon",1); // BAM
    
    // Lights and Sounds
    spawn.particle(obj.model.bone.findPosition("Idle","Fire"+fireBone),"Bot Muzzle Flash");
	//spawn.particle(obj.model.bone.findPosition("Idle","Fire"+fireBone),"Explosion White Center");
    sound.playAtObject("Gun Fire",obj.setting.id,1.0);
    
    // move through the fire bones
	fireBone += 1;
	if (fireBone > 3) fireBone = 1;    
}

function fireGrenade(obj,tick) { // Fire 4 grenades in quick succession
    grenadesFired++;
    if(grenadesFired <= 0) return; // first empty nade, delay
    grenadeTick = parseInt(tick);
    if (grenadesFired > 4) { // fired 4 shots
        grenadesFired = -1; // reset
        grenadeTick += grenadeWait; // reload
        return;
    }
    obj.weapon.fire('DestroyerBot_Weapon',1); // PLONK
    
    // TODO: Lights and Sounds
    
}