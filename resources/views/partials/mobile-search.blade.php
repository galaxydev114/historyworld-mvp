 
<!-- Form for search on mobile version  -->
<form action="{{route('timelines.events')}}" method="get" id="mobile_search_terms">
    <div class="card search-card mobile-search-card">
        <h5 class="card-header" role="tab" id="searchCard">
            <a data-toggle="collapse" data-parent="#mobile_search_terms" href="#collapseSearch" aria-expanded="false" aria-controls="collapseSearch" class="collapsed d-block">
                <i class="icofont-search-2"></i> <i class="fa fa-chevron-down pull-right"></i>Search options
            </a>
        </h5>
        <div class="row mt-4 text-center search-form">
            <div class="col-md-12 pl-0 pr-0">
                <!-- <input type="text" id="mobile_text_all_search" class="mobile-text-search form-control" placeholder="Search for text"> -->
                <input type="text" name="q" value="{{ $search_text }}" class="form-control" placeholder="Search for text" autocomplete="off" />
                <!-- <button type="button" class="mobile-textSearch search-magnifying-glass-btn" onclick="historyworldSearch('mobile')"><i class="icofont-search-2"></i></button> -->
            </div>
        </div>
        <div id="collapseSearch" class="collapse" role="tabpanel" aria-labelledby="searchCard">
            <div class="card-body">
                <div class="row">
                    <!-- <div class="col-md-12">
                        <h5 class="sidebar-title float-left">Search Mode</h5>
                        <div class="btn-group float-right" id="historyworld_mobile_search_panel_swtich" data-toggle="buttons">
                            <label class="form-control btn btn-default btn-on-1 btn-sm featuredAll-label">
                            <input type="radio" class="featuredAll" id="mobile_featured" name="featuredAll" >Featured</label>
                            <label class="form-control btn btn-default btn-off-1 btn-sm active featuredAll-label">
                            <input type="radio" class="featuredAll" id="mobile_all" name="featuredAll" checked="checked">All</label>
                        </div>
                    </div> -->
                    <div id="mobile_advanced_search">
                        <div class="col-md-6">
                            <h4 class="text-capitalize">from year</h4>
                            <div class="form-group input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"> <i class="icofont-ui-calendar"></i> </span>
                                </div>
                                <input type="text" id="m-start_year" style="height:38px;" onchange="handleYear(this, 'from', '#m-startYearLabel')" class="form-control historyworld-year search_year" value="{!! preg_replace('/[^0-9]/', '', $date_from) !!}" placeholder="Type Year" autocomplete="off"/>
                                <input type="hidden" name="from" value="{{ $date_from }}" />
                                <div class="btn-group" data-toggle="buttons">
                                    <label class="form-control btn btn-default hw-ad-bc from-adbc-on adbc-label-first s-not-default-label" onclick="selectYear('#m-start_year', 'from', 'BC')" style="border: 1px;">
                                    <input type="radio" class="d-none s-not-default-input" <?php if ($date_from) { echo ($date_from[0] === '-')?'checked':''; } ?>>BC</label>
                                    
                                    <label class="form-control btn btn-default hw-ad-bc from-adbc-off active adbc-label-second s-default-label" id="m-startYearLabel" onclick="selectYear('#m-start_year', 'from', 'AD')">
                                    <input type="radio" class="d-none s-default-input" <?php if ($date_from) { echo ($date_from[0] !== '-')?'checked':''; } else { echo 'checked'; } ?>>AD</label>
                                </div>
                            </div>
                        </div>

                        <!--div class="col-md-6">
                            <h4>To Year</h4>
                            <div class="form-group input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"> <i class="icofont-ui-calendar"></i> </span>
                                </div>

                                <select name="mobile_end_bcad" id="mobile_end_bcad" class="form-control bcad">
                                    <option value="0">BC</option>
                                    <option value="1">AD</option>
                                </select>

                                <input type="number" name="mobile_end_year" id="mobile_end_year" class="form-control search_year" placeholder="<?=date("Y")?>">
                            </div>
                        </div-->
                        <div class="col-md-6">
                            <h4>Themes</h4>
                            <div class="form-group input-group">
                                <label for="mobile-themes-input">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"> <i class="icofont-ui-theme"></i> </span>
                                    </div>
                                </label>
                                <input class="form-control dropdown-toggle mobileThemesTree-input" id="mobile-themes-input" style="height: 38px" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" placeholder="All Themes" onclick="treeAdjust('mobileThemesTree')" autocomplete="off" readonly>
                                <input type="hidden" id="mobile-themes" name="themes" value="{{ $themes }}">
                                <div class="dropdown-menu mobileThemesTree-menu" aria-labelledby="mobile-themes">
                                    <div id="mobile-ddTreeThemes"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h4>Areas</h4>
                            <div class="form-group input-group dropdown">
                                <label for="mobile-areas-input">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"> <i class="icofont-location-pin"></i> </span>
                                    </div>
                                </label>
                                <input class="form-control dropdown-toggle mobileAreasTree-input" id="mobile-areas-input" style="height: 38px" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" placeholder="All Areas" onclick="treeAdjust('mobileAreasTree')" autocomplete="off" readonly>
                                <input type="hidden" id="mobile-areas" name="areas" value="{{ $areas }}">
                                <div class="dropdown-menu mobileAreasTree-menu" aria-labelledby="mobile-areas">
                                    <div id="mobile-ddTreeAreas"></div>
                                </div>
                            </div>
                        </div>
                        <!--div class="col-md-6">
                            <h4>Tags</h4>
                            <div class="form-group input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"> <i class="icofont-tags"></i> </span>
                                </div>
                                <select name="mobile-tags" id="mobile-tags" class="form-control tags"></select>
                            </div>
                        </div-->

                        <div class="col-md-6">
                            <h4 class="text-white">Action</h4>
                            <div class="text-right">
                                <button type="submit" class="btn btn-primary mt-2 mb-2 search-apply mr-0"><i class="icofont-search-2"></i> Apply</button>
								<button type="button" class="btn btn-default mr-0 mt-2 mb-2 search-clear float-left" onclick="clearSearchForm()"><i class="icofont-eraser"></i> Clear</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>