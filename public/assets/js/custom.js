/*** Define Global Variables ***/
var start_adbc = 1;
var end_adbc = 1;
var flag = 1;
var areasUrl = "/api/areas";
var themesUrl = "/api/themes";
var tagsUrl = "/api/tags";

$(document).ready(function() {

	//====== Load Events Data ======//
	getEvents();

	$("#status").on("click", function() {
		if ($(".btn-on-1").hasClass("active")) {
			$(".search-options").css("display", "none");
			$(".recent-posts").css("display", "none");
		} else {
			$(".search-options").css("display", "block");
			$(".recent-posts").css("display", "block");
		}
	});

	//========== Switch AD / BC =========/
	$("#from_year_adbc").on("click", function() {
		if($(".from_adbc-on-1").hasClass("active")){
			start_adbc = 0;
		}else{
			start_adbc = 1;
		}
	});

	$("#to_year_adbc").on("click", function() {
		if($(".to_adbc-on-1").hasClass("active")){
			end_adbc = 0;
		}else{
			end_adbc = 1;
		}
	});

	$("#all_collapse_btn").on("click", function() {

		if (flag == 1) {
			$('.multi-collapse').collapse('show');
			$(".timeline-title .fa").css("transform", "rotate( -90deg)");
			flag = 0;
		} else {
			$('.multi-collapse').collapse('hide');
			$(".timeline-title .fa").css("transform", "unset");
			flag = 1;
		}
	});

	//============= Trigger Filter When Enter =============//
	$("#textSearch").on("keyup", function(e) {
		if (e.keyCode === 13) {
			pcSearch();
		}
	});

	//============ Validate Input Number ================//
	$("#start_year, #end_year").on("keypress", function(e) {
		// Only ASCII charactar in that range allowed 
        var ASCIICode = (e.which) ? e.which : e.keyCode 
        if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) 
            return false; 
        return true; 
	});

});


function getUniqueArray(arrayData){

	var uniqueArray = []
	$.each(arrayData, function(i, el){
		if($.inArray(el, uniqueArray) === -1) uniqueArray.push(el);
	});

	return uniqueArray;
}


function getIdByLevel1(arrayData, title1){

	var id = 0;

	$.each(arrayData, function(i, el){
		if(el.level_1_title === title1){
			id = el.id;
		}
	});

	return id;
}


function getIdByLevel2(arrayData, title2){

	var id = 0;

	$.each(arrayData, function(i, el){
		if(el.level_2_title === title2){
			id = el.id;
		}
	});

	return id;
}


function treeAdjust(tagName){

	$("." + tagName + "-input").on("click", function() {
		if($("." + tagName + "-menu").find("i[class*='sim-tree-spread']").hasClass("sim-icon-d")){
			$("." + tagName + "-menu").find("i[class*='sim-tree-spread']").removeClass("sim-icon-d");
			$("." + tagName + "-menu").find("i[class*='sim-tree-spread']").addClass("sim-icon-r");
		}
		$("." + tagName + "-menu").find("ul").removeClass("show");
	});
}


