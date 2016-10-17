/**
 * Created by my on 2016/10/5.
 */
$(".row p").click(function () {
    if($(".row ul li").css("display") === "none"){
        $(".row ul li").css("display","block");
        $(this).children("span").css("transform", "rotate(-90deg)")
    }else {
        $(".row ul li").css("display","none");
        $(this).children("span").css("transform", "rotate(180deg)")
    }
});
showAllClass();
function showAllClass(){
    $.ajax({
        type:"get",
        url:"https://datainfo.duapp.com/shopdata/getclass.php",
        dataType:"JSON",
        success: function (data) {
            //console.log(data);
            var len = data.length;
            for(var i=0;i<len;i++){
                var str = '<li><a href="{{href}}">{{goodName}}<span class="iconfont">&#xe619;</span></a></li>';
                str = str.replace("{{goodName}}",data[i].className)
                    .replace("{{href}}","newGoods.html?classID="+data[i].classID);
                $(".row ul").append(str);
            }
            console.log(data)
        },
        error:function(XMLHttpRequest,textStatus,errorThrown){
            console.log("errorThrown:"+errorThrown);
        }
    })
}