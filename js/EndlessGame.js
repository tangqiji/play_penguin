// 获取元素 ,设置全局变量
var _ground = document.getElementById("_ground");
var Mask = []; // 存储mask遮罩
var Mouse = []; // 存储老鼠
var score = 0;
var scoreSum = 0;
var disappearTime = 1000;//默认1000毫秒
// var life = 10;
var gemeTimer = null;
var backMusicTimer = setInterval(function() {
	playbackMusic(false);
}, 1000);
var gamePass = 1;//默认是第一关
var gamePassScore = 300;  //默认第一关600分即通过   测试修改下数据 便于观看
// var deadlineSore = 0;
var addMouseNumTime = 10;
var doubleScoreTime = 10;
var doubleScoreTimer = null;
var reduceMouseNumTime = 10;
var addMouseNumTimer = null;
var reduceMouseNumTimer = null;
var totalTimer = null;
var totalTime = 60; //一分钟倒计时
var maxMouseCount = 2; //初始时，老鼠出现的个数不超过2个
// var coordinate = [{
// 	x: 135,
// 	y: 160
// }, {
// 	x: 320,
// 	y: 155
// }, {
// 	x: 518,
// 	y: 163
// }, {
// 	x: 102,
// 	y: 249
// }, {
// 	x: 324,
// 	y: 249
// }, {
// 	x: 522,
// 	y: 247
// }, {
// 	x: 98,
// 	y: 347
// }, {
// 	x: 325,
// 	y: 352
// }, {
// 	x: 543,
// 	y: 352
// }]; //洞口坐标

var coordinate = [{
	x: 65,
	y: 118
}, {
	x: 221,
	y: 118
}, {
	x: 387,
	y: 118
}, {
	x: 556,
	y: 118
},{
	x: 65,
	y: 231
}, {
	x: 221,
	y: 231
}, {
	x: 387,
	y: 231
}, {
	x: 556,
	y: 231
},{
	x: 65,
	y: 345
}, {
	x: 221,
	y: 345
}, {
	x: 387,
	y: 345
}, {
	x: 556,
	y: 345
},{
	x: 65,
	y: 460
}, {
	x: 221,
	y: 460
}, {
	x: 387,
	y: 460
}, {
	x: 556,
	y: 460
}]; //洞口坐标

/*
    1:鼠标按下ground,鼠标锤子改变，鼠标弹起锤子恢复
    2:创建洞穴和遮罩
    3:创建老鼠 
    4:老鼠出现
    5:老鼠消失 -> 1: 不敲打自己消失 2: 敲打盒子消失
*/

// 1:鼠标点击ground,鼠标锤子改变
_ground.onmousedown = function() {
	// _ground.style.cursor = "url('images/hammer2.png'),auto";
	// _ground.style.cursor = "url('images/hammer2.png'),auto";
	 _ground.style.cursor = "url('images/2bang1.png'),auto";
}
_ground.onmouseup = function() {
	// _ground.style.cursor = "url('images/hammer.png'),auto";
	_ground.style.cursor = "url('images/2bang.png'),auto";
}
// 初始化函数  
init();
// 2:创建洞穴和遮罩
function createMask() {
	for (var i = 0; i < coordinate.length; i++) {
		var mask = document.createElement("div");
		mask.className = "mask";
		mask.style.left = coordinate[i].x + "px";
		mask.style.top = coordinate[i].y + "px";
		mask.index = i;
		var maskimg = document.createElement("div");
		maskimg.className = "mask";
		maskimg.style.zIndex = i * 2 + 1; // 遮罩的层级大于老鼠的层级，并且保证上一层的遮罩层级不能大于下一层老鼠的层级，否则会遮住老鼠的头部 
		// maskimg.style.backgroundImage = "url('images/mask-0"+i+".png')";
		mask.appendChild(maskimg); // 添加遮罩层
		Mask[i] = mask;
		_ground.appendChild(mask); // 添加洞穴
		mask.onclick = function() {
			onclickMusic();
			disappear(this.index, true); // （被敲打的mask的index,被敲打）
		}
	}
}

function typeUntil(){
	var propUtil = Math.random()*10;
	// var picnum = Math.floor(Math.random() * 5); // 从0-4产生一个随机数
	if(propUtil<=6){
		return 0;
	}else if(propUtil<=7){
		if(addMouseNumTimer==null && reduceMouseNumTimer==null){
			return 1;
		}else{
			return 0;
		}
		
	}else if(propUtil<=8){
		if(addMouseNumTimer==null && reduceMouseNumTimer==null){
			return 2;
		}else{
			return 0;
		}
	}else if(propUtil<=9){
		if(totalTime>=10){
			return 0;
		}else{
			return 3;
		}
	}else if(propUtil<=10){
		if(doubleScoreTimer==null){
			return 4;
		}else{
			return 0;
		}
	}
}

