<?
	include_once($_SERVER['DOCUMENT_ROOT'].'/Server/Connect.php');
	
	$answer;
	if(isset($_POST['name']) && isset($_POST['pwd'])){
		if(mb_strlen($_POST['name'], 'UTF-8') > 15 || mb_strlen($_POST['pwd'], 'UTF-8') > 32){
			$answer = array('success' => 0, 'msg' => $Locale['errors'][2]);
		}
		else{
			$query = $pdo->prepare('SELECT * FROM user WHERE name=? && pass=PASSWORD(?);');
			$query->execute(array($_POST['name'], $_POST['pwd']));
			$ans = $query->fetch();
			if($ans[0]) {
				$_SESSION['id'] = $ans[0];
				$token = md5(uniqid().$ans[0].$ans[2].uniqid());
				
				$query = $pdo->prepare('UPDATE user SET token=? WHERE id=?;');
				$query->execute(array($token, $ans[0]));
			
				$answer = array('success' => 1);
			}
			else {
				$query = $pdo->prepare('SELECT * FROM user WHERE name=?;');
				$query->execute(array($_POST['name']));
				$ans = $query->fetch();
				if(!$ans[0]) {
					$query = $pdo->prepare("INSERT INTO `user` (`name`, `pass`, `permission`, `token`, `ip`) VALUES (?, PASSWORD(?), '0', '', ?);");
					$query->execute(array($_POST['name'], $_POST['pwd'], $_SERVER['REMOTE_ADDR']));
					
					$query = $pdo->prepare('SELECT * FROM user WHERE name=? && pass=PASSWORD(?);');
					$query->execute(array($_POST['name'], $_POST['pwd']));
					$ans = $query->fetch();
							
					$_SESSION['id'] = $ans[0];
					$token = md5(uniqid().$ans[0].$ans[2].uniqid());
					
					$query = $pdo->prepare('UPDATE user SET token=? WHERE id=?;');
					$query->execute(array($token, $ans[0]));
				
					$answer = array('success' => 1);
				}
				else {
					$answer = array('success' => 0, 'msg' => 'Неверный пароль');
				}
			}
		}
	}
	else{
		$answer = array('success' => 0, 'msg' => 'Чё надо');
	}
	echo json_encode($answer);
?>