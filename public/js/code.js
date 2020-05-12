var flag = 1;                                        // global variable for all cards collapse/expand
var areasUrl = "/api/areas";                         // request uri for fetching all areas
var themesUrl = "/api/themes";                       // request uri for fetching all themes
var tagsUrl = "/api/tags";                           // request uri for fetching all tags
var timelinesUrl = "/api/timelines";                 // request uri for fetching all featured timelines
var areasArray = [];
var themesArray = [];
var tempQuery = "";


/**
 * THIS FUNCTION IS FOR SEARCHING HISTORYWORLD EVENTS
 * 
 * @param {String} deviceType 
 */
 var historyworldSearch = function(deviceType = "") {
    var searchText = "";
    var startYear = "";
    var endYear = "";
    var areas = "";
    var themes = "";
    var startADBC = "ad";

    if (deviceType == "mobile") {
        searchText = $("#mobile_search_terms #mobile_text_all_search").val();
        startYear = $("#mobile_search_terms #mobile_start_year").val();
        // endYear = $("#mobile_search_terms #mobile_end_year").val();
        areas = $("#mobile_search_terms #mobile-areas").val();
        themes = $("#mobile_search_terms #mobile-themes").val();

        if ($("#mobile_search_terms #mobile_from_bc_year").prop("checked")) {
            startYear = -startYear;
            startADBC = "bc";
        }
    } else {
        searchText = $("#pc_search_terms #text_all_search").val();
        startYear = $("#pc_search_terms #start_year").val();
        // endYear = $("#pc_search_terms #end_year").val();
        areas = $("#pc_search_terms #areas").val();
        themes = $("#pc_search_terms #themes").val();

        if ($("#pc_search_terms #from_bc_year").prop("checked")) {
            startYear = -startYear;
            startADBC = "bc";
        }
    }

    var query = getQuery(searchText, startYear, areas, themes);

    var searchTitle = getSearchTitle(searchText, startYear, areas, themes, startADBC);
    $("#search_title").html(searchTitle);

    loadEvents(query, "");
}

/**
 * 
 * @param {String} url 
 * @returns Json
 */
function getRequestData(url) {

    showSpinner();
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
        }).done(function(response) {
            resolve(response);
        });
    });
}

/**
 * 
 * @param {String} searchText 
 * @param {Integer} startYear 
 * @param {String} areas 
 * @param {String} themes 
 * @returns query
 */
function getQuery(searchText, startYear, areas, themes) {

    // var pagination = "&per_page=25";

    if (searchText) {
        searchText = "&q=" + searchText;
    } else {
        searchText = "";
    }

    if (startYear) {
        startYear = "&from=" + startYear;
    } else {
        startYear = "";
    }

    // if (end_year) {
    // 	end_year = "&to=" + end_year;
    // } else {
    // 	end_year = "";
    // }

    if (areas !== "") {
        areas = "&areas=" + areas;
    } else {
        areas = "";
    }

    // if (tags !== "") {
    // 	tags = "&tags=" + tags;
    // } else {
    // 	tags = "";
    // }

    if (themes !== "") {
        themes = "&themes=" + themes;
    } else {
        themes = "";
    }

    //var query = search_text + start_year + end_year + areas + tags + themes;
    var query = searchText + startYear + areas + themes;

    return query;
}


//=========== Load Featured Timelines ==============//
function loadFeaturedTimelines() {

    var timelineCategories = [];

    getRequestData(timelinesUrl).then((res) => {
        var timelines = res.data;
        $.each(timelines, (i, el) => {

            if ((el.categories).length > 0) {
                let category = el.categories[0]['category'];
                timelineCategories.push(category);
            }
        });

        var uniqueTimelineCategories = getUniqueArray(timelineCategories);
        // console.log(uniqueTimelineCategories);
        var timelinesTitles = "<div class='card-columns'>";

        $.each(uniqueTimelineCategories, (i, category) => {
            timelinesTitles += "<div class='card featured-card mt-2 mb-3'>" +
                "<div class='card-body'>" +
                "<h5 class='card-title'>" + category + "</h5>";
            $.each(timelines, (i, timeline) => {
                if ((timeline.categories).length > 0) {
                    if (category == timeline.categories[0]['category']) {
                        timelinesTitles += "<a href='javascript:void(0)' onclick='getFeaturedEvents(" + timeline['id'] + ", \"" + timeline['title'] + "\")' style='display: block'>" + timeline['title'] + "</a>";
                    }
                }
            });

            timelinesTitles += "</div></div>";
        });

        timelinesTitles += "</div>";

        $("#featured_title").html("Featured Timelines");
        $("#featured_events").html(timelinesTitles);
        hideSpinner();

        $('#pagination').twbsPagination('destroy');
    });
}