/************get areas*************/
getRequestData(areasUrl).then((areasArrayObject)=>{

	var areasArray = areasArrayObject.data;
	var areaLevel1 = [];
	var uniqueAreaLevel1 = [];
	var areaLevel2_rows = [];
	var uniqueAreaLevel2_num = [];
	var areaTreeArray = [];
	var level1_id = 0;

	$.each(areasArray, function(i, el){
		areaLevel1.push(el.level_1_title);
	});

	uniqueAreaLevel1 = getUniqueArray(areaLevel1);

	$.each(areasArray, function(i, el){
		areaLevel2_rows.push(el.level_2_title);
	});

	uniqueAreaLevel2_num = getUniqueArray(areaLevel2_rows);

	var uniqueTotalLength = uniqueAreaLevel1.length + uniqueAreaLevel2_num.length;
	var level2_id = uniqueAreaLevel1.length;

	$.each(uniqueAreaLevel1, function(i, elUniqueLevel1){
		var areasArrayResultLevel1 = [];
		var areaLevel2 = [];
		var uniqueAreaLevel2 = [];
		level1_id += 1;

		$.each(areasArray, function(i, elAreas){
			if (elAreas.level_2_title !== null) {
				if(elUniqueLevel1 === elAreas.level_1_title) areaLevel2.push(elAreas.level_2_title);
			}
		});
		
		if(areaLevel2.length > 1){
			areasArrayResultLevel1['id'] = level1_id;
			areasArrayResultLevel1['pid'] = '';
			areasArrayResultLevel1['name'] = elUniqueLevel1;
			areaTreeArray.push(areasArrayResultLevel1);
			uniqueAreaLevel2 = getUniqueArray(areaLevel2);
			$.each(uniqueAreaLevel2, function(i, elUniqueLevel2){

				var areasArrayResultLevel2 = [];
				var areaLevel3 = [];
				level2_id += 1;

				$.each(areasArray, function(i, elAreas){
					if(elAreas.level_3_title !== null){
						if(elUniqueLevel2 === elAreas.level_2_title){
							areaLevel3Detail = [];
							areaLevel3Detail['id'] = uniqueTotalLength + elAreas.id;
							areaLevel3Detail['pid'] = level2_id;
							areaLevel3Detail['name'] = elAreas.level_3_title;
							areaLevel3.push(areaLevel3Detail);
							areaTreeArray.push(areaLevel3Detail);
						}
					}
				});

				if(areaLevel3.length > 1){
					areasArrayResultLevel2['id'] = level2_id;
				}else{
					areasArrayResultLevel2['id'] = uniqueTotalLength + getIdByLevel2(areasArray, elUniqueLevel2);
				}
				areasArrayResultLevel2['pid'] = level1_id;
				areasArrayResultLevel2['name'] = elUniqueLevel2;
				areaTreeArray.push(areasArrayResultLevel2);

			});
		}else{
			areasArrayResultLevel1['id'] = uniqueTotalLength + getIdByLevel1(areasArray, elUniqueLevel1);
			areasArrayResultLevel1['pid'] = '';
			areasArrayResultLevel1['name'] = elUniqueLevel1;
			areaTreeArray.push(areasArrayResultLevel1);
		}


	});

	dropDownTree("areas", "#ddTreeAreas", areaTreeArray, uniqueTotalLength);
	dropDownTree("areas", "#mobile-ddTreeAreas", areaTreeArray, uniqueTotalLength);
});


/************get themes*************/
getRequestData(themesUrl).then((themesArrayObject)=>{

	var themesArray = themesArrayObject.data;
	var themeLevel1 = [];
	var uniqueThemeLevel1 = [];
	var themeLevel2_rows = [];
	var uniqueThemeLevel2_num = [];
	var themeTreeArray = [];
	var level1_id = 0;

	$.each(themesArray, function(i, el){
		themeLevel1.push(el.level_1_title);
	});

	uniqueThemeLevel1 = getUniqueArray(themeLevel1);

	var level2_id = uniqueThemeLevel1.length;

	$.each(uniqueThemeLevel1, function(i, elUniqueLevel1){
		var themesArrayResultLevel1 = [];
		var themeLevel2 = [];
		var uniqueThemeLevel2 = [];
		level1_id += 1;

		$.each(themesArray, function(i, elThemes){
			if (elThemes.level_2_title !== null) {
				if(elUniqueLevel1 === elThemes.level_1_title) themeLevel2.push(elThemes.level_2_title);
			}
		});
		
		if(themeLevel2.length > 1){
			themesArrayResultLevel1['id'] = level1_id;
			themesArrayResultLevel1['pid'] = '';
			themesArrayResultLevel1['name'] = elUniqueLevel1;
			themeTreeArray.push(themesArrayResultLevel1);

			$.each(themesArray, function(i, elThemes){
				if(elThemes.level_2_title !== null){
					if(elUniqueLevel1 === elThemes.level_1_title){
						themeLevel2Detail = [];
						themeLevel2Detail['id'] = uniqueThemeLevel1.length + elThemes.id;
						themeLevel2Detail['pid'] = level1_id;
						themeLevel2Detail['name'] = elThemes.level_2_title;
						themeTreeArray.push(themeLevel2Detail);
					}
				}
			});

		} else {
			themesArrayResultLevel1['id'] = uniqueThemeLevel1.length + getIdByLevel1(themesArray, elUniqueLevel1);
			themesArrayResultLevel1['pid'] = '';
			themesArrayResultLevel1['name'] = elUniqueLevel1;
			themeTreeArray.push(themesArrayResultLevel1);
		}
	});

	dropDownTree("themes", "#ddTreeThemes", themeTreeArray, uniqueThemeLevel1.length);
	dropDownTree("themes", "#mobile-ddTreeThemes", themeTreeArray, uniqueThemeLevel1.length);
});

