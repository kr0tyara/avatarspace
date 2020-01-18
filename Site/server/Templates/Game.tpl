<html>
	<head>
		<title>Avatar.Space</title>
		<link rel="stylesheet" href="css/Game.css?v{$Ver}" />
		<link rel="stylesheet" href="css/themify-icons/themify-icons.css?v{$Ver}" />
		<link href="https://fonts.googleapis.com/css?family=Oswald|Russo+One&display=swap" rel="stylesheet">


		<script type="text/javascript" src="js/JQuery.js?v{$Ver}"></script>
		{if $IsLoggedIn == 1}
			<script type="text/javascript" src="js/TweenLite.js?v{$Ver}"></script>
			<script type="text/javascript" src="js/SmartFox.js?v{$Ver}"></script>
			<script type="text/javascript" src="js/Box2D.js?v{$Ver}"></script>
			<script type="text/javascript" src="js/Physics.js?v{$Ver}"></script>
			<script type="text/javascript" src="js/Game.js?v{$Ver}"></script>
		{else}
			<script type="text/javascript" src="js/Site.js?v{$Ver}"></script>
		{/if}
	</head>
	<body>
		<content>
			{if $IsLoggedIn == 1}
				<div class="edit">
					<div class="left">
						<h2 class="name">%user_name%</h2>
						<div class="page n1" style="display: block">
							<div id="my" class="avatar"></div><br/>
						</div>
					</div>
					<div class="right">
						<div class="page n1" style="display: block">
							<h2>Скины</h2>
							<h3>Стандартные</h3>
							<div class="avatar vorobey profile" onclick="SelectSkin(this)"></div>
							<div class="avatar sandbox profile" onclick="SelectSkin(this)"></div>
							<div class="avatar laboratory profile" onclick="SelectSkin(this)"></div>
							<div class="avatar lobby profile" onclick="SelectSkin(this)"></div>
							<div class="avatar paper profile" onclick="SelectSkin(this)"></div><br/>
							<input id="check" type="checkbox" class="skin" onclick="SetWearType()"></input>
							<label for="check">Изменять скин при входе на локацию</label>
						</div>
					</div>
					<div class="close" onclick="CloseEdit()">
						<p>X</p>
					</div>
				</div>
				<div class="up">
					<div class="location">
						<p><span class="ti-map"></span> <b class="lname">%location_name%</b></p>
					</div>
					<div class="editor" onclick="Edit()">
						<p><span class="ti-pencil"></span></p>
					</div>
				</div>
				<canvas width="1000" height="650" class="game"></canvas>
				<div class="panel">
					<form action="javascript:Send();">
						<input type="text" name="txt" maxlength="50"></input>
						<input type="submit" value=">>"></input>
					</form>
				</div>
			{else}
				<div class="login">
					<form action="javascript:Login()">
						<h2>Вход</h2>
						<input type="text" name="name" placeholder="Логин" maxlength="15"></input>
						<input type="password" name="pwd" placeholder="Пароль" maxlength="32"></input>
						<input type="submit" value="Войти"></input>
						<br/><br/>
						<p>Если у вас нет аккаунта, он будет автоматически зарегистрирован.</p>
					</form>
				</div>
			{/if}
		</content>
	</body>
</html>