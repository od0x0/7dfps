// ***********************************************************
//
// PROJECTILE: Ray
//
// ***********************************************************

script.attachEvent(DIM3_EVENT_CONSTRUCT,'projectileConstruct');
script.attachEvent(DIM3_EVENT_HIT,'projectileHit');

//
// projectile construct
//

function projectileConstruct(proj,subEvent,id,tick)
{
		// hit scan projectile
		
	proj.setting.hitScan=true;
	proj.speed.maxHitScanDistance=150000;

		// size
		
	proj.size.x=150;
	proj.size.z=150;
	proj.size.y=150;
	
		// the damage
		
	proj.action.damage=100;
	proj.action.collision=true;
	
		// the projectile push
		
	//proj.push.on=true;
	//proj.push.force=80;

	proj.melee.radius = 1000;
	proj.melee.damage = 100;
	proj.melee.force = -200;

		// hit decal
		/*
	proj.mark.on=false;
	proj.mark.name='mark_ray';
	proj.mark.size=300;
	proj.mark.alpha=0.3;*/
}

//
// projectile hit
//

function projectileHit(proj,subEvent,id,tick)
{
	spawn.rayTeamColor(proj.origin, proj.position, 15, 500);
	spawn.ringLine(proj.origin,proj.position,20,'Ray Ring');
	spawn.particle(proj.position,'Ray Globe');

	if(utility.random.getInteger(0, 3) == 0) proj.melee.spawnFromPosition(proj.position);
	
	proj.action.destroy();
}

