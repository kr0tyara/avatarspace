//Powered by kr0tyara (c)

var	SFS, 
	CTX,
	Canvas, 
	LoadProgress = 0, 
	Objects = {
		character: null,
		loc_abstr: null,
		loc_sand: null,
		loc_vorobey: null,
		loc_paper: null,
		loc_lab: null
	}, 
	Users = [], 
	RoomObjects = [],
	CurrentScreen = 'loading',
	World; 
	
const	
		Config = {
			ip: 'localhost',
			port: 8080, 
			zone: 'AvatarJS' 
		}
		LoadingData = {
			character: './img/char.png?v5', 
			loc_abstr: './img/abstraction.png?v5',
			loc_sand: './img/sandbox.png?v5',
			loc_vorobey: './img/vorobey.png?v5',
			loc_paper: './img/paper.png?v5',
			loc_lab: './img/laboratory.png?v5'
		},
		Screen = {
			'loading': [
				{type: 'rect', x: 0, y: 0, width: 1000, height: 650, color: '#00BC8D'},
				{type: 'rect', x: 0, y: 600, width: 1000, height: 50, color: 'rgba(255, 255, 255, .5)'},
				{type: 'text', x: 250, y: 300, color: '#FFFFFF', font: 'normal 75px Broadway', content: 'Avatar.Space'},
				{type: 'text', x: 15, y: 630, color: '#FFFFFF', font: 'normal 20px Verdana', content: 'Подключение к серверу...'},
				{type: 'text', x: 930, y: 630, color: '#FFFFFF', font: 'normal 20px Verdana', content: ''}
			],
			'game': [
				{type: 'image', x: 0, y: 0, width: 1000, height: 650, content: ''}
			],
			'disconnect': [
				{type: 'rect', x: 0, y: 0, width: 1000, height: 650, color: '#00BC8D'},
				{type: 'text', x: 25, y: 150, color: '#FFFFFF', font: 'bold 30px Verdana', content: 'Дисконнект'},
				{type: 'text', x: 25, y: 185, color: '#FFFFFF', font: 'normal 20px Verdana', content: 'Потеряно соединение с сервером.'},
				{type: 'text', x: 25, y: 210, color: '#FFFFFF', font: 'normal 20px Verdana', content: 'Возможно, Вас кикнули или забанили. Кто знает...'}
			]
		}, 
		Locations = {
			'Lobby': {
				name_en: 'Abstraction',
				name_ru: 'Абстракция',
				file: 'loc_abstr',
				avatarX: 150,
				pointer: [
					{
						x: 475,
						y: 5,
						width: 130,
						to: 'Sandbox'
					},
					{
						x: 865,
						y: 330,
						width: 130,
						to: 'Vorobey'
					},
					{
						x: 15,
						y: 505,
						width: 130,
						to: 'Laboratory'
					}
				]
			},
			'Sandbox': {
				name_en: 'Sandbox',
				name_ru: 'Песочница',
				file: 'loc_sand',
				avatarX: 50,
				pointer: [{
					x: 455,
					y: 495,
					width: 130,
					to: 'Lobby'
				}]
			},
			'Vorobey': {
				name_en: 'Vorobey FM',
				name_ru: 'Воробей ФМ',
				file: 'loc_vorobey',
				avatarX: 0,
				pointer: [
					{
						x: 17,
						y: 380,
						width: 130,
						to: 'Lobby'
					},
					{
						x: 468,
						y: 511,
						width: 130,
						to: 'Paper'
					}
				]
			},
			'Paper': {
				name_en: 'Paper',
				name_ru: 'Лист бумаги',
				file: 'loc_paper',
				avatarX: 200,
				pointer: [{
					x: 422,
					y: 47,
					width: 130,
					to: 'Vorobey'
				}]
			},
			'Laboratory': {
				name_en: 'Laboratory',
				name_ru: 'Лаборатория',
				file: 'loc_lab',
				avatarX: 100,
				pointer: [{
					x: 850,
					y: 2,
					width: 130,
					to: 'Lobby'
				}]
			}
		},
		Avatars = ['vorobey', 'sandbox', 'laboratory', 'lobby', 'paper', 'custom', 'new', 'mole', 'lindgren', 'simon', 'fedor', 'bunny'],
		FPS = 60; 
		
