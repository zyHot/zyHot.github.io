/*TMODJS:{"version":12,"md5":"3cd0e352dff614481d7e4ab9b71bbdbc"}*/
template('tpl/banner',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,$value=$data.$value,$index=$data.$index,$escape=$utils.$escape,$out='';$out+='<div class="swiper-container"> <div class="swiper-wrapper"> ';
$each($data,function($value,$index){
$out+=' <div class="swiper-slide"><img src="';
$out+=$escape($value);
$out+='" alt=""></div> ';
});
$out+=' </div> <div class="swiper-pagination"></div> </div> ';
return new String($out);
});