function searchItermsClear() {

    $("#mobile_text_all_search").val("");
    $("#mobile_start_year").val("");
    // $("#mobile-tags").val("");
    $("#mobile-areas").val("");
    $(".mobileAreasTree-input").val("");
    $("#mobile-themes").val("");
    $(".mobileThemesTree-input").val("");

    $("#mobile_from_bc_year").prop("checked", false);
    $("#mobile_from_ad_year").prop("checked", true);

    if ($(".mobile-to-adbc-on").hasClass("active")) {
        $(".mobile-to-adbc-on").removeClass("active");
        $(".mobile-to-adbc-off").addClass("active");
    }

    if ($(".mobile-from-adbc-on").hasClass("active")) {
        $(".mobile-from-adbc-on").removeClass("active");
        $(".mobile-from-adbc-off").addClass("active");
    }

    treeAdjust('mobileAreasTree');
    treeAdjust('mobileThemesTree');

    $("#mobile_search_terms .sim-tree-checkbox").removeClass("sim-tree-semi");
    $("#mobile_search_terms .sim-tree-checkbox").removeClass("checked");

    //------------------------------
    $("#text_all_search").val("");
    $("#start_year").val("");
    // $("#tags").val("");
    $("#areas").val("");
    $(".areasTree-input").val("");
    $("#themes").val("");
    $(".themesTree-input").val("");

    $("#from_bc_year").prop("checked", false);
    $("#from_ad_year").prop("checked", true);

    if ($(".to-adbc-on").hasClass("active")) {
        $(".to-adbc-on").removeClass("active");
        $(".to-adbc-off").addClass("active");
    }

    if ($(".from-adbc-on").hasClass("active")) {
        $(".from-adbc-on").removeClass("active");
        $(".from-adbc-off").addClass("active");
    }

    treeAdjust('areasTree');
    treeAdjust('themesTree');

    $("#pc_search_terms .sim-tree-checkbox").removeClass("sim-tree-semi");
    $("#pc_search_terms .sim-tree-checkbox").removeClass("checked");
}

//Dropdown tress
function dropDownTree(search_option, tag, list, uniqueTotalLength) {
    var tree = simTree({
        el: tag,
        data: list,
        check: true,
        linkParent: true,
        //check: true,
        onClick: function(item) {
            //shows when page is onloaded
        },
        onChange: function(item) {
            var ids = "";
            var items = 0;
            var conditionLength = 0;
            conditionLength = uniqueTotalLength;

            $.each(item, function(i, el) {
                let element = 0;
                if (el['id'] > conditionLength) {
                    element = el['id'] - conditionLength;
                    ids += element + ",";
                    items += 1;
                }
            });

            ids = ids.slice(0, -1);

            if (items !== 0) {
                if (tag == "#ddTreeAreas") {
                    $(".areasTree-input").val(items + " items selected");
                    $("#areas").val(ids);

                } else if (tag == "#mobile-ddTreeAreas") {
                    $(".mobileAreasTree-input").val(items + " items selected");
                    $("#mobile-areas").val(ids);

                } else if (tag == "#ddTreeThemes") {
                    $(".themesTree-input").val(items + " items selected");
                    $("#themes").val(ids);

                } else if (tag == "#mobile-ddTreeThemes") {
                    $(".mobileThemesTree-input").val(items + " items selected");
                    $("#mobile-themes").val(ids);
                }

            } else {
                if (tag == "#ddTreeAreas") {
                    $(".areasTree-input").val("");
                    $("#areas").val("");

                } else if (tag == "#mobile-ddTreeAreas") {
                    $(".mobileAreasTree-input").val("");
                    $("#mobile-areas").val("");

                } else if (tag == "#ddTreeThemes") {
                    $(".themesTree-input").val("");
                    $("#themes").val("");

                } else if (tag == "#mobile-ddTreeThemes") {
                    $(".mobileThemesTree-input").val("");
                    $("#mobile-themes").val("");
                }
            }
        }
    });
}

// Make Title
function getSearchTitle(searchText, startYear, areas, themes, startADBC) {

    var title = "";

    if (startYear == "" && areas == "" && themes == "" && searchText !== "") {
        title = "Events relating to " + searchText;
    } else if (startYear == "" && areas == "" && themes == "" && searchText == "") {
        title = "All Events";
    } else {
        let selectedAreas = getSelectedAreas();
        let selectedThemes = getSelectedThemes();

        if (searchText == "") {
            if (startYear == "") {
                title = "Events in " + selectedAreas + " for " + selectedThemes;
            } else {
                if (startADBC == "bc") {
                    startYear = startYear.toString().replace("-", "") + " BC";
                }
                title = "Events from " + startYear + " in " + selectedAreas + " for " + selectedThemes;
            }
        } else {
            if (startYear == "") {
                title = "Events relating to " + searchText + " in " + selectedAreas + " for " + selectedThemes;
            } else {
                if (startADBC == "bc") {
                    startYear = startYear.toString().replace("-", "") + " BC";
                }
                title = "Events relating to " + searchText + " from " + startYear + " in " + selectedAreas + " for " + selectedThemes;
            }
        }
    }

    return title;
}

