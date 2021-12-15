
var user = [{
    	username: 135,
    	password: 160
    }, {
    	username: 320,
    	password: 155
    }, {
    	username: 518,
    	password: 163
    }, {
    	username: 102,
    	password: 249
    }, {
    	username: 324,
    	password: 249
    }, {
    	username: 522,
    	password: 247
    }, {
    	username: 98,
    	password: 347
    }, {
    	username: 325,
    	password: 325
    }, {
    	username: 123,
    	password: 123
    }];


function login(){
	
	let username = $('#username').val();
	let password = $('#password').val();
	for(let i = 0 ; i< user.length;i++){
		if(username == user[i].username && password == user[i].password){
			alert("登录成功");
			$('#login').css("display","none")
			$('#choose').css("display","")
			break;
			
		}
		if(i==user.length-1) {alert("账号或密码错误！"); break;}
		
	}
	
}

function commonGame(){
	
	if($('#btn-choose-common').val()==' 经典模式 '){
		alert("您选择了：经典模式");
		window.location.href = "./commonGameType.html";
	}else if($('#btn-choose-common').val()==' 综合素质题库 '){
		alert("您选择了：综合素质题库");
		window.location.href="./answerGameOne.html";
	}
	
	
}


function answerGame(){
	
	if($('#btn-choose-answer').val()==' 答题模式 '){
		alert("请选择题库信息");
		$('#btn-choose-answer').val(' 教综题库 ');
		$('#btn-choose-common').css("left","35%")
		$('#btn-choose-answer').css("left","62%")
		$('#btn-choose-common').val(' 综合素质题库 ');
	}else if($('#btn-choose-answer').val()==' 教综题库 '){
		alert("您选择了：教综题库");
		window.location.href="./answerGameTwo.html";
	}
	
}

function wujinGame(){
	
	window.location.href="EndlessGame.html"
	
}