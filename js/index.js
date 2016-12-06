var app=angular.module('reminder',[]);
app.controller('mainCtrl',['$scope',function($scope){
	$scope.color=['red','orange','yellow','green','brown','blue','purple'];
	$scope.cu=0;
	//	检查本地存储中是否有reminder，如果有就将数据转换为我们认识的数组并放在$scope.lists数组当中
	if(localStorage.reminder){
		$scope.lists=JSON.parse(localStorage.reminder);
	}else{
		$scope.lists=[
				{
					id:1002,
					name:'选项',
					theme:'blue',
					todos: [
						{name:'三国',state:1},
						{name:'水浒',state:0}
					]
				}
		];
	}
	
//  获取lists数组当中的最大的那个id，并将max返回
	function maxId(){
		var max=-Infinity;
		for(var i=0;i<$scope.lists.length;i++){
			var v=$scope.lists[i];
			if(v.id>max){
				max=v.id;
			}
		}
		return (max === -Infinity) ? 1001 : max;
	}
	//	将lists数据当中的数据存转换为localStorage认识的字符串格式并存储到localStorage当中
	$scope.save2local=function(){
		localStorage.reminder=JSON.stringify($scope.lists);
	}
	$scope.delete=function(){
		$scope.lists.splice($scope.cu,1);
	}
	//	选项里边的取消与完成函数
	$scope.cancel=function(){
		var view=$(".view");
		view.hide();
	}
	//	计算已完成的数量
	$scope.count=function(){
		var r=0;
		$scope.lists[$scope.cu].todos.forEach(function(v,i){
			if(v.state===1){
				r++;
			}
		});
		return r;
	
	}
	//计算未完成的数量
	$scope.count2=function(){
		var r=0;
		$scope.lists[$scope.cu].todos.forEach(function(v,i){
			if(v.state===0){
				r++;
			}
		});
		return r;
	}
	//动画的效果
//	$scope.animate=function(){
//		$('.nei').addClass('animate');
//	}
	//三角
	$scope.dian=function(){
		$('.list-left').toggleClass("list-block2");
		$('.listss').toggleClass('lists-none');
	}
	$scope.dian2=function(){
		$('.list-left2').toggleClass("list-block");
		$('.nei').toggleClass('nei-none');
	}
	
	//注销
	$scope.xianshi=function(){
		$('.hide').toggleClass('xians');
	}
	//清除已完成
	$scope.clear=function(){
		var newarr=[];
		$scope.lists[$scope.cu].todos.forEach(function(v,i){
			if(v.state===0){
				newarr.push(v);
			}
		});
		$scope.lists[$scope.cu].todos=newarr;
	}
	
	//	添加列表，向数组中push一条数据
	$scope.addList=function(){
		var leng=$scope.lists.length;
		var index=leng % 7;
		var max=maxId();
		var v={
			id:max+1,
			name:'新列表'+(leng+1),
			theme:$scope.color[index],
			todos:[]
			
			
		};
		$scope.lists.push(v);
		
	}
}]);
//选项的点击出现和消失和颜色的挑选
app.directive("myButton",[function(){
	return {
		restrict:"A",
		replace:true,
		transclude:true,
		template:"<div class='small-select {{lists[cu].theme}}'>选项<div ng-transclude></div></div>",
		link:function($scope,el){
			$(el).on("click",function(){
				$(".view").toggle();
				return false;
			})
			$(".view").on("click",false)
			$(document).on("click",function(){
				$(".view").hide();
			})
		}
	}
}]);
//点击新项目添加新项目
app.directive("block",[function(){
			return{
				restrict:"AE",
				template:'<div class="add"><input type="text" placeholder="新项目..."  disabled/></div>',
				replace:true,
				link:function($scope,el){
					var obj=$(".linetiao");
					$(el).on("click",function(){
						obj.css("display","block");
						$(".linetiao input").focus()
						return false;
					})
					obj.on("click",false)
					$(document).on("click",function(){
						obj.css("display","none");
					})
					
				}
				
			}
			
			
		}])
//列表循环的自定义指令
app.directive('myUl',[function(){
	return{
		restrict:'A',
		replace:true,
		template:'<ul class="select"><div ng-transclude></div></ul>',
		transclude:true,
		link:function($scope,el){
			$(el).on('keyup','input',false)
			$(el).on('click','li',function(){
				$(el).find('li').removeClass('active');
				$(this).addClass('active');
				var self=this;
				$scope.$apply(function(){
					$scope.cu=$(self).index();
				})
			});
			//当键盘上的删除键按下时执行的函数
			$(document).on('keyup',function(e){
				if(e.keyCode === 8){
					var index = $('.active').index();
					if(index==-1){
						return;
					}
					$scope.$apply(function(){
						$scope.lists.splice(index,1)
						$scope.save2local();
					})
					
				}
			})
			$('plan')
		}
	}
}])