function getSelectedAreas() {
    var areas = $("#areas").val();

    var areasCategories = [];

    let category_1_codes = [];

    $.each(areasArray, (i, el) => {
        // Get Areas Codes on level 1
        category_1_codes.push(el.level_1_code);
    });

    // Remove repeated values in Array
    category_1_codes = getUniqueArray(category_1_codes);

    $.each(category_1_codes, (i, category_1_code) => {
        let category_1 = [];
        let category_2_arr = [];

        let areas_id_arr_in_category_1 = [];

        let category_1_title = '';
        let category_2_title = '';

        let category_2_codes = [];

        $.each(areasArray, (j, el) => {
            if (category_1_code == el.level_1_code) {
                areas_id_arr_in_category_1.push(el.id);
                category_1_title = el.level_1_title;
                category_2_codes.push(el.level_2_code);
            }
        });

        category_1['title'] = category_1_title;
        category_1['area_ids'] = areas_id_arr_in_category_1;

        category_2_codes = getUniqueArray(category_2_codes);

        $.each(category_2_codes, (j, category_2_code) => {
            let category_2 = [];
            let category_3_arr = [];
            let areas_id_arr_in_category_2 = [];

            $.each(areasArray, (k, el) => {
                let category_3 = [];
                if (category_2_code == el.level_2_code && category_1_code == el.level_1_code) {
                    areas_id_arr_in_category_2.push(el.id);
                    category_2_title = el.level_2_title;
                    category_3['id'] = el.id;
                    category_3['title'] = el.level_3_title;
                    category_3_arr.push(category_3);
                }
            });
            category_2['title'] = category_2_title;
            category_2['area_ids'] = areas_id_arr_in_category_2;
            category_2['category_3'] = category_3_arr;

            category_2_arr.push(category_2);
        });
        category_1['category_2'] = category_2_arr;

        areasCategories.push(category_1);
    });

    var str = "";
    var j = 0;
    if (areas.length > 0) {
        $.each(areasCategories, (i, el) => {
            let areaIds = (el.area_ids).toString();
            if (areas.includes(areaIds)) {
                areas = areas.replace(areaIds, "");
                str += el.title + ", ";
                j++;
            }
        });
        if (j == areasCategories.length) {
            str = "All Areas";
        }
        
        if (areas.length == 1 && areas == ",") {
            areas = "";
        }
    
        if (areas.length > 0) {
            $.each(areasCategories, (i, el) => {
                $.each(el.category_2, (j, category_2) => {
                    let areaIds = (category_2.area_ids).toString();
                    if (areas.includes(areaIds)) {
                        areas = areas.replace(areaIds, "");
                        str += category_2.title + ", ";
                    }
                });
            });
        }
    
        if (areas.length == 1 && areas == ",") {
            areas = "All Areas";
        }
    
        if (areas.length > 0) {
    
            areas = areas.split(",");
    
            $.each(areasCategories, (i, el) => {
                $.each(el.category_2, (j, category_2) => {
                    $.each(category_2.category_3, (k, category_3) => {
                        areaId = (category_3.id).toString();
                        if (areas.includes(areaId)) {
                            str += category_3.title + ", ";
                        }
                    });
                });
            });
        }
    
        str = str.trim();
        var outputText = str.substring(0, str.length - 1);
    } else {
        outputText = "All Areas";
    }
    
    return outputText;
}

function getSelectedThemes() {
    var themes = $("#themes").val();

    var themesCategories = [];

    var level_1_codes = [];
    $.each(themesArray, (i, el) => {
        level_1_codes.push(el.level_1_code);
    });

    level_1_codes = getUniqueArray(level_1_codes);

    $.each(level_1_codes, (i, level_1_code) => {

        let level_1_title = '';
        let level_1_ids = [];
        let level_1 = [];

        let level_2_arr = [];
        $.each(themesArray, (j, el) => {
            let level_2 = [];
            if (level_1_code == el.level_1_code) {
                level_1_ids.push(el.id);
                level_1_title = el.level_1_title;

                level_2['theme_id'] = el.id;
                level_2['sub_theme_title'] = el.level_2_title;

                level_2_arr.push(level_2);
            }
        });

        level_1['theme_title'] = level_1_title;
        level_1['theme_ids'] = level_1_ids;
        level_1['sub_themes'] = level_2_arr;

        themesCategories.push(level_1);
    });

    if (themes.length > 0) {
        var str = "";
        var j = 0;
    
        $.each(themesCategories, (i, el) => {
            let themeIds = (el.theme_ids).toString();
            if (themes.includes(themeIds)) {
                themes = themes.replace(themeIds, "");
                str += el.theme_title + ", ";
                j++;
            }
        });
        if (j == themesCategories.length) {
            str = "All Themes";
        }
        
        if (themes.length == 1 && themes == ",") {
            themes = "";
        }
    
        if (themes.length > 0) {
    
            themes = themes.split(",");
            
            $.each(themesCategories, (i, el) => {
                $.each(el.sub_themes, (j, sub_theme) => {
                    themeId = (sub_theme.theme_id).toString();
                    if (themes.includes(themeId)) {
                        str += sub_theme.sub_theme_title + ", ";
                    }
                });
            });
        }
    
        str = str.trim();
        var outputText = str.substring(0, str.length - 1);
    } else {
        outputText = "All Themes";
    }

    return outputText;
}