/******** get tags **********/
getRequestData(tagsUrl).then((res) => {
	let tagsHtml = "";
	$.each(res.data, (i, el) => {
		tagsHtml += "<option value='" + el.id + "'>" + el.tag + "</option>";
	});

	$("#tags").html(tagsHtml);
});

async function getEvents(query, page_num) {

	var queryString = "";

	if (page_num !== undefined) {
		queryString += "&page=" + page_num;
	} else {
		queryString += "&page=1";
	}

	if (query !== "") {
		var eventsUrl = "/api/events/query/" + queryString + query;
	} else {
		var eventsUrl = "/api/events/all/" + queryString;
	}

	var eventsArrayObject = await getRequestData(eventsUrl);

	var eventsArray = eventsArrayObject.data;
	var eventsMeta = eventsArrayObject.meta;
	var eventsTotalPages = eventsMeta['last_page'];
	var eventsCard = '';

	$.each(eventsArray, function(i, el){

		var eventThumbnail = "";
		var imageHintIcon = "";
		var eventMainImage = "";
		var historyworldLinkIcon = "";
		var placeLinkIcon = "";
		var googleMapLinkIcon = "";
		var eventMainImageUrl = "";
		var eventMainImageCaption = "";
		var historyworldLink = "";
		var googleMapLink = "";

		if ((el.images).length > 0) {
			imageHintIcon = '<a href="javascript:void(0)"><i class="fa fa-image"></i></a>';
			eventThumbnail = `<img class='event-thumbnail' src='${el.images[0].thumbnail_url}' />`;
			eventMainImage = `<img class='event-mainimage' src='${el.images[0].url}' />`;
			eventMainImageUrl = el.images[0].url;
			eventMainImageCaption = el.images[0].caption;
		}

		if (el.place_link !== null) {
			historyworldLinkIcon = '<a href="javascript:void(0)"><i class="hw-icon"></i></a>';
			historyworldLink = '<a href="' + el.place_link + '" class="event-link" target="_blank"><i class="hw-icon"></i> ' + el.history_world_link + '</a>';
		}

		// if (el.place_link !== null) {
		// 	placeLinkIcon = '<a href="javascript:void(0)"><i class="icofont-link" style="font-size: 18px;"></i></a>';
		// }

		if (el.google_map_link !== null) {
			googleMapLinkIcon = '<a href="javascript:void(0)" ><i class="fa fa-map-pin"></i></a>';
			googleMapLink = '<a href="' + el.google_map_link + '" class="event-link" target="_blank"><i class="fa fa-map-pin"></i> Look at location for event</a>'
		}

		let eventYear = el.event_year_text;
		let eventTitle = el.event;
		let eventContent = el.event_long;

		if ((el.images).length > 0) {
			eventsCard += '<div class="card">'
							+ '<h5 class="card-header collapsed d-block" role="tab" id="heading' + i + '" data-toggle="collapse" data-parent="#accordion" aria-controls="collapse' + i + '" aria-expanded="false" href="#collapse' + i + '">'
								+ '<div class="row">'
									+ '<div class="col-lg-9"><a href="javascript:void(0)">' + el.event_year_text + '<br>' + eventTitle + '</a>'
									+ '<span class="alignb">'
										+ imageHintIcon
										+ historyworldLinkIcon
										+ googleMapLinkIcon
										// + placeLinkIcon
									+ '</span></div>'
									+ '<div class="col-lg-3">'+eventThumbnail+'</div>'
								+ '</div>'
							+ '</h5>'
							+ '<div id="collapse' + i + '" class="collapse multi-collapse" role="tabpanel" aria-labelledby="heading' + i + '">'
								+ '<div class="card-body">'
									+ '<div class="row">'
										+ '<div class="col-md-4" style="text-align: center">'
											+ '<img src="'+eventMainImageUrl+'" style="width: 100%;cursor: zoom-in" onclick="imgEnlarge(this)"/>'
											+ '<a href="javascript:void(0)" class="gallery-caption"><span>'+eventMainImageCaption+'</span></a>'
											+ '</div>'
											+ '<div class="col-md-8">'
											+ '<p>' + eventContent + '</p>'
											+ '<span class="alignb">'
												+ historyworldLink
												+ '<a href="javascript:void(0)" style="display: none"><i class="fa fa-wikipedia-w"></i> Wikipedia link title</a>'
												+ '<a href="javascript:void(0)" style="display: none"><i class="icofont-external-link"></i> Generic link title</a>'
												+ googleMapLink
											+ '</span>'
										+ '</div>'
									+ '</div>'
								+ '</div>'
							+ '</div>'
						+ '</div>';
		} else {
			eventsCard += '<div class="card">'
							+ '<h5 class="card-header collapsed d-block" role="tab" id="heading' + i + '" data-toggle="collapse" data-parent="#accordion" aria-controls="collapse' + i + '" aria-expanded="false" href="#collapse' + i + '">'
								+ '<div class="row">'
									+ '<div class="col-lg-12"><a href="javascript:void(0)">' + el.event_year_text + '<br>' + eventTitle + '</a>'
									+ '<span class="alignb">'
										+ historyworldLinkIcon
										+ googleMapLinkIcon
										// + placeLinkIcon
									+ '</span></div>'
								+ '</div>'
							+ '</h5>'
							+ '<div id="collapse' + i + '" class="collapse multi-collapse" role="tabpanel" aria-labelledby="heading' + i + '">'
								+ '<div class="card-body">'
									+ '<div class="row">'
											+ '<div class="col-md-12">'
											+ '<p>' + eventContent + '</p>'
											+ '<span class="alignb">'
												+ historyworldLink
												+ '<a href="javascript:void(0)" style="display: none"><i class="fa fa-wikipedia-w"></i> Wikipedia link title</a>'
												+ '<a href="javascript:void(0)" style="display: none"><i class="icofont-external-link"></i> Generic link title</a>'
												+ googleMapLink
											+ '</span>'
										+ '</div>'
									+ '</div>'
								+ '</div>'
							+ '</div>'
						+ '</div>';
		}
	});

	$("#events").html(eventsCard);
	$(".spinner-box").hide();

	$('#pagination').twbsPagination({
		totalPages: eventsTotalPages,
		visiblePages: 3,
		next: 'Next',
		prev: 'Previous',
		onPageClick: function (event, page) {
			getEvents(query, page);
		}
	});
}

