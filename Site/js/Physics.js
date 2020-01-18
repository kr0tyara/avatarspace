var b2Vec2 = Box2D.Common.Math.b2Vec2,
b2BodyDef = Box2D.Dynamics.b2BodyDef,
b2Body = Box2D.Dynamics.b2Body,
b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
b2Fixture = Box2D.Dynamics.b2Fixture,
b2World = Box2D.Dynamics.b2World,
b2MassData = Box2D.Collision.Shapes.b2MassData,
b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
world = new b2World(new b2Vec2(0, 100),  true);	
function CreateFixture() {
	var fixDef = new b2FixtureDef;
	fixDef.density = 5;
	fixDef.friction = 50;
	fixDef.restitution = .9;
	return fixDef;
}
function InitPhysics() {
	var fixDef = CreateFixture();
	AddFloor();
}
function AddBody(U) {
	var fixDef = CreateFixture();
	
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(50/2, 85/2);
	bodyDef.userData = U.name;
	bodyDef.position.x = U.x;
	bodyDef.position.y = U.y;
	var b = world.CreateBody(bodyDef);
	b.CreateFixture(fixDef);
	return b;
}
function AddFloor() {
	var fixDef = CreateFixture();
	
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.x = 0;
	bodyDef.position.y = 600;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(1000, 50);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
}
function IfThereBody(Name) {
	var a = false;
	
	for (var bb = world.GetBodyList(); bb; bb = bb.GetNext()) {
		if(bb.GetUserData() == Name) a = true;
		break;
	}
	return a;
}