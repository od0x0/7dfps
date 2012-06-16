script.attachEvent(DIM3_EVENT_CONSTRUCT, "OnConstruct");
script.attachEvent(DIM3_EVENT_HIT, "OnContact");
script.attachEvent(DIM3_EVENT_SPAWN, "OnSpawn");

const DAMAGE_BASE = 8;

var skill_factor = 1;

function OnConstruct(projectile, subevent, id, tick) {

    switch(singleplayer.setting.skill) {
        case 0:
            skill_factor = 1;
            break;
        case 1:
            skill_factor = 2;
            break;
        case 2:
            skill_factor = 5;
            break;
    }

	projectile.setting.hitScan=false;
	
    projectile.model.on = true;
	projectile.model.name = "Grenade";
	//projectile.model.spin.x = 1;
	
	projectile.speed.speed = 400;

	projectile.push.on=true;
	projectile.push.force=0.5;
	
	projectile.size.x=100;
	projectile.size.z=400;
	projectile.size.y=100;
	projectile.size.weight = 100;

	projectile.melee.radius = 1000;
	projectile.melee.damage = 0;
	projectile.melee.force = -10;
	
	projectile.melee.strikeBoneName='Body';
	projectile.melee.strikePoseName='Idle';
	projectile.melee.radius=5000;
	projectile.melee.damage=DAMAGE_BASE*skill_factor;
	projectile.melee.force=40;
}

function OnContact(projectile, subevent, id, tick) {	

    // TODO: Effects
	sound.play("Robot Explosion 1", projectile.position, utility.random.getFloat(0.8, 1.2));
	spawn.particleMoving(projectile.position, projectile.hit.ejectVector, 'sparks');

    projectile.melee.spawnFromProjectileBone();

	projectile.action.destroy();
}

function OnSpawn(projectile, subevent, id, tick) {
    projectile.model.animation.start("Idle");
}
