"use strict"
var areasUrl = "/api/areas";                         // request url for fetching all areas
var themesUrl = "/api/themes";                       // request url for fetching all themes
var tagsUrl = "/api/tags";                           // request url for fetching all tags
var timelinesUrl = "/api/timelines";                 // request url for fetching all featured timelines

/**
 * async get request common function
 * @param {String} url
 * @return json
 */
async function getRequest(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
        }).done((response) => {
            resolve(response);
        }).fail((error) => {
            console.error("fetch error :", error)
        })
    })
}

/**
 * Clear Search Form
 */
function clearSearchForm() {
    // search froms as an array
    const searchForms = ['#pc_search_terms', '#mobile_search_terms'];

    // clear all input field in a form
    $.each(searchForms, (index, frm) => {
        $(frm).find('input').each(function() {
            $(this).val('');
        });
        $(frm).find('.s-default-input').each(function() {
            $(this).prop('checked', true);
        })
        $(frm).find('.s-not-default-input').each(function() {
            $(this).prop('checked', false);
        })
        $(frm).find('.s-default-label').each(function() {
            $(this).addClass('active');
        })
        $(frm).find('.s-not-default-label').each(function() {
            $(this).removeClass('active');
        })
    });

    $(".historyworld-events-container").html(
        "<h6>Search for text, or enter a year and choose themes and areas, then click 'apply'.</h6>\
        <h6 style='margin-top: .1rem'>You may also swap back to <a href='/featured-timelines' target='_self'>Featured Timelines</a></h6>"
    );
    $("#pagination").css('display', 'none');
    $(".timeline-title").css('display', 'none');
}

/* All Search Form */
/**
 * draw areas DOM
 * 
 * @param areasUrl
 */
async function drawAreasTree(selectedAreas) {
    var selectedAreasArray = selectedAreas.split('-');

    var areasArray = await getRequest(areasUrl).then((result) => result.data);
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
            areasArrayResultLevel1['id'] = 'a'+level1_id;
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
                            let areaLevel3Detail = [];
                            areaLevel3Detail['id'] = 'a'+ (uniqueTotalLength + elAreas.id);
                            areaLevel3Detail['pid'] = 'a' + level2_id;
                            areaLevel3Detail['name'] = elAreas.level_3_title;

                            // if id is contained in selected ids, checked
                            if(selectedAreasArray.indexOf(elAreas.id.toString()) > -1){
                                areaLevel3Detail['checked'] = true;
                            }
                            areaLevel3.push(areaLevel3Detail);
                            areaTreeArray.push(areaLevel3Detail);
                        }
                    }
                });

                if (areaLevel3.length > 1) {
                    areasArrayResultLevel2['id'] = 'a' + level2_id;
                } else {
                    areasArrayResultLevel2['id'] = 'a' + (uniqueTotalLength + getIdByLevel2(areasArray, elUniqueLevel2));
                }
                areasArrayResultLevel2['pid'] = 'a' + level1_id;
                areasArrayResultLevel2['name'] = elUniqueLevel2;
                areaTreeArray.push(areasArrayResultLevel2);

            });
        } else {
            areasArrayResultLevel1['id'] = 'a' + (uniqueTotalLength + getIdByLevel1(areasArray, elUniqueLevel1));
            areasArrayResultLevel1['pid'] = '';
            areasArrayResultLevel1['name'] = elUniqueLevel1;
            if($.inArray(getIdByLevel1(areasArray, elUniqueLevel1).toString(), selectedAreasArray) > -1){
                areasArrayResultLevel1['checked'] = true;
            }
            areaTreeArray.push(areasArrayResultLevel1);
        }
    });

    dropDownTree("areas", "#ddTreeAreas", areaTreeArray, uniqueTotalLength);
    dropDownTree("areas", "#mobile-ddTreeAreas", areaTreeArray, uniqueTotalLength);
}


/**
 * fetch all themes and output to DOM
 * 
 * @param {String} themesUrl
 */
