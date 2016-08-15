$(document).ready(function(){
	$('#companySettingsForm').submit(function (e){
		e.preventDefault();
		$('#confirmation').text("");
		var companySettingFile = new BCAPI.Models.FileSystem.File('/_System/Apps/solid-company-settings/_data/sitesettings.json');
		var jsonFileData = JSON.stringify(ConvertFormToJSON($(this)));
		companySettingFile.upload(jsonFileData).done(function () {
			$('#confirmation').text("Company Information Saved Successfully");
		}).error(function (jqXHR) {
			$('#confirmation').text("Their was an error updating your company information");
		});    
	});
	$('input').change(function(){
		$('#confirmation').text("Click to Save Changes");
	});
});
function ConvertFormToJSON(form){
    var array = jQuery(form).serializeArray();
    var json = {};
    jQuery.each(array, function() {
        json[this.name] = this.value || '';
    });
    return json;
} 
//global vars
var _mainAppFolder = new BCAPI.Models.FileSystem.Folder('/_System/Apps/solid-company-settings'); 

$(function(){
	
     $('#delete-app').click(function() {
		var prompt = window.prompt('To confirm type DELETE');
		if (prompt === 'DELETE') {
			_mainAppFolder.destroy().done(function() {
				window.top.location.href = BCAPI.Helper.Site.getRootUrl();
			});
		} else if (prompt !== null) {
			window.alert('You must type \'DELETE\' (case sensitive) to proceed.');
		}
	 });
	
});