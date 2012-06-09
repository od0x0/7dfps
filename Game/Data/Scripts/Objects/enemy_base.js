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


//
// variables
//

// What mode the enemy is using, defaults to 1
var behavior_mode = 1;
var start_node_name = "";
var end_node_name = "";

// Status variables
var chasing_player = false;
var node_reverse = false;

// How often the enemy was targeted. Resets to 0 after dodging.
var targettedCount = 0;

//
// functions
//

// construct

function enemyConstruct(obj,subEvent,id,tick) {
    obj.model.on = true;
    obj.model.name = "TestEnemy";
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

// being targetted

function enemyBeingTargetted(obj) {
    targettedCount++;
    // TODO:
    // Proper formula using random number to calculate chance.
    if (targettedCount >= DODGE_CHANCE) {
        enemyDodge();
    }
}