<?
	include_once($_SERVER['DOCUMENT_ROOT'].'/server/Connect.php');
	require_once($_SERVER['DOCUMENT_ROOT'].'/server/Smarty/Smarty.class.php');
	
	$Smarty = new Smarty();
	
	$IsLoggedIn = 0;
	
	$Me = $pdo->prepare('SELECT * FROM user WHERE id=?;');
	$Me->execute(array($_SESSION['id']));
	$Myself = $Me->fetch();

	if($Myself[0]) {
		$IsLoggedIn = 1;
	}
	
	$Smarty->assign('IsLoggedIn', $IsLoggedIn);
	$Smarty->assign('Ver', uniqid());

	$Smarty->display('game.tpl');
?>