function searchFrmInit(device) {

	$("#textSearch").val("");
	$(".search_year").val("");

	if ($(".to_adbc-on-1").hasClass("active")) {
		$(".to_adbc-on-1").removeClass("active");
		$(".to_adbc-off-1").addClass("active");
	}
	
	if ($(".from_adbc-on-1").hasClass("active")) {
		$(".from_adbc-on-1").removeClass("active");
		$(".from_adbc-off-1").addClass("active");
	}

	$("#tags").val("");
	
	$(".sim-tree-checkbox").removeClass("sim-tree-semi");
	$(".sim-tree-checkbox").removeClass("checked");

	$("#areas").val("");
	$(".areasTree-input").val("");
	$("#themes").val("");
	$(".themesTree-input").val("");
	$("#textSearch").val("");
	
	$("#mobile-areas").val("");
	$(".mobileAreasTree-input").val("");
	$("#mobile-themes").val("");
	$(".mobileThemesTree-input").val("");
	$("#mobile-textSearch").val("");

	treeAdjust('areasTree');
	treeAdjust('themesTree');
	treeAdjust('mobileAreasTree');
	treeAdjust('mobileThemesTree');

	if(device == "pc"){
		pcSearch();
		
	}else{
		mobileSearch();

	}
}


function imgEnlarge(el) {

	let imgUrl = $(el).attr('src');
	$('#imgEnlargeModal').css("display", "flex");
	
	$("#imgEnlargeModal img").attr("src", imgUrl);
}


