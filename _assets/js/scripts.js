// ======= Placeholder Plugin =========================================
/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(f,h,$){var a='placeholder' in h.createElement('input'),d='placeholder' in h.createElement('textarea'),i=$.fn,c=$.valHooks,k,j;if(a&&d){j=i.placeholder=function(){return this};j.input=j.textarea=true}else{j=i.placeholder=function(){var l=this;l.filter((a?'textarea':':input')+'[placeholder]').not('.placeholder').bind({'focus.placeholder':b,'blur.placeholder':e}).data('placeholder-enabled',true).trigger('blur.placeholder');return l};j.input=a;j.textarea=d;k={get:function(m){var l=$(m);return l.data('placeholder-enabled')&&l.hasClass('placeholder')?'':m.value},set:function(m,n){var l=$(m);if(!l.data('placeholder-enabled')){return m.value=n}if(n==''){m.value=n;if(m!=h.activeElement){e.call(m)}}else{if(l.hasClass('placeholder')){b.call(m,true,n)||(m.value=n)}else{m.value=n}}return l}};a||(c.input=k);d||(c.textarea=k);$(function(){$(h).delegate('form','submit.placeholder',function(){var l=$('.placeholder',this).each(b);setTimeout(function(){l.each(e)},10)})});$(f).bind('beforeunload.placeholder',function(){$('.placeholder').each(function(){this.value=''})})}function g(m){var l={},n=/^jQuery\d+$/;$.each(m.attributes,function(p,o){if(o.specified&&!n.test(o.name)){l[o.name]=o.value}});return l}function b(m,n){var l=this,o=$(l);if(l.value==o.attr('placeholder')&&o.hasClass('placeholder')){if(o.data('placeholder-password')){o=o.hide().next().show().attr('id',o.removeAttr('id').data('placeholder-id'));if(m===true){return o[0].value=n}o.focus()}else{l.value='';o.removeClass('placeholder');l==h.activeElement&&l.select()}}}function e(){var q,l=this,p=$(l),m=p,o=this.id;if(l.value==''){if(l.type=='password'){if(!p.data('placeholder-textinput')){try{q=p.clone().attr({type:'text'})}catch(n){q=$('<input>').attr($.extend(g(this),{type:'text'}))}q.removeAttr('name').data({'placeholder-password':true,'placeholder-id':o}).bind('focus.placeholder',b);p.data({'placeholder-textinput':q,'placeholder-id':o}).before(q)}p=p.removeAttr('id').hide().prev().attr('id',o).show()}p.addClass('placeholder');p[0].value=p.attr('placeholder')}else{p.removeClass('placeholder')}}}(this,document,jQuery));

// ======= Active Nav =================================================
var path = location.pathname.substring(1);
if (path) { // if there is a value for the varible path

    /*-- for the primary nav - if path equals the href give the parent a class of selected
             example: nav ul li.selected a --*/
    $('nav a[href$="' + path + '"]').parent().addClass('selected');

    /*-- for dropdown nav - if path equals the href of the drop down links give the top level link a class of selected
             example: nav ul li.selected a --*/
    $('nav ul ul a[href$="' + path + '"]').parents(':eq(2)').addClass('selected');

    /*-- for the aside nav - if path equals the href give the parent a class of selected
             example: aside ul li.selected a --*/
    $('aside li a[href$="' + path + '"]').parent().addClass('selected');
};

