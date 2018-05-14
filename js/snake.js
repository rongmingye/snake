$(function(){
	var snake = [ [0,3], [0,2], [0,1], [0,0] ];
	var timer = null; // 定时器
	var changeState = "right"; // 当前前进方向
	var oldState = "right"; // 上一前进方向

	var eggRow, eggCol; //鸡蛋的行列
	var knock = false;  // 是否碰到鸡蛋
	var speed = 200; // 蛇的行走速度
	var endAlert = 150; // 结束后多久提示结束
	var theEnd = false;  // 确定是否结束 false/true

// -------------------------------   控件 --------------------------------
	// 控制
	$("#stopId").click(function(e){
		if(!theEnd){
			clearInterval(timer);
		}
	});
	$("#startId").click(function(e){
		if(!theEnd){
			timer = setInterval(changeItem, speed);
		}
	});
	$("#freshId").click(function(e){
		theEnd = false;
		clearInterval(timer);
		snake = [ [0,3], [0,2], [0,1], [0,0] ];
		snakeDody();
		$(".row:eq("+ eggRow +") > .col").eq(eggCol).removeClass("egg");
		randomEgg();
		changeState = "right"; // 当前前进方向
		oldState = "right"; // 上一前进方向
		$("#sum").text(0);
	});
	$("#speedId").click(function(e){
		addSpeed();
	})
	// 加速度
	function addSpeed(){
		if(speed>100){
			speed = parseInt(speed - 5);
			var bar = parseInt( (1 - speed/200)*200) + "%";
			console.log(bar);
			$(".line-bar").css("width", bar );
		}
	}		

//  ----------------------------------------- 地图 -----------------------
	//  画地图
	$(".map").css("height", $(".map").css("width") );
	var col = "<sapn class='col'></sapn>";
	var row = "<div class='row'></div>";
	var rowNum = Math.floor($(".map").css("width").replace("px", "") / 20);
	var colNum = Math.floor($(".map").css("height").replace("px", "") / 20);
	

	// $(".map").css('width', rowNum*20+"px");
	// $(".map").css('height', colNum*20+"px");
	
	for(var i=0; i< rowNum; i++){
		$('.map').html( $('.map').html()+row );
		for(var j=0; j< colNum; j++){
			$('.row').eq(i).html( $('.row').eq(i).html()+col )
		}
	}

	// egg随机
	randomEgg();
	function randomEgg(){
		eggRow = Math.ceil( Math.random() * (rowNum-2)) + 1;
		eggCol = Math.ceil( Math.random() * (colNum-2) + 1);

		//  如果等于蛇的身体则重新获取egg
		snake.map(function(item, i){
			if(item[0] == eggRow && item[1] == eggCol){
				randomEgg();
				return null;
			}
		})
		$(".row:eq("+ eggRow +") > .col").eq(eggCol).addClass("egg");
	}

	// 蛇的身体
	snakeDody();
	function snakeDody(){
		$(".col").removeClass("activeCol").removeClass("activeTou");
		snake.map(function(item, i){
			if(i==0)
				$(".row:eq("+ item[0]+") > .col").eq(item[1]).addClass("activeTou");
			else
			    $(".row:eq("+ item[0]+") > .col").eq(item[1]).addClass("activeCol");
		})
	}

//  --------------------------------  按键处理 --------------------------------
	// 当按键按下
	onkeyHandle();
	function onkeyHandle(){
		document.onkeydown = function(e){
			if(!theEnd){ // 结束后不能再执行按键动作
				e = window.event || e;
				oldState = changeState;
				switch(e.keyCode){
				    case 37: //左键
					    if(oldState != "right" && oldState != "left"){
					     	changeState = "left";
					     	clearInterval(timer);
					     	changeItem();
					     	if(!theEnd) timer = setInterval(changeItem, speed);
					    }
					    break;
				    case 38: //向上键
				       	if(oldState != "bottom" && oldState != "top"){
				       		changeState = "top";
				       		clearInterval(timer);
					     	changeItem();
					     	if(!theEnd) timer = setInterval(changeItem, speed);

				       	}
				      	break;
				    case 39: //右键
				      	if(oldState !="left" && oldState != "right"){
				       		changeState = "right";
				       		clearInterval(timer);
					     	changeItem();
					     	if(!theEnd) timer = setInterval(changeItem, speed);
				       	}
				      break;
				    case 40: //向下键
				      	if(oldState != "top" && oldState != "bottom"){
				      		changeState = "bottom" ;
				      		clearInterval(timer);
					     	changeItem();
					     	if(!theEnd) timer = setInterval(changeItem, speed);
				      	}
				      break;
				    default:
				      break;
				}
			}		
		}
	}

	// 蛇运动处理函数
	var lastElem = [];  //上一个的蛇元素的数组位置
	var curElemRow; // 当前蛇元素的数组的row
	var curElemCol; // 当前蛇元素的数组的col
	function changeItem(){

		// 前进一个， 第一个元素根据按键的方向加一， 其他下一个获取上一个元素的位置
		snake = snake.map(function(item, i){
			curElemRow = item[0]; 
			curElemCol = item[1];
			if(i == 0){ // 如果是第一个元素(蛇头)
				if(changeState == "right") item[1]++;
				else if(changeState == "left") item[1]--;
				else if(changeState == "top") item[0]--;
				else if(changeState == "bottom") item[0]++;
			}else {  // 不是第一个元素的， 就获取上一个元素的位置, 先保存上一个元素的位置在一个变量lastElem
				item = lastElem;
			}
			lastElem = [curElemRow, curElemCol];

			// 碰到鸡蛋
			if( snake[0][0] == eggRow && snake[0][1] == eggCol){
				knock = true;
			}	
			return item;
		});

		// 五种结束游戏， 上下左右和碰到自己的身体
		// 往右
		if(changeState == "right"){
			if(snake[0][1] > colNum-1)
				 theEnd = true;
		}
		// 往左
		else if(changeState == "left"){
			if(snake[0][1] < 0)
				theEnd = true;
		}
		// 往上
		else if(changeState == "top"){
			if(snake[0][0] < 0)
				theEnd = true;
		}
		// 往下
		else if(changeState == "bottom"){
			if(snake[0][0] > rowNum-1 )
				theEnd = true;
		}

		// 是否碰到自己的身体
		snake.map(function(item, i){
			if(i!=0){
				if(snake[0][0] == item[0] && snake[0][1] == item[1])
					theEnd = true;
			}
		});

		// 如果上下左右碰到边界，和碰到自己的身体， 则接收游戏
		if(theEnd){
			clearInterval(timer);
			setTimeout(function(){
				alert("游戏结束");
			}, endAlert);
			return null;
		}

		// 碰到鸡蛋， 重新放鸡蛋
		if(knock == true){
			knock = false;
			$(".row:eq("+ eggRow +") > .col").eq(eggCol).removeClass("egg");
			randomEgg();
			$("#sum").text(parseInt($("#sum").text())+10);
			snake.push(lastElem);
			addSpeed();
		}

		// 根据snake重新渲染蛇的身体
		snakeDody();
	}


	// 当按键按下
	onkeyHandleModlie();
	function onkeyHandleModlie(){
		if(!theEnd){
			$("#goTop").click(function(){
				oldState = changeState;
				if(oldState != "bottom" && oldState != "top"){
		       		changeState = "top";
		       		clearInterval(timer);
			     	changeItem();
			     	if(!theEnd) timer = setInterval(changeItem, speed);

		       	}
			});
			$("#goBottom").click(function(){
				oldState = changeState;
				if(oldState != "top" && oldState != "bottom"){
		      		changeState = "bottom" ;
		      		clearInterval(timer);
			     	changeItem();
			     	if(!theEnd) timer = setInterval(changeItem, speed);
		      	}
			});
			$("#goLeft").click(function(){
				oldState = changeState;
				if(oldState != "right" && oldState != "left"){
				     	changeState = "left";
				     	clearInterval(timer);
				     	changeItem();
				     	if(!theEnd) timer = setInterval(changeItem, speed);
				}
			});
			$("#goRight").click(function(){
				oldState = changeState;
				if(oldState != "right" && oldState != "left"){
					     	changeState = "right";
					     	clearInterval(timer);
					     	changeItem();
					     	if(!theEnd) timer = setInterval(changeItem, speed);
				}
			});

		}
	}
		
});