//3: 创建老鼠
function createMouse(i) {
	// 随机选择老鼠
	
	var picnum=null;
	if(gamePass==1){
		picnum = 0;
	}else{
		picnum = typeUntil();
	}
	var mouse = document.createElement("div");
	mouse.className = "mouse";
	mouse.num = picnum;
	mouse.style.zIndex = i * 2;
	/*
		1-----吸引地鼠   10s内地鼠数量变为2倍
		2-----   10s内地鼠数量变为一半
		3-----   时间变成原来时间的2倍
		4-----   双倍分数
	
	*/
	mouse.style.backgroundImage = "url('images/2" + picnum + ".png')";
	// mouse.style.backgroundImage = "url('images/mouse_normal_0.png')";
	Mouse[i] = mouse; // 向老鼠数组里面添加老鼠
	Mask[i].appendChild(mouse); // 向洞穴里面添加老鼠
	var gameTypeAtt = document.createAttribute("gameType"); //创建属性
	gameTypeAtt.value = picnum; //设置属性值
	mouse.setAttributeNode(gameTypeAtt);
	// 每个老鼠都有一个消失的定时器
	var timer = setTimeout(function() {
		disappear(i, false);
	}, disappearTime);
	mouse.timer = timer;

}
// 4: 老鼠出现
function genarateMouse() {
	var num = Math.floor(Math.random() * coordinate.length); // 随机产生一个洞穴位置
	if (Mouse.filter(function(item) {
			return item;
		}).length < maxMouseCount && Mouse[num] == null) {
		createMouse(num);

	}

}

// 5: 老鼠消失  --> 1: 老鼠自动消失 2： 老鼠在被敲打之后消失
function disappear(index, isHit) { // isHit是否被敲打，布尔值
	if (Mouse[index] != null) {
		Mouse[index].style.top = "70px";
		Mouse[index].style.transition = "top 0.5s";
		
		/*
			1-----吸引地鼠   10s内地鼠数量变为2倍
			2-----   10s内地鼠数量变为一半
			3-----   时间变成原来时间的2倍
			4-----   双倍分数
		
		*/
		
		if (isHit) // 如果被敲打
		{	
			if(Mouse[index].getAttribute("gameType")==0){
				clearInterval(Mouse[index].timer);
				
				if(doubleScoreTimer==null){
					scoreSum+=10;
				}else{
					scoreSum+=20;
				}
			}else if(Mouse[index].getAttribute("gameType")==1){
				addMouseNum();
				clearInterval(Mouse[index].timer);
			}else if(Mouse[index].getAttribute("gameType")==2){
				reduceMouseNum();
				clearInterval(Mouse[index].timer);
			}else if(Mouse[index].getAttribute("gameType")==3){
				totalTime = totalTime+10;
				clearInterval(Mouse[index].timer);
			}else if(Mouse[index].getAttribute("gameType")==4){
				doubleScoreStart();
				clearInterval(Mouse[index].timer);
			}
			 // 清除老鼠本身的定时器
		} else {
			
		}
		setTimeout(function() {
			if (Mouse[index]) {
				Mask[index].removeChild(Mouse[index]);
			}
			Mouse[index] = null;
		}, 500);
	}else{
		
	}
}

function init() {
	var gamePassOne = document.getElementById('gamePassOne');
	gamePassOne.innerHTML = gamePass;   
	var gamePassTwo = document.getElementById('gamePassTwo');
	gamePassScore = gamePassScore*2;
	gamePassTwo.innerHTML = gamePassScore;
	createMask();
	totalTimer = setInterval(function() {
		document.getElementsByClassName("countdown")[0].getElementsByTagName("span")[0].innerHTML = "倒计时：" + (--totalTime) +
			" 秒";
	}, 1000);
	gameTimer = setInterval(function() {
		genarateMouse();
		if (totalTime <= 0) {
			clearInterval(gameTimer);
			clearInterval(backMusicTimer);
			clearInterval(totalTimer);
			
			gameTimer = null;
			backMusicTimer = null;
			totalTimer = null;
			playbackMusic(true);
			okMusic();
			informMusic();
			gamePassJudge(gamePass);
		}
		// document.getElementsByClassName("score")[0].getElementsByTagName("span")[0].innerHTML = score;
		document.getElementsByClassName("score")[0].getElementsByTagName("span")[0].innerHTML = scoreSum;
		if(addMouseNumTimer!=null && addMouseNumTime<=0){
			console.log("++++前"+maxMouseCount);
			clearInterval(addMouseNumTimer);
			addMouseNumTimer=null;
			maxMouseCount = maxMouseCount/2;
			console.log("++++后"+maxMouseCount);
		}
		if(reduceMouseNumTimer!=null && reduceMouseNumTime<=0){
			console.log("----前"+maxMouseCount);
			disappearTime = 1000;
			clearInterval(reduceMouseNumTimer);
			reduceMouseNumTimer =null;
			maxMouseCount = maxMouseCount*2;
			console.log("----后"+maxMouseCount);
		}
		if(doubleScoreTimer!=null && doubleScoreTime<=0){
			console.log("双倍分数前");
			clearInterval(doubleScoreTimer);
			doubleScoreTimer =null;
			console.log("----后");
		}
		// maxMouseCount = score / 50 + 1; // 分数每增加到100, 允许老鼠出现的数目加1
	}, 500);

}