async function drawThemesTree(selectedThemes) {
    var selectedThemesArray = selectedThemes.split('-');

    var themesArray = await getRequest(themesUrl).then((result) => result.data);

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
            themesArrayResultLevel1['id'] = 't' + level1_id;
            themesArrayResultLevel1['pid'] = '';
            themesArrayResultLevel1['name'] = elUniqueLevel1;
            themeTreeArray.push(themesArrayResultLevel1);

            $.each(themesArray, function(i, elThemes) {
                if (elThemes.level_2_title !== null) {
                    if (elUniqueLevel1 === elThemes.level_1_title) {
                        let themeLevel2Detail = [];
                        themeLevel2Detail['id'] = 't' + (uniqueThemeLevel1.length + elThemes.id);
                        themeLevel2Detail['pid'] = 't' + level1_id;
                        themeLevel2Detail['name'] = elThemes.level_2_title;
                        // if id is contained in selected ids, checked
                        if($.inArray((elThemes.id).toString(), selectedThemesArray) > -1){
                            themeLevel2Detail['checked'] = true;
                        }

                        themeTreeArray.push(themeLevel2Detail);
                    }
                }
            });

        } else {
            themesArrayResultLevel1['id'] = 't' + (uniqueThemeLevel1.length + getIdByLevel1(themesArray, elUniqueLevel1));
            themesArrayResultLevel1['pid'] = '';
            themesArrayResultLevel1['name'] = elUniqueLevel1;
            themeTreeArray.push(themesArrayResultLevel1);
        }
    });

    dropDownTree("themes", "#ddTreeThemes", themeTreeArray, uniqueThemeLevel1.length);
    dropDownTree("themes", "#mobile-ddTreeThemes", themeTreeArray, uniqueThemeLevel1.length);
}


/**
 * fetch all search tags and output to html DOM them.
 * 
 * @param {String} tagsUrl
 */
 getRequest(tagsUrl).then((res) => {
    var tagsHtml = "";
    $.each(res.data, (i, el) => {
        tagsHtml += "<option value='" + el.id + "'>" + el.tag + "</option>";
    });
    $("#tags").html(tagsHtml);
});

/** common functions */

function dropDownTree(search_option, tag, list, uniqueTotalLength) {
    var tree = simTree({
        el: tag,
        data: list,
        check: true,
        linkParent: true,
        onClick: function(item) {
            //shows when page is onloaded
            simTreeValueInit(item, tag, uniqueTotalLength);
        },
        onChange: function(item) {
            simTreeValueInit(item, tag, uniqueTotalLength);
        }
    });
}

