//
// Basic Enemy Script
//
// This is a basic enemy script to include in other scripts.
// To configure its behavior, use spot parameter 0.
//
// Possible patterns:
// 1 - Stand.
//     The enemy spawns and stands around until the player is sighted
//     then attacks.
//     Requires no other parameters.
//
// 2 - Random walk.
//     The enemy turns into a random direction and walks a random distance,
//     then repeats. Stops when walking into walls or other enemies and
//     turns around.
//     Requires no other parameters.
//
// 3 - Node patrol.
//     The enemy walks to one node, then back to the other and repeats.
//     Assumes a clear path, does not check for obstacles.
//     Requires parameter 1 and 2 to be valid node names.
//
// No matter which pattern is chosen, upon sighting the player, the bot will
// start attacking him.
// Sight uses 3 ways to test if the player can be seen:
//     - A watch that activates the sight check when in range.
//     - An angle test to see if the player is within the visible range.
//     - A line of sight test to see if the player is behind an obstacle or wall.
//



//
// events
//

script.attachEvent(DIM3_EVENT_CONSTRUCT,'enemyConstruct');
script.attachEvent(DIM3_EVENT_SPAWN,'enemySpawn');
script.attachEvent(DIM3_EVENT_PATH,'enemyPathDone');
script.attachEvent(DIM3_EVENT_COLLIDE,'enemyCollide');
script.attachEvent(DIM3_EVENT_WATCH,'enemyWatch');
script.attachEvent(DIM3_EVENT_DAMAGE,'enemyDamage');
script.attachEvent(DIM3_EVENT_DIE,'enemyDie');


//
// constants
//

// behavior constants

const ENEMY_MODE_STAND = 1; // Stand in place.
const ENEMY_MODE_RANDOM_WALK = 2; // Walk around randomly.
const ENEMY_MODE_NODE_PATROL = 3; // Walk node paths.


// difficulty constants

// Dodge chance is 100% when targettedCount == DODGE_CHANCE
// Lower this value to make bots dodge faster
const DODGE_CHANCE = 10;


// misc constans
const WATCH_DISTANCE = 20000;
const ATTACK_DISTANCE = 15000;


//
// variables
//

// What mode the enemy is using, defaults to 1
var behavior_mode = 1;
var start_node_name = "";
var end_node_name = "";

// Status variables
var chasing_player = false;
var searching_player = false;
var player_last_position = 0;
var node_reverse = false;
var voice_tick = 0;
var voice_wait = 0;
var dead = false;

// How often the enemy was targeted. Resets to 0 after dodging.
var targettedCount = 0;

//
// functions
//

// construct

function enemyConstruct(obj,subEvent,id,tick) {
    obj.model.on = true;
    obj.model.name = "TestEnemy";
    
    obj.setting.damage=true;
    obj.setting.bumpUp=true;
    
    obj.health.maximum = 100;
    obj.health.start = 100;
    
    obj.size.x = 600;
    obj.size.z = 600;
    obj.size.y = 2000;
    obj.size.eyeOffset = -1000;
    
    obj.objectSpeed.bumpHeight = 300;
    
    obj.watch.setRestrictSight(120,true);
}

// spawn

function enemySpawn(obj,subEvent,id,tick) {
    obj.model.animation.start("Idle");
    
    behavior_mode = parseInt(obj.setting.getParameter(0));
    start_node_name = obj.setting.getParameter(1);
    end_node_name = obj.setting.getParameter(2);

    
    enemyBehaviorReset(obj);
    
    obj.forwardSpeed.walk = 20;
    obj.turnSpeed.facingWalk = 1.5;
    obj.forwardSpeed.acceleration=1.0;
	obj.forwardSpeed.deceleration=1.2;
}

// return to normal behavior

function enemyBehaviorReset(obj) {

    iface.console.write("Reset behavior.");
    
    obj.event.clearChain();
    
    switch (behavior_mode) {
        case ENEMY_MODE_NODE_PATROL: // Node walk
            enemyNodePatrol(obj);
            break;
        case ENEMY_MODE_RANDOM_WALK: // Random walk
            enemyRandomWalk(obj);
            break;
        case ENEMY_MODE_STAND: // Stand = default
        default:
            break;
    }
    
    obj.watch.start(WATCH_DISTANCE);
    
}

// patroling nodes

function enemyNodePatrol(obj) {
    if (!node_reverse) {
        obj.motionVector.walkToNode(start_node_name,end_node_name,1);
    } else {
        obj.motionVector.walkToNode(end_node_name,start_node_name,1);
    }
}

