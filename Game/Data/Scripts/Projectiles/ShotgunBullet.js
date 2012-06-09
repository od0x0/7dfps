script.attachEvent(DIM3_EVENT_CONSTRUCT, "OnConstruct");
script.attachEvent(DIM3_EVENT_HIT, "OnContact");

function OnConstruct(projectile, subevent, id, tick)
{
	projectile.setting.hitScan=true;
	
	projectile.speed.maxHitScanDistance=150000;
	
	projectile.action.damage=5;
	projectile.action.collision=true;
}

function OnContact(projectile, subevent, id, tick)
{	
	spawn.particleMoving(projectile.position, projectile.hit.ejectVector, 'Debris');
	projectile.action.destroy();
}
