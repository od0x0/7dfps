//
// Test Enemy Script
//


script.implements('enemy_base');
script.attachEvent(DIM3_EVENT_CONSTRUCT,"enemyConstruct");
script.attachEvent(DIM3_EVENT_SPAWN,"enemySpawn");
script.attachEvent(DIM3_EVENT_WATCH,'enemyWatch');
script.attachEvent(DIM3_EVENT_DIE,'enemyDie');

const HEALTH_BASE = 40;


var fireBone = 1;
var shotsFired = -1;
var reloadWait = 2000;
var reloadTick = 0;

var summoned_enemies = false;
var summon_spot_name = "";
var summon_spots = new Array();
var summoning = false;

function enemyConstruct(obj,subEvent,id,tick) {
    script.callParent();
    
    obj.model.name = "Little Guy Red";
    obj.weapon.add("CommandBot_Weapon");
    obj.health.maximum = HEALTH_BASE;
    obj.health.start = HEALTH_BASE;
}

function enemySpawn(obj,subEvent,id,tick) {
    script.callParent();
    summon_spot_name = obj.setting.getParameter(3);
    for (var i = 0; i < map.spot.count; i++) {
        if (map.spot.getName(i) == summon_spot_name) {
            summon_spots.push(i);
        }
    }
}

function enemyAttack(obj,tick) {
    obj.model.animation.change("Idle");
    obj.motionVector.stop();
    obj.motionVector.turnToPlayer();
    startFire(obj,tick);
}

function enemyWatch(obj,subEvent,id,tick) {
    if(subEvent == DIM3_EVENT_WATCH_OBJECT_NEAR && obj.watch.objectIsPlayer) startSummon(obj,tick);
    script.callParent();
}

function startSummon(obj,tick) {
    iface.console.write("SPAWN!");
    summoning = true;
    obj.event.chain(15,"summonEnemies");
}

function summonEnemies(obj,tick) {
    if (summoned_enemies == true) return false;
    summoned_enemies = true;
    for (var i = 0; i < summon_spots.length; i++) {
        
        var point = map.spot.getPosition(summon_spots[i]);
        var angle = map.spot.getAngle(summon_spots[i]);
        map.object.spawn(summon_spot_name,"security_bot","4",point,angle);
        spawn.particle(point,"Teleport");
        var white = Color;
        spawn.flash(point,new Color(1,1,1),150,250,250);
        // TODO: Particle and sound
    }
    summoning = false;
    return true;
}

function startFire(obj,tick) { // fires for a few seconds? randomly
    if (summoning) return;
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
    obj.weapon.fire("CommandBot_Weapon",1); // BAM
    
    // Lights and Sounds
    spawn.particle(obj.model.bone.findPosition("Idle","Fire"+fireBone),"Bot Muzzle Flash");
	spawn.particle(obj.model.bone.findPosition("Idle","Fire"+fireBone),"Explosion White Center");
    sound.playAtObject("Enemy Fire",obj.setting.id,1.0);
    
    // move through the fire bones
	fireBone += 1;
	if (fireBone > 3) fireBone = 1;
	
	// repeat
	obj.event.chain(1,"startFire");
}

function enemyDie(obj,subevent,id,tick) {
    obj.event.clearChain();
    script.callParent();
}