<?
	include_once($_SERVER['DOCUMENT_ROOT'].'/Server/Connect.php');
	
	$answer;
	if(isset($_SESSION['id']) && isset($_POST['game'])){
		$query = $pdo->prepare('SELECT * FROM user WHERE id=?;');
		$query->execute(array($_SESSION['id']));
		$ans = $query->fetch();
		
		if($ans[0]) {
			$answer = array('success' => 1, 'name' => $ans[1], 'token' => $ans[4]);
		}
		else {
			$answer = array('success' => 0);
		}
	}
	else{
		$answer = array('success' => 0);
	}
	echo json_encode($answer);
?>