function mobileSearch(){

	var search_text = $("#mobile-textSearch").val();
	start_year = $("#mobile_start_year").val();
	var start_bcad = $("#mobile_start_bcad").val();

	if(start_bcad == 0){
		start_year = -start_year; 
	}
	//end_year = $("#mobile_end_year").val();
	//var end_bcad = $("#mobile_end_bcad").val();
	// if(end_bcad == 0){
	// 	end_year = -end_year; 
	// }
	areas = $("#mobile-areas").val();
	//tags = $("#mobile-tags").val();
	themes = $("#mobile-themes").val();

	//var query = getQuery(search_text, start_year, end_year, areas, tags, themes);
	var query = getQuery(search_text, start_year, areas, themes);
	getEvents(query);
}

function pcSearch() {

	var search_text = $("#textSearch").val();
	var start_year = $("#start_year").val();
	var end_year = $("#end_year").val();
	
	var areas = $("#areas").val();
	var themes = $("#themes").val();

	if(start_adbc == 0){
		start_year = -start_year; 
	}

	if(end_adbc == 0){
		end_year = -end_year; 
	}

	//var tags = $("#tags").val();
	//var query = getQuery(search_text, start_year, end_year, areas, tags, themes);
	var query = getQuery(search_text, start_year, areas, themes);
	getEvents(query);
	makeFilterTitle();
}

// Make Filter Title
function makeFilterTitle() {
	var search_text = $("#textSearch").val();
	var start_year = $("#start_year").val();
	var start_bcad = $("#start_bcad").val();
	var areas = $("#areas").val();
	var themes = $("#themes").val();

	if (start_bcad == 1) {
		start_bcad = "";
	} else {
		start_bcad = " BC";
	}

	if (start_year == "") {
		const d = new Date();
		start_year = d.getFullYear();
	}

	// if (areas == "") {
	// 	areas = "All Areas";
	// } else if (areas == "1,2,3,4,5,6,7,8,9,10,11,12,13,14") {
	// 	areas = "Africa";
	// } else if (areas == "15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34") {
	// 	areas = "Asia";
	// } else if (areas == "35,36,37,38") {
	// 	areas = "Australia and Oceania";
	// } else if (areas == "39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61") {
	// 	areas = "Europe";
	// } else if (areas == "62,63,64,65,66,67,68,69,70") {
	// 	areas = "Latin America";
	// } else if (areas == "71,72") {
	// 	areas = "North America";
	// } else if (areas == "73") {
	// 	areas = "Polar regions";
	// }

	switch(areas) {
		case "1,2,3,4,5,6,7,8,9,10,11,12,13,14":
			areas = "Africa";
			break;
		case "15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34":
			areas = "Asia";
			break;
		case "35,36,37,38":
			areas = "Australia and Oceania";
			break;
		case "39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61":
			areas = "Europe";
			break;
		case "62,63,64,65,66,67,68,69,70":
			areas = "Latin America";
			break;
		case "71,72":
			areas = "North America";
			break;
		case "73":
			areas = "Polar regions";
			break;
		case "1,2":
			areas = "Central Africa";
			break;
		case "3,4,5,6,7":
			areas = "East Africa";
			break;
		case "8,9":
			areas = "North Africa";
			break;
		case "10,11,12":
			areas = "South Africa";
			break;
		case "13,14":
			areas = "West Africa";
			break;
		default:
			areas = areas;
	}

	console.log(themes);
	if (themes == "" || themes == "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63") {
		themes = "All themes";
	} else if (themes == "1,2,3,4,5,6") {
		themes = "Arts";
	} else if (themes == "7,8,9,10,11,12,13") {
		themes = "Literature";
	} else if (themes == "14,15,16,17,18,19,20") {
		themes = "Performing arts";
	} else if (themes == "21,22,23,24,25,26,27,28,29,30") {
		themes = "Politics";
	} else if (themes == "31,32,33,34,35,36") {
		themes = "Religion";
	} else if (themes == "37,38,39,40,41,42,43,44") {
		themes = "Science";
	} else if (themes == "45,46,47,48,49,50,51,52,53,54") {
		themes = "Society";
	} else if (themes == "55,56,57,58,59") {
		themes = "Technology";
	} else if (themes == "60,61,62,63") {
		themes = "War";
	} else if (themes == "") {
		themes = "";
	}

	var filterTitle = "Events from "+start_year+start_bcad+" in "+areas+" for "+themes;
	$("#search_title").html(filterTitle);
}