function gamePassJudge(gamePassNum){
		// scoreSum = score+scoreSum;
	if(scoreSum>=gamePassScore){
		alert("恭喜你已经通过第"+gamePassNum+"关\n目前为止，您的所有关卡得分是"+scoreSum+"\n请继续开始下一关卡");
		recoverGame();
		init();
	}else{
		if(gamePassNum==1){
			alert("游戏结束，你已经通过"+(gamePassNum)+"关\n您的所有关卡得分是" + scoreSum);
		}else{
			alert("游戏结束，你已经通过"+(gamePassNum-1)+"关\n您的所有关卡得分是" + scoreSum);
		}
		window.location.href = "commonGameType.html";
	}
	
}

function playbackMusic(bool) {
	var player = $("#player")[0]; /*jquery对象转换成js对象*/
	if (player.paused) { /*如果已经暂停*/
		player.play(); /*播放*/
	}
	if (bool) {
		player.pause();
	}
}

function onclickMusic() {
	var playeronclickMusic = $("#clickMusic")[0]; /*jquery对象转换成js对象*/
	if (playeronclickMusic.paused) { /*如果已经暂停*/
		playeronclickMusic.play(); /*播放*/
	}
}

function okMusic() {
	var playerokMusic = $("#okMusic")[0]; /*jquery对象转换成js对象*/
	if (playerokMusic.paused) { /*如果已经暂停*/
		playerokMusic.play(); /*播放*/
	}
}

function informMusic() {
	var playerinformMusic = $("#informMusic")[0]; /*jquery对象转换成js对象*/
	if (playerinformMusic.paused) { /*如果已经暂停*/
		playerinformMusic.play(); /*播放*/
	}
}


function addMouseNum() {
	addMouseNumTime = 10;//默认10s
	maxMouseCount = maxMouseCount*2;
	addMouseNumTimer = setInterval(function(){
		addMouseNumTime--;
		console.log("+++++"+addMouseNumTime);
		console.log(maxMouseCount);
	},1000);
}

function doubleScoreStart() {
	doubleScoreTime = 10;//默认10s
	doubleScoreTimer = setInterval(function(){
		doubleScoreTime--;
		console.log("双倍得分"+doubleScoreTime);
	},1000);
}

function reduceMouseNum() {
	reduceMouseNumTime = 10;//默认10s
	disappearTime = 1500;
	if(maxMouseCount%2==0){
		maxMouseCount = maxMouseCount/2;
	}else{
		maxMouseCount = (maxMouseCount+1)/2;
	}
	reduceMouseNumTimer = setInterval(function(){
		reduceMouseNumTime--;
		console.log("----"+reduceMouseNumTime);
		console.log(maxMouseCount);
	},1000);
	
}
function recoverGame(){
	for (var i = 0; i < coordinate.length; i++){
		if (Mouse[i]) {
			Mouse[i].style.top = "70px";
			Mouse[i].style.transition = "top 0.5s";
			Mask[i].removeChild(Mouse[i]);
			clearInterval(Mouse[i].timer);
			Mouse[i] = null;
		}
	}
	clearInterval(addMouseNumTimer);
	clearInterval(reduceMouseNumTimer);
	addMouseNumTimer=null;
	reduceMouseNumTimer =null;
	gamePass++;
	// alert(gamePass)
	Mask = []; // 存储mask遮罩
	Mouse = []; // 存储老鼠
	score = 0;
	backMusicTimer = setInterval(function() {
		playbackMusic(false);
	}, 1000);
	addMouseNumTime = 10;
	reduceMouseNumTime = 10;
	doubleScoreTime = 10;
	addMouseNumTimer = null;
	reduceMouseNumTimer = null;
	doubleScoreTimer = null;
	totalTime = 60; //一分钟倒计时
	maxMouseCount = 2; //初始时，老鼠出现的个数不超过2个
}