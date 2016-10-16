/**
 * Created by my on 2016/10/9.
 */
var headerHtml = template('./tpl/header');
var footerHtml = template('./tpl/footer');
$(".headerTop").append(headerHtml);
$("footer").append(footerHtml);
$("span").removeClass("border").eq(1).addClass("border");
var classID;
var swiperTop,swiperBottom;
swiperBottom = new Swiper('.swiper-container-bottom', {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    onSlideChangeStart: function(swiper){
        var nowActive = swiper.activeIndex;
        $(".swiper-container-top .swiper-slide").removeClass("active").eq(nowActive).addClass("active");
        swiperTop.slideTo(nowActive,200,false);
    }
});
if(parseUrl()){
    classID = parseUrl()["classID"];
}else{
    classID = 1;
}
showAllClass(classID);
function showAllClass(classID){
    var arr = [];
    $.ajax({
        type: "get",
        url: "http://datainfo.duapp.com/shopdata/getclass.php",
        dataType: "JSON",
        success: function (data) {
            console.log(data);
            var iconNavHtml = template('./tpl/iconNav',data);
            $("section").prepend(iconNavHtml);
            swiperTop = new Swiper('.swiper-container-top', {
                slidesPerView: 6,
                paginationClickable: true,
                pagination: '.swiper-pagination',
                centeredSlides: true,
                onInit: function (swiper) {
                    swiperBottom.slideTo(--classID,200,false);
                    setTimeout(function () {
                        swiperTop.slideTo(classID,200,false);
                        $(".swiper-container-top .swiper-slide").removeClass("active").eq(classID).addClass("active");
                    },50);
                },
                onTap: function (swiper) {
                    var nowActive = swiper.clickedIndex;
                    console.log(nowActive);
                    $(".swiper-container-top .swiper-slide").removeClass("active").eq(nowActive).addClass("active");
                    swiperBottom.slideTo(nowActive,200,false)
                }
            });
            $(".swiper-slide").eq(0).addClass("active");
            showOneClassGood()
        },
        error: function () {
        }
    });
}
function showOneClassGood(){
    $.ajax({
        type:"get",
        url:"http://datainfo.duapp.com/shopdata/getclass.php",
        dataType:"JSON",
        success: function (data) {
            console.log(data);
            var len = data.length;
            for(var i=0;i<len;i++){
                //console.log(data[i].classID);
                loadOneClassGood(data[i].classID,i);
            }
        },
        error: function () {
        }
    })
}
function loadOneClassGood(classID,index){
    $.ajax({
        type:"get",
        url:"http://datainfo.duapp.com/shopdata/getGoods.php",
        data:{
            classID:classID
        },
        dataType:"JSONP",
        success: function (data) {
            var len = data.length;
            //console.log(data);
            if(data == 0){
                $(".swiper-container-bottom .swiper-wrapper .swiper-slide").eq(index).append("没有内容");
            }else {
                var str = "";
                for(var i=0;i<len;i++){
                    var tmpStr = $("#tmp").html();
                    var originalPrice = 0;
                    if(data[i].discount == 0){
                        originalPrice = parseFloat(data[i].price);
                    }else {
                        originalPrice += parseInt(10*data[i].price/data[i].discount)
                    }
                    tmpStr = tmpStr.replace("{{src}}",data[i].goodsListImg)
                        .replace("{{href}}","detail.html?goodsID="+data[i].goodsID)
                        .replace("{{goodsName}}",data[i].goodsName)
                        .replace("{{price}}",data[i].price)
                        .replace("{{originalPrice}}",originalPrice)
                    str += tmpStr;
                }
                $(".swiper-container-bottom .swiper-wrapper .swiper-slide").eq(index).append(str);
            }
            //console.log(data);
        },
        error:function(XMLHttpRequest,textStatus,errorThrown){
            console.log("errorThrown:"+errorThrown);
        }
    })
}
function parseUrl(){
    var url = location.href;
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