$(document).ready(function(){
	console.log('uhodi');
	
	Canvas = $('.game')[0];
	CTX = Canvas.getContext('2d');
	SFS = new SFS2X.SmartFox();
	
	setInterval(InitScr, 1000/FPS);
	
	SFS.addEventListener(SFS2X.SFSEvent.CONNECTION, Connection, this);
	SFS.addEventListener(SFS2X.SFSEvent.LOGIN, Login, this);
	SFS.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, Login_Error, this);
	SFS.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, Join, this);
	SFS.addEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, AddUser, this);
	SFS.addEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, RemoveUser, this);
	SFS.addEventListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, UpdUserVars, this);
	SFS.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, ConnectionLost, this);
	SFS.addEventListener(SFS2X.SFSEvent.PUBLIC_MESSAGE, Msg, this);
	
	Connect();
})


//sfs
function Connect() {
	SFS.connect(Config.ip, Config.port);
}
function Connection(e) {
	if(e.success) {
		$.ajax({
			url: 'server/Token.php',
			type: 'POST',
			crossDomain: true,
			data: {
				game: 1
			}, 
			success: function(data) {
				var answer = JSON.parse(data.trim());
				if(answer.success == '1') {
					SFS.send(new SFS2X.LoginRequest(answer.name, answer.token, null, Config.zone));
				}
				else{
					SFS.disconnect();
				}
			}
		})
	}
}
function ConnectionLost(e) {
	CurrentScreen = 'disconnect';
}
function Login(e) {
	SendCoords(500, 325);
	SFS.send(new SFS2X.JoinRoomRequest('Vorobey'));
}
function Login_Error(e) {
	SFS.disconnect();
}
function Join(e) {
	if(!Objects.character) {
		LoadData();
	}
	else {
		CurrentScreen = 'game';
	}
	
	RoomObjects.length = 0;
	LoadUsers();
	
	$('.lname').html(Locations[e.room.name].name_ru);
	
	if(e.room.name == 'Laboratory') {
		InitPhysics();
	}
}
function SendCoords(X, Y) { 
	var Data = [];
	Data.push(new SFS2X.SFSUserVariable('x', X));
	Data.push(new SFS2X.SFSUserVariable('y', Y));
	SFS.send(new SFS2X.SetUserVariablesRequest(Data));
}
function Send() {
	SFS.send(new SFS2X.PublicMessageRequest($('input[name="txt"]').val()));
	$('input[name="txt"]').val('');
}