function enemyPathDone(obj,subEvent,id,tick) {
    if (subEvent == DIM3_EVENT_PATH_DONE) {
        node_reverse = !node_reverse;
        enemyNodePatrol(obj);
    }
}

// random walking

function enemyRandomWalk(obj) {
    var turn_angle = utility.random.getInteger(-90,90);
    var walk_time = utility.random.getInteger(30,100);
    obj.motionAngle.turnToAngle(obj.angle.y+turn_angle,0);
    obj.motionVector.go();
    obj.model.animation.start("Move");
    obj.event.chain(walk_time,"enemyRandomWalk");
}

// collision with walls

function enemyCollide(obj,subEvent,id,tick) {
    if (behavior_mode != ENEMY_MODE_RANDOM_WALK) return; // This is only used for random walk
    // TODO:
    // Fix turn angle
    //map.polygon.getNormal(map.polygon.findFacedByObject(obj.setting.id));
    obj.motionAngle.turnToAngle(obj.angle.y+180,0);
    obj.event.chain(30,"enemyRandomWalk");
}

// watch

function enemyWatch(obj,subEvent,id,tick) {
    if(!obj.watch.objectIsPlayer) return;
    switch (subEvent) {
        case DIM3_EVENT_WATCH_OBJECT_NEAR:
            enemyStartChase(obj,tick);
            break;
        case DIM3_EVENT_WATCH_OBJECT_FAR:
            enemyStopChase(obj,tick);
            break;
        default:
            break;
    }
}

// chasing

function enemyStartChase(obj,tick) {
    iface.console.write("Sighted. Start chase.");
    chasing_player = true;
    searching_player = false;
    robotVoice(obj,"Robot Bark Attack",tick,"10000");
    enemyChaseLoop(obj);
}

function enemyStopChase(obj,tick) {
    iface.console.write("Lost sight. Stop chase.");
    chasing_player = false;
    searching_player = true;
    enemyChaseLoop(obj);
}

function enemyChaseLoop(obj) {
    if(chasing_player) { // Chasing
        // Prepare everything to attack
        // then fire
        if(obj.position.distanceToPlayer() <= ATTACK_DISTANCE) {
            enemyAttack(obj);
        } else {
            // Walk towards the player if youre far away
            obj.motionVector.walkToPlayer();
            obj.model.animation.start("Move");
        }
        // Also remember the players position to look for him later
        player_last_position = map.object.getPosition(map.object.findPlayer());
    } else if (searching_player) { // Searching
        // Move towards the players last known position
        if (utility.point.distanceTo(obj.position,player_last_position) > 1500) { 
            obj.motionVector.walkToPosition(player_last_position);
            obj.model.animation.start("Move");
        } else {
            // When you're there, turn towards the player.
            // If you can see him, the watch should fire again and reset everything.
            searching_player = false;
            chasing_player = false;
            obj.motionVector.turnToPlayer();
            obj.model.animation.start("Idle");
        }
    } else {
        // If not searching or chasing, go back to whatever.
        enemyBehaviorReset(obj);
        return;
    }
    
    // Do all of the above every second.
    obj.event.chain(5,"enemyChaseLoop");
}

// attacking

function enemyAttack(obj) {
    /*iface.console.write("ATTACK!");
    obj.model.animation.startThenChange("Attack","Idle");
    obj.motionAngle.facePlayer();
    obj.motionVector.stop();*/
    script.callChildFunction('enemyAttack',obj);
}

// being damaged

function enemyDamage(obj,subEvent,id,tick) {
    if(chasing_player) return; // youre fighting so you expected this attack
    obj.motionVector.turnToPlayer();
    // voice: Being attacked
}

// death

function enemyDie(obj,subEvent,id,tick) {
    obj.setting.hidden = true;
    dead = true;
    obj.event.clearChain();
    obj.motionAngle.turnStop();
    obj.motionAngle.faceStop();
    obj.motionVector.stop();
    obj.watch.stop();
    obj.setting.contact = false;
    obj.setting.damage = false;
}

// being targetted

function enemyBeingTargetted(obj) {
    targettedCount++;
    // TODO:
    // Proper formula using random number to calculate chance.
    if (targettedCount >= DODGE_CHANCE) {
        enemyDodge();
    }
}

// voice samples

function robotVoice(obj,name,tick,wait) {
    iface.console.write("Try to play sound "+name);
    var voice_tick_wait = parseInt(voice_tick) + parseInt(voice_wait);
    iface.console.write(tick+"/"+(voice_tick_wait));
    if(tick < voice_tick_wait) return;
    voice_tick = tick;
    voice_wait = wait;
    sound.play(name,obj.position,1.0);
}