function simTreeValueInit(item, tag, uniqueTotalLength) {
    var ids = "";
    var items = 0;
    var conditionLength = 0;
    conditionLength = uniqueTotalLength;

    $.each(item, function(i, el) {
        let element = 0;
        if (parseInt(el['id'].replace( /\D+/g, '')) > conditionLength) {
            element = parseInt(el['id'].replace( /\D+/g, '')) - conditionLength;
            ids += element + ",";
            items += 1;
        }
    });

    ids = ids.slice(0, -1);

    if (items !== 0) {
        if (tag == "#ddTreeAreas") {
            $(".areasTree-input").val(items + " items selected");
            $("#areas").val(ids.split(',').join('-'));

        } else if (tag == "#mobile-ddTreeAreas") {
            console.log("===")
            $(".mobileAreasTree-input").val(items + " items selected");
            $("#mobile-areas").val(ids.split(',').join('-'));

        } else if (tag == "#ddTreeThemes") {
            $(".themesTree-input").val(items + " items selected");
            $("#themes").val(ids.split(',').join('-'));

        } else if (tag == "#mobile-ddTreeThemes") {
            $(".mobileThemesTree-input").val(items + " items selected");
            $("#mobile-themes").val(ids.split(',').join('-'));
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

function treeAdjust(tagName) {
    $("." + tagName + "-input").on("click", function() {
        if ($("." + tagName + "-menu").find("i[class*='sim-tree-spread']").hasClass("sim-icon-d")) {
            $("." + tagName + "-menu").find("i[class*='sim-tree-spread']").removeClass("sim-icon-d");
            $("." + tagName + "-menu").find("i[class*='sim-tree-spread']").addClass("sim-icon-r");
        }
        $("." + tagName + "-menu").find("ul").removeClass("show");
    });
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

/* Common Functions */
// Zoom img
function imgEnlarge(el) {
    let imgUrl = $(el).attr('src');
    $('#imgEnlargeModal').css("display", "flex");
    $("#imgEnlargeModal img").attr("src", imgUrl);
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

function selectYear(original, toEl, type) {
    var date  = $(original).val();
    if (date) {
        if (type === 'BC') {
            $("input[name='" + toEl + "'").val(-date);
        } else {
            $("input[name='" + toEl + "'").val(date);
        }
    } else {
        $("input[name='" + toEl + "'").val('');
    }
}

function handleYear(el, toEl, typeEl) {
    var date = $(el).val();
    if (date) {
        if ($(typeEl).hasClass('active')) {
            $("input[name='" + toEl + "'").val(date);
        } else {
            $("input[name='" + toEl + "'").val(-date);
        }
    } else {
        $("input[name='" + toEl + "'").val('');
    }

}
// collapse / expand all cards
$("#all_collapse_btn").on("click", function() {
    if ($(".timeline-title .fa").hasClass('chevron-rotate')) {
        $('.multi-collapse').collapse('hide');
        $(".timeline-title .fa").removeClass('chevron-rotate');
    } else {
        $('.multi-collapse').collapse('show');
        $(".timeline-title .fa").addClass('chevron-rotate');
    }
});

/* Paginatoin Javascript */
class HistoryWorldPagination {
    constructor (args) {
        this.searchFrmId = args.searchFrmId;
        this.createPagination(args.pages, args.curPage)
    }

    createPagination (pages, page) {
        if ($("#pagination").length) {
            var str = '<ul>';
            var active;
            var pageCutLow = page - 1;
            var pageCutHigh = page + 1;
            // Show the Previous button only if you are on a page other than the first
            if (page > 1) {
                str += '<li class="page-item previous no"><a onclick="pagination.filter('+(page-1)+', ' + this.searchFrmId + ')">Previous</a></li>';
            }
            // Show all the pagination elements if there are less than 6 pages total
            if (pages < 6) {
                for (let p = 1; p <= pages; p++) {
                    active = page == p ? "active" : "no";
                    str += '<li class="'+active+'"><a onclick="pagination.filter('+p+', ' + this.searchFrmId + ')">'+ p +'</a></li>';
                }
            }
            // Use "..." to collapse pages outside of a certain range
            else {
                // Show the very first page followed by a "..." at the beginning of the
                // pagination section (after the Previous button)
                if (page > 2) {
                    str += '<li class="no page-item"><a onclick="pagination.filter(1, ' + this.searchFrmId + ')">1</a></li>';
                    if (page > 3) {
                        str += '<li class="out-of-range"><a onclick="pagination.filter('+(page-2)+', ' + this.searchFrmId + ')">...</a></li>';
                    }
                }
                // Determine how many pages to show after the current page index
                if (page === 1) {
                    pageCutHigh += 2;
                } else if (page === 2) {
                    pageCutHigh += 1;
                }
                // Determine how many pages to show before the current page index
                if (page === pages) {
                    pageCutLow -= 2;
                } else if (page === pages-1) {
                    pageCutLow -= 1;
                }
                // Output the indexes for pages that fall inside the range of pageCutLow
                // and pageCutHigh
                for (let p = pageCutLow; p <= pageCutHigh; p++) {
                    if (p === 0) {
                        p += 1;
                    }
                    if (p > pages) {
                        continue
                    }
                    active = page == p ? "active" : "no";
                    str += '<li class="page-item '+active+'"><a onclick="pagination.filter('+p+', ' + this.searchFrmId + ')">' + p +'</a></li>';
                }
                // Show the very last page preceded by a "..." at the end of the pagination
                // section (before the Next button)
                if (page < pages-1) {
                    if (page < pages-2) {
                        str += '<li class="out-of-range"><a onclick="pagination.filter(' + (page+2) + ', ' + this.searchFrmId + ')">...</a></li>';
                    }
                    str += '<li class="page-item no"><a onclick="pagination.filter(' + pages + ', ' + this.searchFrmId + ')">'+pages+'</a></li>';
                }
            }
            // Show the Next button only if you are on a page other than the last
            if (page < pages) {
                str += '<li class="page-item next no"><a onclick="pagination.filter(' + (page+1) + ', ' + this.searchFrmId + ')">Next</a></li>';
            }
            str += '</ul>';
            // Return the pagination string to be outputted in the pug templates
            document.getElementById('pagination').innerHTML = str;
        }
    }

    filter(page, searchFrmId) {
        $("<input />").attr("type", "text")
            .attr("name", "page")
            .attr("value", page)
            .appendTo(searchFrmId);
        
        // submit
        $(searchFrmId).submit();
    }
}

// check number input, if not number, return;
$(".historyworld-year").on("keypress", function(e) {
    // Only ASCII charactar in that range allowed 
    var ASCIICode = (e.which) ? e.which : e.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
});

// loader
$(window).on('load', function () {
    hideSpinner();
});
