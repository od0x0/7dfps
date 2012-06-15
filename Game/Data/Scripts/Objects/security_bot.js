//
// Test Enemy Script
//


script.implements('enemy_base');
script.attachEvent(DIM3_EVENT_CONSTRUCT,"enemyConstruct");

const HEALTH_BASE = 50;
const BOUNTY = 500;

var fireBone = 1;
var shotsFired = -1;
var reloadWait = 2000;
var reloadTick = 0;


function enemyConstruct(obj,subEvent,id,tick) {
    script.callParent();
    
    obj.model.name = "Little Guy";
    obj.weapon.add("SecurityBot_Weapon");
    obj.health.maximum = HEALTH_BASE;
    obj.health.start = HEALTH_BASE;

    script.callParentFunction("enemySetBounty", BOUNTY);
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
    sound.playAtObject("Enemy Fire",obj.setting.id,1.0);
    
    // move through the fire bones
	fireBone += 1;
	if (fireBone > 3) fireBone = 1;
	
	// repeat
	obj.event.chain(1,"startFire");
}