// Zoom img
function imgEnlarge(el) {

    let imgUrl = $(el).attr('src');
    $('#imgEnlargeModal').css("display", "flex");

    $("#imgEnlargeModal img").attr("src", imgUrl);
}

function getUniqueArray(arrayData) {

    var uniqueArray = []
    $.each(arrayData, function(i, el) {
        if ($.inArray(el, uniqueArray) === -1) uniqueArray.push(el);
    });

    return uniqueArray;
}


function getIdByLevel1(arrayData, title1) {

    var id = 0;

    $.each(arrayData, function(i, el) {
        if (el.level_1_title === title1) {
            id = el.id;
        }
    });

    return id;
}


function getIdByLevel2(arrayData, title2) {

    var id = 0;

    $.each(arrayData, function(i, el) {
        if (el.level_2_title === title2) {
            id = el.id;
        }
    });

    return id;
}


function treeAdjust(tagName) {

    $("." + tagName + "-input").on("click", function() {
        if ($("." + tagName + "-menu").find("i[class*='sim-tree-spread']").hasClass("sim-icon-d")) {
            $("." + tagName + "-menu").find("i[class*='sim-tree-spread']").removeClass("sim-icon-d");
            $("." + tagName + "-menu").find("i[class*='sim-tree-spread']").addClass("sim-icon-r");
        }
        $("." + tagName + "-menu").find("ul").removeClass("show");
    });
}

/**
 * hide loading spinner
 * 
 * @return void
 */
 var hideSpinner = function() {
    $(".spinner-box").hide();
}

/**
 * show loading spinner
 * 
 * @return void
 */
var showSpinner = function() {
    $(".spinner-box").show();
}

/**
 * show pagination
 * 
 * @return void
 */
var paginationShow = function() {
    $(".historyworld-pagination").show();
}

/**
 * hide pagination
 * 
 * @return void
 */
var paginationHide = function() {
    $(".historyworld-pagination").hide();
}

/**
 * hide all collapse/expand button
 * 
 * @return void
 */
function all_collapse_expand_icon_hide() {
    $("#all_collapse_btn").hide();
}

/**
 * show all collapse/expand button
 * 
 * @return void
 */
function all_collapse_expand_icon_show() {
    $("#all_collapse_btn").show();
}

/**
 * fetch all areas and output to DOM
 * 
 * @param areasUrl
 */
getRequestData(areasUrl).then((areasArrayObject) => {

    areasArray = areasArrayObject.data;
    var areaLevel1 = [];
    var uniqueAreaLevel1 = [];
    var areaLevel2_rows = [];
    var uniqueAreaLevel2_num = [];
    var areaTreeArray = [];
    var level1_id = 0;

    $.each(areasArray, function(i, el) {
        areaLevel1.push(el.level_1_title);
    });

    uniqueAreaLevel1 = getUniqueArray(areaLevel1);

    $.each(areasArray, function(i, el) {
        areaLevel2_rows.push(el.level_2_title);
    });

    uniqueAreaLevel2_num = getUniqueArray(areaLevel2_rows);

    var uniqueTotalLength = uniqueAreaLevel1.length + uniqueAreaLevel2_num.length;
    var level2_id = uniqueAreaLevel1.length;

    $.each(uniqueAreaLevel1, function(i, elUniqueLevel1) {
        var areasArrayResultLevel1 = [];
        var areaLevel2 = [];
        var uniqueAreaLevel2 = [];
        level1_id += 1;

        $.each(areasArray, function(i, elAreas) {
            if (elAreas.level_2_title !== null) {
                if (elUniqueLevel1 === elAreas.level_1_title) areaLevel2.push(elAreas.level_2_title);
            }
        });

        if (areaLevel2.length > 1) {
            areasArrayResultLevel1['id'] = level1_id;
            areasArrayResultLevel1['pid'] = '';
            areasArrayResultLevel1['name'] = elUniqueLevel1;
            areaTreeArray.push(areasArrayResultLevel1);
            uniqueAreaLevel2 = getUniqueArray(areaLevel2);
            $.each(uniqueAreaLevel2, function(i, elUniqueLevel2) {

                var areasArrayResultLevel2 = [];
                var areaLevel3 = [];
                level2_id += 1;

                $.each(areasArray, function(i, elAreas) {
                    if (elAreas.level_3_title !== null) {
                        if (elUniqueLevel2 === elAreas.level_2_title) {
                            areaLevel3Detail = [];
                            areaLevel3Detail['id'] = uniqueTotalLength + elAreas.id;
                            areaLevel3Detail['pid'] = level2_id;
                            areaLevel3Detail['name'] = elAreas.level_3_title;
                            areaLevel3.push(areaLevel3Detail);
                            areaTreeArray.push(areaLevel3Detail);
                        }
                    }
                });

                if (areaLevel3.length > 1) {
                    areasArrayResultLevel2['id'] = level2_id;
                } else {
                    areasArrayResultLevel2['id'] = uniqueTotalLength + getIdByLevel2(areasArray, elUniqueLevel2);
                }
                areasArrayResultLevel2['pid'] = level1_id;
                areasArrayResultLevel2['name'] = elUniqueLevel2;
                areaTreeArray.push(areasArrayResultLevel2);

            });
        } else {
            areasArrayResultLevel1['id'] = uniqueTotalLength + getIdByLevel1(areasArray, elUniqueLevel1);
            areasArrayResultLevel1['pid'] = '';
            areasArrayResultLevel1['name'] = elUniqueLevel1;
            areaTreeArray.push(areasArrayResultLevel1);
        }
    });

    dropDownTree("areas", "#ddTreeAreas", areaTreeArray, uniqueTotalLength);
    dropDownTree("areas", "#mobile-ddTreeAreas", areaTreeArray, uniqueTotalLength);
});


