/**
 * Created by my on 2016/10/4.
 */
var userID = localStorage.userID;
if(userID){
    loadGood(userID);
}
function loadGood(userID){
    $.ajax({
        type:"get",
        url:"https://datainfo.duapp.com/shopdata/getCar.php",
        data:{
            userID:userID
        },
        dataType:"JSONP",
        success: function (data) {
            console.log(data);
            var strEmpty = $(".empty").html();
            if(data != 0){
                $(".empty").html("").removeClass("empty");
                var len = data.length;
                var allNumber = 0,totalPrice = 0;
                for (var i = 0; i < len; i++) {
                    var tplStr = $("#tmp").html();
                    var tmpStr = $("#tmpOne").html();
                    allNumber += parseFloat(data[i].number);
                    totalPrice += parseFloat(data[i].price*data[i].number);
                    tplStr = tplStr.replace("{{src}}", data[i].goodsListImg)
                        .replace("{{href}}", "detail.html?goodsID="+data[i].goodsID)
                        .replace("{{txt}}", data[i].goodsName)
                        .replace("{{price}}", data[i].price)
                        .replace("{{num}}",data[i].number)
                        .replace("{{allNum}}", allNumber);
                    $("section").append(tplStr);
                }
                tmpStr = tmpStr.replace("{{allNum}}",allNumber)
                    .replace("{{total}}",totalPrice);
                $("section").prepend(tmpStr);
                clickButton();
            }else {
                $(".empty").html(strEmpty).addClass("empty");
            }
        },
        error:function(XMLHttpRequest,textStatus,errorThrown){
            console.log("errorThrown:"+errorThrown);
        }
    });
}
function clickButton(){
    $(".add").click(function () {
        var num = $(this).prev().val();
        $(this).prev().val(++num);
        var url = $(this).parents('.cartRight').find(".getGoodsID").prop("href");
        var goodsID = parseUrl(url);
        //console.log(goodsID);
        upNum(userID,goodsID,num);
        countNumAndPrice();
    });
    $(".lower").click(function () {
        var num = $(this).next().val();
        --num;
        if(num <= 0){
            num = 0;
        }
        $(this).next().val(num);
        var url = $(this).parents('.cartRight').find(".getGoodsID").prop("href")
        var goodsID = parseUrl(url);
        upNum(userID,goodsID,num);
        countNumAndPrice();
    });
    $(".span .iconfont").click(function () {
        console.log($(this).parents(".cartList").find(".inputNum").val());
        $(this).parents(".cartList").html("").removeClass("cartList");
        var url = $(this).parents('.cartRight').find(".getGoodsID").prop("href");
        var goodsID = parseUrl(url);
        upNum(userID,goodsID,0);
        countNumAndPrice();
    })
}
function upNum(userID,goodsID,number){
    //console.log(goodsID);
    $.ajax({
        type:"get",
        url:"https://datainfo.duapp.com/shopdata/updatecar.php",
        data:{
            userID:userID,
            goodsID:goodsID.goodsID,
            number:number
        },
        success:function(data){
            //console.log(data);
        },
        error:function(XMLHttpRequest,textStatus,errorThrown){
            console.log("errorThrown:"+errorThrown);
        }
    });
}
function parseUrl(url){
    var i=url.indexOf('?');
    if(i==-1)return;
    var querystr=url.substr(i+1);
    var arr1=querystr.split('&');
    var arr2=new Object();
    for  (i in arr1){
        var ta=arr1[i].split('=');
        arr2[ta[0]]=ta[1];
    }
    return arr2;
}
function countNumAndPrice(){
    var len = $(".inputNum").length;
    var num = 0;

    for(var i=0;i<len;i++){
        num += parseFloat($(".inputNum").eq(i).val())
    }
    var lenT = $(".onePrice").length;
    var price = 0;
    for(var j=0;j<lenT;j++){
        price += parseFloat($(".onePrice").eq(j).html()*$(".onePrice").eq(j).parents(".cartRight").find(".inputNum").val());
    }
    $(".num").html(num);
    $(".total").html(price);

}