//function getQuery(search_text, start_year, end_year, areas, tags, themes){
function getQuery(search_text, start_year, areas, themes){

	//var pagination = "";
	var pagination = "&per_page=10";

	if(search_text){
		search_text = "&q=" + search_text;
	}else{
		search_text = "";
	}

	if(start_year){
		start_year = "&from=" + start_year;
	}else{
		start_year = "";
	}

	// if(end_year){
	// 	end_year = "&to=" + end_year;
	// }else{
	// 	end_year = "";
	// }

	if(areas !== ""){
		areas = "&areas=" + areas;
	}else{
		areas = "";
	}

	// if(tags !== ""){
	// 	tags = "&tags=" + tags;
	// }else{
	// 	tags = "";
	// }

	if(themes !== ""){
		themes = "&themes=" + themes;
	}else{
		themes = "";
	}

	//var query = search_text + start_year + end_year + areas + tags + themes;
	var query = pagination + search_text + start_year + areas + themes;
	return query;

}

//Dropdown tress
function dropDownTree(search_option, tag, list, uniqueTotalLength){
	var tree = simTree({
		el: tag,
		data: list,
		check: true,
		linkParent: true,
		//check: true,
		onClick: function (item) {
			//shows when page is onloaded
		},
		onChange: function (item) {
			var ids = "";
			var items = 0;
			var conditionLength = 0;
			conditionLength = uniqueTotalLength;

			$.each(item, function(i, el){
				let element = 0;
				if(el['id'] > conditionLength){
					element = el['id'] - conditionLength;
					ids += element + ",";
					items += 1;
				}
			});

			ids = ids.slice(0, -1);

			if(items !== 0){
				if(tag == "#ddTreeAreas"){
					$(".areasTree-input").val(items + " items selected");
					$("#areas").val(ids);

				}else if(tag == "#mobile-ddTreeAreas"){
					$(".mobileAreasTree-input").val(items + " items selected");
					$("#mobile-areas").val(ids);

				}else if(tag == "#ddTreeThemes"){
					$(".themesTree-input").val(items + " items selected");
					$("#themes").val(ids);

				}else if(tag == "#mobile-ddTreeThemes"){
					$(".mobileThemesTree-input").val(items + " items selected");
					$("#mobile-themes").val(ids);
				}

			}else{
				if(tag == "#ddTreeAreas"){
					$(".areasTree-input").val("");
					$("#areas").val("");

				}else if(tag == "#mobile-ddTreeAreas"){
					$(".mobileAreasTree-input").val("");
					$("#mobile-areas").val("");

				}else if(tag == "#ddTreeThemes"){
					$(".themesTree-input").val("");
					$("#themes").val("");

				}else if(tag == "#mobile-ddTreeThemes"){
					$(".mobileThemesTree-input").val("");
					$("#mobile-themes").val("");
				}
			}
		}
	});
}


function getRequestData(url){

	$(".spinner-box").show();

	return new Promise((resolve, reject)=>{
		$.ajax({
			type:'GET',
			url: url,
			dataType: 'json',
		}).done(function(response){
			resolve(response);
		});
	})
}