/**
 * fetch all themes and output to DOM
 * 
 * @param {String} themesUrl
 */
getRequestData(themesUrl).then((themesArrayObject) => {

    themesArray = themesArrayObject.data;
    var themeLevel1 = [];
    var uniqueThemeLevel1 = [];
    var themeTreeArray = [];
    var level1_id = 0;

    $.each(themesArray, function(i, el) {
        themeLevel1.push(el.level_1_title);
    });

    uniqueThemeLevel1 = getUniqueArray(themeLevel1);

    $.each(uniqueThemeLevel1, function(i, elUniqueLevel1) {
        var themesArrayResultLevel1 = [];
        var themeLevel2 = [];
        level1_id += 1;

        $.each(themesArray, function(i, elThemes) {
            if (elThemes.level_2_title !== null) {
                if (elUniqueLevel1 === elThemes.level_1_title) themeLevel2.push(elThemes.level_2_title);
            }
        });

        if (themeLevel2.length > 1) {
            themesArrayResultLevel1['id'] = level1_id;
            themesArrayResultLevel1['pid'] = '';
            themesArrayResultLevel1['name'] = elUniqueLevel1;
            themeTreeArray.push(themesArrayResultLevel1);

            $.each(themesArray, function(i, elThemes) {
                if (elThemes.level_2_title !== null) {
                    if (elUniqueLevel1 === elThemes.level_1_title) {
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

/**
 * fetch all search tags and output to html DOM them.
 * 
 * @param {String} tagsUrl
 */
getRequestData(tagsUrl).then((res) => {

    var tagsHtml = "";

    $.each(res.data, (i, el) => {
        tagsHtml += "<option value='" + el.id + "'>" + el.tag + "</option>";
    });

    $("#tags").html(tagsHtml);
});


async function loadEvents(query, page_num, flag) {

    tempQuery = query;
    var queryString = "";

    if (page_num !== "") {
        queryString += "&page=" + page_num;
    } else {
        queryString += "&page=1";
    }

    // if (query !== "") {
    //     var eventsUrl = "/api/events/query/" + queryString + query;
    // } else {
    //     var eventsUrl = "/api/events/all/" + queryString;
    // }

    if (query !== "") {
        var eventsUrl = "/api/events/" + queryString + query;
    } else {
        var eventsUrl = "/api/events/" + queryString;
    }

    var eventsArrayObject = await getRequestData(eventsUrl);

    var eventsArray = eventsArrayObject.data;
    var eventsMeta = eventsArrayObject.meta;
    var eventsTotalPages = eventsMeta['last_page'];
    var eventsCard = '';
    var currentPage = eventsMeta['current_page'];

    $.each(eventsArray, function(i, el) {

        let eventThumbnail = "";
        let imageHintIcon = "";
        let eventMainImage = "";
        let historyworldLinkIcon = "";
        let placeLinkIcon = "";
        let googleMapLinkIcon = "";
        let eventMainImageUrl = "";
        let eventMainImageCaption = "";
        let historyworldLink = "";
        let googleMapLink = "";
        let externalLinks = "";   
        let generticLinkIcon = "";
        let wikiLinkIcon = "";

        if ((el.images).length > 0) {
            imageHintIcon = '<a href="javascript:void(0)"><i class="fa fa-image"></i></a>';
            eventThumbnail = `<img class='event-thumbnail' src='${el.images[0].thumbnail_url}' />`;
            eventMainImage = `<img class='event-mainimage' src='${el.images[0].url}' />`;
            eventMainImageUrl = el.images[0].url;
            eventMainImageCaption = el.images[0].caption;
        }

        if (el.place_link !== null) {
            historyworldLinkIcon = '<a href="javascript:void(0)"><i class="hw-icon"></i></a>';
            historyworldLink = '<a href="' + el.place_link + '" class="event-link" target="_blank" style="display: block"><i class="hw-icon"></i> ' + el.history_world_link + '</a>';
        }


        if (el.google_map_link !== null) {
            googleMapLinkIcon = '<a href="javascript:void(0)" ><i class="fa fa-map-pin"></i></a>';
            googleMapLink = '<a href="' + el.google_map_link + '" class="event-link" target="_blank" style="display: block"><i class="fa fa-map-pin"></i> Look at location for event</a>'
        }

        if ((el.links).length > 0) {
            let linkObj = el.links;
            for (j = 0; j < linkObj.length; j++) {
                if (linkObj[j].url.includes("en.wikipedia.org")) {
                    wikiLinkIcon = '<a href="javascript:void(0)"><i class="fa fa-wikipedia-w"></i></a>';
                    break;
                }
            };

            for (j = 0; j < linkObj.length; j++) {
                if (!linkObj[j].url.includes("en.wikipedia.org")) {
                    generticLinkIcon = '<a href="javascript:void(0)"><i class="icofont-link" style="font-size: 18px;"></i></a>';
                    break;
                }
            };
        }

        if ((el.links).length > 0) {
            $.each(el.links, (j, hyperlink) => {
                if (hyperlink.url.includes("en.wikipedia.org")) {
                    externalLinks += '<a href="' + hyperlink.url + '" target="_blank" style="display: block"><i class="fa fa-wikipedia-w"></i> ' + hyperlink.url + '</a>';
                } else {
                    externalLinks += '<a href="' + hyperlink.url + '" target="_blank" style="display: block"><i class="icofont-link" style="font-size: 18px;"></i> ' + hyperlink.url + '</a>'
                }
            });
        }
        

        let eventYear = el.event_year_text;
        let eventTitle = el.event;
        let eventContent = el.event_long;

        if ((el.images).length > 0) {
            eventsCard += '<div class="card">'
                                + '<h5 class="card-header collapsed d-block mt-0" role="tab" id="heading' + i + '" data-toggle="collapse" data-parent="#accordion" aria-controls="collapse' + i + '" aria-expanded="false" href="#collapse' + i + '">'
                                        + '<div class="row">'
                                            + '<div class="col-lg-9">'
                                                    + '<a href="javascript:void(0)">' + el.event_year_text + '<br>' + eventTitle + '</a>'
                                                    + '<span class="alignb">'
                                                        + imageHintIcon
                                                        + historyworldLinkIcon
                                                        + googleMapLinkIcon
                                                        + wikiLinkIcon
                                                        + generticLinkIcon
                                                    + '</span>'
                                                + '</div>'
                                            + '<div class="col-lg-3">' + eventThumbnail + '</div>'
                                        + '</div>'
                                + '</h5>'
                                + '<div id="collapse' + i + '" class="collapse multi-collapse" role="tabpanel" aria-labelledby="heading' + i + '">'
                                    + '<div class="card-body">'
                                        + '<div class="row">'
                                            + '<div class="col-md-4" style="text-align: center">'
                                                + '<img src="' + eventMainImageUrl + '" style="width: 100%;cursor: zoom-in" onclick="imgEnlarge(this)"/>'
                                                + '<a href="javascript:void(0)" class="gallery-caption"><span>' + eventMainImageCaption + '</span></a>'
                                            + '</div>'
                                            + '<div class="col-md-8">'
                                                + '<p style="margin-bottom: 0;">' + eventContent + '</p>'
                                                + '<div class="alignb">'
                                                    + historyworldLink
                                                    + externalLinks
                                                    + googleMapLink
                                                + '</div>'
                                            + '</div>'
                                        + '</div>'
                                    + '</div>'
                                + '</div>'
                            + '</div>';
        } else {
            eventsCard += '<div class="card">'
                                + '<h5 class="card-header collapsed d-block mt-0" role="tab" id="heading' + i + '" data-toggle="collapse" data-parent="#accordion" aria-controls="collapse' + i + '" aria-expanded="false" href="#collapse' + i + '">'
                                    + '<div class="row">'
                                        + '<div class="col-lg-12"><a href="javascript:void(0)">' + el.event_year_text + '<br>' + eventTitle + '</a>'
                                            + '<span class="alignb">'
                                                + historyworldLinkIcon
                                                + googleMapLinkIcon
                                                + wikiLinkIcon
                                                + generticLinkIcon
                                            + '</span>'
                                        + '</div>'
                                    + '</div>'
                                + '</h5>'
                                + '<div id="collapse' + i + '" class="collapse multi-collapse" role="tabpanel" aria-labelledby="heading' + i + '">'
                                    + '<div class="card-body">'
                                        + '<div class="row">'
                                            + '<div class="col-md-12">'
                                                + '<p style="margin-bottom: 0;">' + eventContent + '</p>'
                                                + '<div class="alignb">'
                                                    + historyworldLink
                                                    + googleMapLink
                                                    + externalLinks
                                                + '</div>'
                                            + '</div>'
                                        + '</div>'
                                    + '</div>'
                                + '</div>'
                            + '</div>';
        }
    });

    $("#events").html(eventsCard);

    hideSpinner();

    if (screen.width < 990) {
        $('#pagination').twbsPagination({
            totalPages: eventsTotalPages,
            visiblePages: 3,
            next: '<i class="fa fa-angle-double-right" style="width: 20px"></i>',
            prev: '<i class="fa fa-angle-double-left" style="width: 20px"></i>',
            first: "<i class='fa fa-angle-left' style='width: 20px'></i>",
            last: "<i class='fa fa-angle-right' style='width: 20px'></i>",
            onPageClick: function(event, page) {
                loadEvents(tempQuery, page);
            }
        });
    } else {
        $('#pagination').twbsPagination({
            totalPages: eventsTotalPages,
            visiblePages: 3,
            next: 'Next',
            prev: 'Previous',
            onPageClick: function(event, page) {
                loadEvents(tempQuery, page);
            }
        });
    }

    if (eventsTotalPages <= 1) {
        paginationHide();
    } else {
        paginationShow();
    }
}

async function getFeaturedEvents(timeline_id, timeline_title) {

    var eventsUrl = "/api/events/featured/" + timeline_id;

    var eventsArrayObject = await getRequestData(eventsUrl);

    var eventsArray = eventsArrayObject.data;
    var eventsMeta = eventsArrayObject.meta;
    var eventsCard = '';

    $.each(eventsArray, function(i, el) {

        let eventThumbnail = "";
        let imageHintIcon = "";
        let eventMainImage = "";
        let historyworldLinkIcon = "";
        let placeLinkIcon = "";
        let googleMapLinkIcon = "";
        let eventMainImageUrl = "";
        let eventMainImageCaption = "";
        let historyworldLink = "";
        let googleMapLink = "";
        let externalLinks = "";   
        let generticLinkIcon = "";
        let wikiLinkIcon = "";
        
        if ((el.images).length > 0) {
            imageHintIcon = '<a href="javascript:void(0)"><i class="fa fa-image"></i></a>';
            eventThumbnail = `<img class='event-thumbnail' src='${el.images[0].thumbnail_url}' />`;
            eventMainImage = `<img class='event-mainimage' src='${el.images[0].url}' />`;
            eventMainImageUrl = el.images[0].url;
            eventMainImageCaption = el.images[0].caption;
        }

        if (el.place_link !== null) {
            historyworldLinkIcon = '<a href="javascript:void(0)"><i class="hw-icon"></i></a>';
            historyworldLink = '<a href="' + el.place_link + '" class="event-link" style="display: block" target="_blank"><i class="hw-icon"></i> ' + el.history_world_link + '</a>';
        }

        if (el.google_map_link !== null) {
            googleMapLinkIcon = '<a href="javascript:void(0)" ><i class="fa fa-map-pin"></i></a>';
            googleMapLink = '<a href="' + el.google_map_link + '" class="event-link" style="display: block" target="_blank"><i class="fa fa-map-pin"></i> Look at location for event</a>'
        }

        if ((el.links).length > 0) {
            let linkObj = el.links;
            for (j = 0; j < linkObj.length; j++) {
                if (linkObj[j].url.includes("en.wikipedia.org")) {
                    wikiLinkIcon = '<a href="javascript:void(0)"><i class="fa fa-wikipedia-w"></i></a>';
                    break;
                }
            };

            for (j = 0; j < linkObj.length; j++) {
                if (!linkObj[j].url.includes("en.wikipedia.org")) {
                    generticLinkIcon = '<a href="javascript:void(0)"><i class="icofont-link" style="font-size: 18px;"></i></a>';
                    break;
                }
            };
        }

        if ((el.links).length > 0) {
            $.each(el.links, (j, hyperlink) => {
                if (hyperlink.url.includes("en.wikipedia.org")) {
                    externalLinks += '<a href="' + hyperlink.url + '" target="_blank" style="display: block" ><i class="fa fa-wikipedia-w"></i> ' + hyperlink.url + '</a>';
                } else {
                    externalLinks += '<a href="' + hyperlink.url + '" target="_blank" style="display: block" ><i class="icofont-link" style="font-size: 18px;"></i> ' + hyperlink.url + '</a>'
                }
            });
        }

        let eventYear = el.event_year_text;
        let eventTitle = el.event;
        let eventContent = el.event_long;

        if ((el.images).length > 0) {
            eventsCard += '<div class="card">'
                            + '<h5 class="card-header collapsed d-block mt-0" role="tab" id="heading' + i + '" data-toggle="collapse" data-parent="#accordion" aria-controls="collapse' + i + '" aria-expanded="false" href="#collapse' + i + '">'
                                + '<div class="row">'
                                    + '<div class="col-lg-9">'
                                        + '<a href="javascript:void(0)">' + el.event_year_text + '<br>' + eventTitle + '</a>'
                                            + '<span class="alignb">'
                                                + imageHintIcon
                                                + historyworldLinkIcon
                                                + googleMapLinkIcon
                                                + wikiLinkIcon
                                                + generticLinkIcon
                                            + '</span>'
                                        + '</div>'
                                    + '<div class="col-lg-3">' + eventThumbnail + '</div>'
                                + '</div>'
                            + '</h5>'
                            + '<div id="collapse' + i + '" class="collapse multi-collapse" role="tabpanel" aria-labelledby="heading' + i + '">'
                                + '<div class="card-body">'
                                    + '<div class="row">'
                                        + '<div class="col-md-4" style="text-align: center">'
                                            + '<img src="' + eventMainImageUrl + '" style="width: 100%;cursor: zoom-in" onclick="imgEnlarge(this)"/>'
                                            + '<a href="javascript:void(0)" class="gallery-caption"><span>' + eventMainImageCaption + '</span></a>'
                                        + '</div>'
                                    + '<div class="col-md-8">'
                                    + '<p style="margin-bottom: 0;">' + eventContent + '</p>'
                                    + '<div class="alignb">'
                                        + historyworldLink
                                        + externalLinks
                                        + googleMapLink
                                    + '</div>'
                                +'</div>'
                            + '</div>'
                        + '</div>'
                    +'</div>'
                + '</div>';
        } else {
            eventsCard += '<div class="card">'
                            + '<h5 class="card-header collapsed d-block mt-0" role="tab" id="heading' + i + '" data-toggle="collapse" data-parent="#accordion" aria-controls="collapse' + i + '" aria-expanded="false" href="#collapse' + i + '">'
                                + '<div class="row">'
                                    + '<div class="col-lg-12"><a href="javascript:void(0)">' + el.event_year_text + '<br>' + eventTitle + '</a>'
                                        + '<span class="alignb">'
                                            + historyworldLinkIcon
                                            + googleMapLinkIcon
                                            + wikiLinkIcon
                                            + generticLinkIcon
                                        + '</span>'
                                    + '</div>'
                                + '</div>'
                            + '</h5>'
                            + '<div id="collapse' + i + '" class="collapse multi-collapse" role="tabpanel" aria-labelledby="heading' + i + '">'
                                + '<div class="card-body">'
                                    + '<div class="row">'
                                        + '<div class="col-md-12">'
                                            + '<p style="margin-bottom: 0;">' + eventContent + '</p>'
                                            + '<div class="alignb">'
                                                + historyworldLink
                                                + externalLinks
                                                + googleMapLink
                                            + '</div>'
                                    + '</div>'
                                + '</div>'
                            + '</div>'
                        + '</div>'
                + '</div>';
        }
    });

    all_collapse_expand_icon_show();
    $("#featured_title").html(timeline_title + ' timeline');
    $("#featured_events").html(eventsCard);

    hideSpinner();
}

$(document).ready(function() {
    $(".btn-default.btn-off-1").addClass("active-swtich-btn");
    loadEvents("", ""); // LOAD ALL HISTORYWORLD EVENTS

    // switch search panel mode
    $("#historyworld_search_panel_swtich").on("click", function() {
        if ($("#featured").prop("checked")) {

            $("#advanced_search").hide();                          // HIDE ADVANCED SEARCH

            $("#featured_title").removeClass("d-none");            // FEATURED SEARCH TITLE
            $("#search_title").addClass("d-none");                 // HIDE ALL VIEW SEARCH TITLE

            $("#all_view_text_search").addClass("d-none");         // HIDE ALL VIEW [TEXT SEARCH TERM]
            $("#featued_view_text_search").removeClass("d-none");  // SHOW FEATURED VIEW [TEXT SEARCH TERM]
            
            $("#featured_events").removeClass("d-none");
            $("#events").addClass("d-none");

            all_collapse_expand_icon_hide();                       // HIDE ALL CARDS EXPAND ICON ON FEATURED VIEW MODE
            loadFeaturedTimelines();                               // OUTPUT FEATURED TIMELINES TO FEATUED VIEW
            paginationHide();                                      // HIDE PAGINATION ON FEATURED VIEW MODE 

            $(".btn-default.btn-on-1").addClass("active-swtich-btn");
            $(".btn-default.btn-off-1").removeClass("active-swtich-btn");
        } else {
            
            $("#advanced_search").show();                          // show advanced search terms

            $("#featured_title").addClass("d-none");               // hide [featured mode title]
            $("#search_title").removeClass("d-none");              // show [all view mode title]

            $("#all_view_text_search").removeClass("d-none");      // Show Text Search for All View
            $("#featued_view_text_search").addClass("d-none");      // Hide Text Search for Featured View

            $("#featured_events").addClass("d-none");
            $("#events").removeClass("d-none");

            historyworldSearch();                                  // run this function for get all events on all view mode
            all_collapse_expand_icon_show();
            paginationShow();

            $(".btn-default.btn-on-1").removeClass("active-swtich-btn");
            $(".btn-default.btn-off-1").addClass("active-swtich-btn");
        }
    });

    // collapse / expand all cards
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

    // run searching by enter keypress event
    $("#text_all_search").on("keyup", function(e) {
        if (e.keyCode === 13) {
            historyworldSearch();
        }
    });

    // check number input, if not number, return;
    $("#start_year, #end_year").on("keypress", function(e) {
        // Only ASCII charactar in that range allowed 
        var ASCIICode = (e.which) ? e.which : e.keyCode
        if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
            return false;
        return true;
    });
});