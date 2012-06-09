script.attachEvent(DIM3_EVENT_CONSTRUCT, "OnConstruct");
script.attachEvent(DIM3_EVENT_HIT, "OnContact");

function OnConstruct(projectile, subevent, id, tick)
{
	projectile.setting.hitScan=true;
	
	projectile.speed.maxHitScanDistance=150000;
	
	projectile.action.damage=5;
	projectile.action.collision=true;

	projectile.push.on=true;
	projectile.push.force=0.5;

	//projectile.melee.radius = 1000;
	//projectile.melee.damage = 0;
	//projectile.melee.force = -10;
}

function OnContact(projectile, subevent, id, tick)
{	
	spawn.particleMoving(projectile.position, projectile.hit.ejectVector, 'Debris');

	//var position = new Point(projectile.position.x + projectile.hit.ejectVector.x, projectile.position.y + projectile.hit.ejectVector.y, projectile.position.z + projectile.hit.ejectVector.z);
	//if(utility.random.getInteger(0, 3) == 1) 
	//	projectile.melee.spawnFromPosition(position);

	projectile.action.destroy();
}