//canvas
function Step(U) {
	if(SFS.lastJoinedRoom.name == 'Sandbox' || SFS.lastJoinedRoom.name == 'Paper') {
		U = GetUserByName(U.name);
		RoomObjects.push({type: 'step', x: U.x, y: U.y, who: U.name, color: (SFS.lastJoinedRoom.name == 'Sandbox' ? '#E57700' : 'rgba(0, 0, 0, .7')});
	}
}
function Walk(e) {
	if(!Pointers(e)) {
		var X = e.pageX - Canvas.offsetLeft;
		var Y = e.pageY - Canvas.offsetTop;
		SendCoords(X, Y);
	}
	else {
		CurrentScreen = 'loading';
		SendCoords(500, 325);
		SFS.send(new SFS2X.JoinRoomRequest(Pointers(e).to));
	}
}
function Pointers(e) {
	var X = e.pageX - Canvas.offsetLeft;
	var Y = e.pageY - Canvas.offsetTop;
	var k = -1;
	
	Locations[SFS.lastJoinedRoom.name].pointer.forEach(function(Pointer, i) {
		if(X >= Pointer.x && X <= Pointer.x + Pointer.width && Y >= Pointer.y && Y <= Pointer.y + Pointer.width) {
			$('.game').attr('style', 'cursor: pointer');
			k = i;
		}
	});
	if(k == -1) {
		if($('.game').attr('style')) $('.game').removeAttr('style');
	}
	return Locations[SFS.lastJoinedRoom.name].pointer[k];
}
function InitScr() {
	name = CurrentScreen;
	CTX.clearRect(0, 0, 1000, 650);
	switch(name){
		case 'loading':
			if(LoadProgress) Screen[name][4]['content'] = String(Math.round(LoadProgress/Object.keys(LoadingData).length) * 100) + '%';
			if(SFS && SFS.isConnected) Screen[name][3]['content'] = 'Загрузка ресурсов...';
			$('.panel').removeAttr('style');
			$('.up').removeAttr('style');
			$('.edit').removeAttr('style');
			break;
		case 'game':
			Canvas.onclick = Walk;
			Canvas.onmousemove = Pointers;
			Screen[name][0]['content'] = Locations[SFS.lastJoinedRoom.name]['file'];
			$('.panel').attr('style', 'display: block');
			$('.up').attr('style', 'display: block');
			break;
		case 'disconnect':
			Canvas.onclick = null;
			Canvas.onmousemove = null;
			$('.panel').removeAttr('style');
			$('.up').removeAttr('style');
			$('.edit').removeAttr('style');
			break;
	}
	
	Screen[name].forEach(function(Item) {
		CTX.fillStyle = Item.color;
		switch(Item.type) {
			case 'rect':
				CTX.fillRect(Item.x, Item.y, Item.width, Item.height);
				break;
			case 'text':
				CTX.font = Item.font;
				CTX.textAlign = 'left';
				CTX.fillText(Item.content, Item.x, Item.y);
				break;
			case 'image':
				CTX.drawImage(Objects[Item.content], Item.x, Item.y);
				break;
		}
	});
	
	if(name == 'game') {
		DrawRoomObjects();
		DrawUsers();
		Sort();
		
		if(SFS.lastJoinedRoom.name == 'Laboratory' && world) {
			world.Step(1 / 60, 10, 10);
			for (var bb = world.GetBodyList(); bb; bb = bb.GetNext()) {
				if(bb.GetUserData() && GetUserByName(bb.GetUserData())) {
					GetUserByName(bb.GetUserData()).x = bb.GetPosition().x;
					GetUserByName(bb.GetUserData()).y = bb.GetPosition().y;
					GetUserByName(bb.GetUserData()).rotation = bb.GetAngle();
				}
			}
		}
	}
}
//interact
function CreateUser(U) {
	if(U.x && U.y){
		//character
		var Avatar = (U.user.getVariable('WearType').value == 1 ? Locations[SFS.lastJoinedRoom.name].avatarX : U.user.getVariable('Skin').value * 50);
		CTX.drawImage(Objects.character, Avatar, 0, 50, 85, U.x - 25, U.y - 85, 50, 85);
		//name
		CTX.fillStyle = (U.user.isAdmin ? 'rgba(255, 0, 0, .4)' : 'rgba(0, 0, 0, .4)');
		CTX.font = "bold 20pt Verdana";
		CTX.textAlign = "center";
		CTX.fillText(U.name, U.x, U.y + 30, 150);
		//bubble
		CTX.font = "normal 15pt Verdana";
		CTX.fillStyle = 'rgba(255, 255, 255, ' + U.bubble.alpha + ')';
		Width = CTX.measureText(U.bubble.txt).width + 15;
		CTX.fillRect(U.x - Width/2, U.y - Objects.character.height - 55, Width, 40);
		//message
		CTX.fillStyle = 'rgba(0, 0, 0, ' + U.bubble.alpha + ')';
		CTX.fillText(U.bubble.txt, U.x, U.y - Objects.character.height - 27);
	}
	else {
		LoadUsers();
	}
}
function DrawUsers() {
	Users.forEach(function(Item){
		CreateUser(Item);
	});
}
function GetLastOfType(l, t) {
	var i = 1;
	while(l-i >= 0) {
		if(RoomObjects[l-i].type == t) {
			return RoomObjects[l-i];
			break;
		}
		i++;
	}
	return null;
}
function DrawRoomObjects() {
	RoomObjects.forEach(function(Item){
		switch(Item.type) {
			case 'step':
				CTX.strokeStyle = Item.color;
				CTX.lineCap = 'round';
				CTX.lineWidth = 12;
				var LItem = GetLastOfType(RoomObjects.indexOf(Item), 'step');
				CTX.beginPath();
				if(LItem) 
					CTX.moveTo(LItem.x, LItem.y);
				else 
					CTX.moveTo(Item.x, Item.y);
				CTX.lineTo(Item.x, Item.y);
				CTX.stroke();
				break;
			case 'news':
				CTX.fillStyle = 'rgba(0, 0, 0, .6)';
				CTX.font = "bold 15pt Verdana";
				CTX.textAlign = "left";
				CTX.fillText(Item.content, Item.x, Item.y, 135);
				CTX.font = "bold 10pt Verdana";
				CTX.fillText(Item.who, Item.x + 50, Item.y + 119, 85);
				break;
		}
	});
}
function AddUser(e) {
	var U = e.user;
	//console.log(U);
	var D = {user: U, name: U.name, x: U.getVariable('x').value, y: U.getVariable('y').value, rotation: 0, bubble: {txt: '', alpha: 0}, body: null};
	if(SFS.lastJoinedRoom.name == 'Laboratory') {
		D.body = AddBody(D);
	}
	Users.push(D);
}
function RemoveUser(e) {
	if(e.room == SFS.lastJoinedRoom) {
		Users.splice(Users.indexOf(GetUserByName(e.user.name)), 1);
	}
}
function LoadUsers() {
	if(!SFS.lastJoinedRoom) return;
	Users.length = 0;
	var UserList = SFS.lastJoinedRoom.getUserList();
	//console.log('hi', UserList);
	UserList.sort(function (a, b) {
		if (a.getVariable('y').value > b.getVariable('y').value) {
			return 1;
		}
		if (a.getVariable('y').value < b.getVariable('y').value) {
			return -1;
		}
		return 0;
	});
	UserList.forEach(function(U, i, UserList){
		var D = {user: U, name: U.name, x: U.getVariable('x').value, y: U.getVariable('y').value, rotation: 0, bubble: {txt: '', alpha: 0}, body: null};
		Users.push(D);
		//console.log(D);
	});
	ResetBodies();
	//console.log(Users);
}
function ResetBodies() {
	for (var bb = world.GetBodyList(); bb; bb = bb.GetNext()) {
		world.DestroyBody(bb);
	}
	if(SFS.lastJoinedRoom.name == 'Laboratory') {
		Users.forEach(function(U){
			U.body = AddBody(U);
		});
		AddFloor();
	}
}
function Sort() {
	Users.sort(function (a, b) {
		if (a.y > b.y) {
			return 1;
		}
		if (a.y < b.y) {
			return -1;
		}
		return 0;
	});
}
function UpdUserVars(e) {
	if(!SFS.lastJoinedRoom) return;
	var U = GetUser(e.user);
	if(e.changedVars.indexOf('x') != -1 && e.changedVars.indexOf('y') != -1) {
		if(U) {
			U.user = e.user;
					
			if(SFS.lastJoinedRoom.name != 'Laboratory') {
				TweenLite.to(U, .7, {x: e.user.getVariable('x').value, y: e.user.getVariable('y').value, onComplete: Step, onCompleteParams: [U]});
			}
			else if(U.body) {
				//ResetBodies();
				U.body.SetPosition(new b2Vec2(e.user.getVariable('x').value, e.user.getVariable('y').value));
			}
		}
		else {
			LoadUsers();
		}
	}
}
function Msg(e) {
	if(!SFS.lastJoinedRoom) return;
	var U = GetUser(e.sender);
	if(U) {
		TweenLite.killTweensOf(U.bubble);
		U.bubble.txt = e.message;
		TweenLite.to(U.bubble, .3, {alpha: 1});
		TweenLite.to(U.bubble, .3, {delay: 5.3, alpha: 0});
	}
	if(SFS.lastJoinedRoom.name == 'Vorobey') {
		RoomObjects[0] = {type: 'news', x: 795, y: 295, who: U.name, content: e.message};
	}
	if(SFS.lastJoinedRoom.name == 'Paper') {
		RoomObjects.push({type: 'news', x: random(0, 850), y: random(0, 500), who: '', content: e.message});
	}
}
function random(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function GetUser(U) {
	var user;
	
	Users.forEach(function(Item) {
		if(Item.user == U) {
			user = Item;
		}
	});

	return user;
}
function GetUserByName(U) {
	var user;
	
	Users.forEach(function(Item) {
		if(Item.name == U) {
			user = Item;
		}
	});

	return user;
}
function LoadData() {
	$.each(LoadingData, function(Index, Item) {
		//console.log(Index, Item);
		
		Objects[Index] = new Image();
		Objects[Index].src = Item;
		
		Objects[Index].onload = function() {
			LoadProgress++;
			if(LoadProgress != Object.keys(LoadingData).length) {
				CurrentScreen = 'loading';
			}
			else {
				CurrentScreen = 'game';
			}
		}
	}); 
}

//wardrobe
function Edit() {
	$('.name').html(SFS.mySelf.name);
	$('.edit').attr('style', 'display: block');
	var Skin;
	if(SFS.mySelf.getVariable('WearType').value) {
		$('.skin').attr('checked', true);
		Skin = Avatars[Locations[SFS.lastJoinedRoom.name].avatarX/50];
	}
	else {
		Skin = Avatars[SFS.mySelf.getVariable('Skin').value];
	}
	if($('.selected').attr('class')) $('.selected').attr('class', $('.selected').attr('class').split(' selected')[0]);
	$('.' + Skin).attr('class', 'avatar ' + Skin + ' profile selected');
	$('#my').attr('class', 'avatar ' + Skin);
}
function CloseEdit() {
	$('.edit').removeAttr('style');
}
function SetWearType() {
	var Skin;
	if($('.selected').attr('class')) $('.selected').attr('class', $('.selected').attr('class').split(' selected')[0]);
	if($('.skin').attr('checked')) {
		Skin = Avatars[Locations[SFS.lastJoinedRoom.name].avatarX/50];
	}
	else {
		Skin = Avatars[SFS.mySelf.getVariable('Skin').value];
	}
	$('#my').attr('class', 'avatar ' + Skin);
	$('.' + Skin).attr('class', $('.' + Skin).attr('class') + ' profile selected');
	
	SFS.send(new SFS2X.ExtensionRequest('Profile.SetWearType'));
}
function SelectSkin(e) {
	if(SFS.mySelf.getVariable('WearType').value) {
		return;
	}
	if($('.selected').attr('class')) $('.selected').attr('class', $('.selected').attr('class').split(' selected')[0]);
	$('#my').attr('class', $(e).attr('class').split(' profile')[0]);
	$(e).attr('class', $(e).attr('class') + ' selected');
		
	var Data = new SFS2X.SFSObject();
	Data.putInt('Skin', Avatars.indexOf($(e).attr('class').split(' profile')[0].split('avatar ')[1].split(' selected')[0]));
	SFS.send(new SFS2X.ExtensionRequest('Profile.SetSkin', Data));
}
//skin creator
function OpenPage(num) {
	$('.page').removeAttr('style');
	$('.n' + String(num)).attr('style', 'display: block');
}