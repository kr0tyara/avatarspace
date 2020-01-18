function Login() {
	if($('input[name="name"]').val() == '' || $('input[name="pwd"]').val() == ''){
		return;
	}
	$('input[type="submit"]').attr('disabled', true);
    $.ajax({
    	url: 'server/Login.php',
		type: 'POST',
		crossDomain: true,
		data: {
			name: $('input[name="name"]').val(),
			pwd: $('input[name="pwd"]').val()
		}, 
        success: function(data) {
			$('input[type="submit"]').removeAttr('disabled');
			var answer = JSON.parse(data.trim());
    	    if(answer.success == '1') {
				location.reload();
    	    }
    	    else{
				alert(answer.msg);
    	    }
        }
	})
}