// ======= On Page Load ==============================================
$(function () {
    // ======= Placeholder ===========================================
    $('input, textarea').placeholder();

    // ======= Foundation ============================================
    $(document).foundation();

    // ======= Fitvids ===============================================     
    $(document).fitVids();
    
    // ======= Random Image Background ===============================
    var images = ['bkg1.jpg', 'bkg2.jpg', 'bkg3.jpg', 'bkg4.jpg', 'bkg5.jpg'];
    $('body.inner').css({'background-image': 'url(/_assets/images/backgrounds/' + images[Math.floor(Math.random() * images.length)] + ')'});
    
	if($('.short-desc').length > 0){
		$('.short-desc').each(function(index, element) {
			var content = $(this).find('p:first').html();
			$(this).html(content);
			$(this).show();
			
		});
	};
	if($('.booking-detail').length > 0){
		if($('#capacity').text() != 'N/A'){
			$('.tickets').show();
			$('#booking-form').show();
			};
		};
	if($('.bio').length > 0){
		$('.bio > .image').each(function(index, element) {
			var imgsrc = $(this).find('img').attr('src');
			if(imgsrc.substring(0,1) == '?'){
				$(this).hide();
				};            
        });
	};
	if($('.sponsors').length > 0){
		$('.sponsors > .image').each(function(index, element) {
			var imgsrc = $(this).find('img').attr('src');
			if(imgsrc.substring(0,1) == '?'){
				$(this).hide();
				};            
        });
		$('.sponsors > .phone').each(function(index, element) {
            var phone = $(this).find('span').text();
			if(phone == ""){$(this).hide()};
        });
		$('.sponsors > .email').each(function(index, element) {
            var email = $(this).find('span').text();
			if(email == ""){$(this).hide()};
        });
		$('.sponsors > .address').each(function(index, element) {
            var address = $(this).find('span').text();
			if(address == ""){$(this).hide()};
        });
		$('.sponsors > .descn').each(function(index, element) {
            var descn = $(this).find('span').text();
			if(descn == ""){$(this).hide()};
        });
		$('.sponsors > .website').each(function(index, element) {
            var website = $(this).find('span').text();
			if(website == ""){$(this).hide()};
        });

	};
    if($('.dtl').length > 0){
    
        $('.dtl .result').each(function(index,element){
            if($(this).find('.item').html() ==""){
            	$(this).hide().addClass('hide').removeClass('show');
            }
        
        });

        // event 1
        var headingshow1 = false;
        $('.event1').each(function(){
            if($(this).hasClass('show')){
            headingshow1 = true;
            }
        });
        if(headingshow1 === false ){
        	$('#event1').hide();
        }
        // event 2
        var headingshow2 = false;
        $('.event2').each(function(){
            if($(this).hasClass('show')){
            headingshow2 = true;
            }
        });
        if(headingshow2 === false ){
        	$('#event2').hide();
            $('#event2spacer').hide();
        }
        // event 3
        var headingshow3 = false;
        $('.event3').each(function(){
            if($(this).hasClass('show')){
            headingshow3 = true;
            }
        });
        if(headingshow3 === false ){
        	$('#event3').hide();
            $('#event3spacer').hide();
        }
        // event 4
        var headingshow4 = false;
        $('.event4').each(function(){
            if($(this).hasClass('show')){
            headingshow4 = true;
            }
        });
        if(headingshow4 === false ){
        	$('#event4').hide();
            $('#event4spacer').hide();
        }
        // event 5
        var headingshow5 = false;
        $('.event5').each(function(){
            if($(this).hasClass('show')){
            headingshow5 = true;
            }
        });
        if(headingshow5 === false ){
        	$('#event5').hide();
            $('#event5spacer').hide();
        }
        // highguns
        var highguns = false;
        $('.highguns').each(function(){
            if($(this).hasClass('show')){
            highguns = true;
            }
        });
        if(highguns === false ){
        	$('#highguns').hide();
            $('#highgunsspacer').hide();
        }
    };
});


// ======= Init Flexslider Settings ==================================

$(window).load(function() {
  // The slider being synced must be initialized first
  $('#carousel').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 79,
    itemMargin: 10,
    touch: true,
    asNavFor: '#slider'
  });
   
  $('#slider').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    touch: true,
    sync: "#carousel"
  });
});
// ===========  Switch content display on hover ==========================


$('.flipstate').hover(function() {
        $(this).find('.disp_a').hide();
        $(this).find('.disp_b').show();
    }, function() {
        $(this).find('.disp_b').hide();
        $(this).find('.disp_a').show();
});
var loggedin = "{module_isloggedin}";
if (loggedin == 1) {
    $(".utility .uty1 a").css({ display: "block" });
    $(".utility .uty0 a").css({ display: "none" });
}
else {
    $(".utility .uty1 a").css({ display: "none" });
    $(".utility .uty0 a").css({ display: "block" });
}