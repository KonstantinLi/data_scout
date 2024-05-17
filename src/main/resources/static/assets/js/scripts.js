'use strict';

(function ($) {
    $(function () {let button = function(){
    return {
        init: function(){
            $('.Site').on('click', 'a.btn[disabled="disabled"]', function(e){
                e.preventDefault();
            });
        }
    };
};
button().init();

const form = function() {
    const $selectList = $('.selectList');
    const $input = $('.form-input, .form-textarea');
    const $form = $('.form');
    const $select = $('.form-select');
    return {
        init: function() {
            $selectList.each(function(){
                const $this = $(this),
                    $radio= $this.find('input[type="radio"]');
                function changeTitle($block, $element) {
                    $block.find('.selectList-title')
                        .text( $element.closest('.selectList-item')
                            .find('.selectList-text').text())
                }
                changeTitle($this, $radio.filter('[checked="checked"]'));
                $radio.on('change', function(){
                    changeTitle($this, $(this));
                });
                
            });
            $(document).on('click', function(e) {
                let $this = $(e.target);
                if (!$this.hasClass('selectList-header')) {
                    $this = $(e.target).closest('.selectList-header');
                }
                if ($this.length) {
                    e.preventDefault();
                    $this.closest('.selectList').toggleClass('selectList_OPEN');
                } else {
                    $('.selectList').removeClass('selectList_OPEN');
                }
            });
            
            // Fields validation
            $input.on('blur', function() {
                let $this = $(this),
                    validate = $this.data('validate'),
                    message = '',
                    error = false;
                if (validate) {
                    validate = validate.split(' ');
                    validate.forEach(function(v) {
                        switch (v) {
                            case 'require':
                                if (!$this.val()
                                    && !$this.prop('disabled')) {
                                        message += 'Это поле обязательно для заполнения. ';
                                        error = true;
                                }
                                break;
                            case 'mail':
                                if ($this.val() !== ''
                                    && !$this.val().match(/\w+@\w+\.\w+/)
                                    && !$this.prop('disabled')) {
                                        message += 'Нужно ввести адрес почты в формате xxx@xxx.xx';
                                        error = true;
                                }
                                break;
                            case 'key':
                                if ($this.val() !== ''
                                    && !$this.val().replace(' ', '').match(/\d{6}/)
                                    && !$this.prop('disabled')) {
                                        message += 'Код должен состоять из 6 цифр';
                                        error = true;
                                }
                        }
                    });
                    
                    if (error) {
                        if ($this.hasClass('form-input')) {
                            $this.addClass('form-input_error');
                        }
                        if ($this.hasClass('form-textarea')) {
                            $this.addClass('form-textarea_error');
                        }
                        if (!$this.next('.form-error').length) {
                            $this.after('<div class="form-error">' + message + '</div>');
                        } else {
                            $this.next('.form-error').text(message);
            
                        }
                        $this.data('errorinput', true);
                    } else {
                        $this.next('.form-error').remove();
                        $this.removeClass('form-input_error');
                        $this.removeClass('form-textarea_error');
                        $this.data('errorinput', false);
                    }
                    message = '';
                }
            });
            $form.on('submit', function(e) {
                let $this = $(this),
                    $validate = $this.find('[data-validate]');
                
                $validate.each(function() {
                    let $this = $(this);
                    $this.trigger('blur');
                    if ($this.data('errorinput')) {
                        e.preventDefault();
                    }
                });
            });
            $select.wrap('<div class="form-selectWrap"></div>');
            $('[data-mask]').each(function() {
                let $this = $(this);
                $this.mask($this.data('mask'), {placeholder:'x'});
            });
        }
    };
};
form().init();

const menu = function(){
    let $menuMain = $('.menu_main');
    $menuMain.css('position', 'absolute');
    let menuHeight = $('.menu_main').outerHeight();
    $menuMain.css('position', 'static');
    let $body = $('body');

    function refresh(){
        if (window.innerWidth < 991) {
            $('.menuModal').css('height', 0);
            $menuMain.css('position', 'absolute');
            menuHeight = $('.menu_main').outerHeight();
            $menuMain.css('position', 'static');
        } else {
            menuHeight = $('.menu_main').outerHeight();
            $('.menuModal')
                .removeClass("menuModal_OPEN")
                .css('height', '');
            $body.removeClass("Site_menuOPEN");
            $('.menuTrigger').removeClass("menuTrigger_OPEN");
        }
    }

    return {
        init: function(){
            if (window.innerWidth<991) {
            $(".menuModal").css('height', menuHeight);
                $(".menuTrigger").each(function () {
                    $($(this).attr('href')).css('height', 0);
                });
            }

            $(".menuTrigger").click(function(e){
                let $this = $(this),
                    href = $this.attr("href");

                if ($this.hasClass("menuTrigger_OPEN")) {
                    $body.removeClass("Site_menuOPEN");
                    $(href)
                        .removeClass("menuModal_OPEN")
                        .css('height', 0);
                    $this.removeClass("menuTrigger_OPEN");
                } else {
                    $body.addClass("Site_menuOPEN");
                    $(href)
                        .addClass("menuModal_OPEN")
                        .css('height', menuHeight);
                    $this.addClass("menuTrigger_OPEN");
                }
                e.preventDefault();
            });
            $(window).on('resize', refresh);
        }
    };
};
menu().init();

const table = function() {
    return {
        init: function() {
        }
    };
};
table().init();

const API = function() {
    let query = document.getElementById("query");
    let isOnline = navigator.onLine;
    let isSearchTab = false

    function sendData(address, type, data, cb, $this) {
        $.ajax({
            url: backendApiUrl + address,
            type: type,
            dataType: 'json',
            data: data,
            complete: function(result) {
                if (result.status === 200) {
                    cb(result.responseJSON, $this, data);
                } else {
                    alert('Ошибка ' + result.status);
                }
            }
        });
    }

    function shiftCheck($element, wave) {
        let text = '', check = $element.data('check');
        text = $element.find('.btn-content').text();
        if ($element.data('alttext')) {
            $element.find('.btn-content').text($element.data('alttext'));
            $element.data('alttext', text);
        }
        if ($element.data('send') == 'startIndexing' || $element.data('send') == 'stopIndexing'){
            if (check) {
                $('.UpdatePageBlock').show(0)
            } else {
                $('.UpdatePageBlock').hide(0)
            }
        }
        check = !check;
        $element.data('check', check);
        if ($element.data('altsend')){
            let altsend = $element.data('altsend');
            $element.data('altsend', $element.data('send'));
            $element.data('send', altsend);
        }
        if (check) {
            $element.addClass('btn_check');
        } else {
            $element.removeClass('btn_check');
        }
        if (!wave) {
            $element.trigger('changeCheck');
        }
    }

    function indexingSiteAction(result, $this) {
        if (result.result){
            if ($this.next('.API-error').length) {
                $this.next('.API-error').remove();
            }
            if ($this.is('[data-btntype="check"]')) {
                shiftCheck($this);
            }
        } else {
            if ($this.next('.API-error').length) {
                $this.next('.API-error').text(result.error);
            } else {
                $this.after('<div class="API-error">' + result.error + '</div>');
            }
        }
    }

    function indexingPageAction(result, $this) {
        if (result.result){
            if ($this.next('.API-error').length) {
                $this.next('.API-error').remove();
            }
            if ($this.next('.API-success').length) {
                $this.next('.API-success').text('Страница добавлена/обновлена успешно');
            } else {
                $this.after('<div class="API-success">Страница поставлена в очередь на обновление / добавление</div>');
            }
        } else {
            if ($this.next('.API-success').length) {
                $this.next('.API-success').remove();
            }
            if ($this.next('.API-error').length) {
                $this.next('.API-error').text(result.error);
            } else {
                $this.after('<div class="API-error">' + result.error + '</div>');
            }
        }
    }

    function searchAction(result, $this, data) {
        if (result.result) {
            if ($this.next('.API-error').length) {
                $this.next('.API-error').remove();
            }
            let $searchResults = $('.SearchResult'),
                $content = $searchResults.find('.SearchResult-content');
            if (data.offset === 0) {
                $content.empty();
            }
            $searchResults.find('.SearchResult-amount').text(result.count);
            let scroll = $(window).scrollTop();
            result.data.forEach(function(page){
                let $block = $('<div class="SearchResult-block">' +
                    '<a target="_blank" ' +
                    'class="SearchResult-siteTitle" ' +
                    'style="cursor: pointer">' +
                    (!data.siteName ? page.siteName + ' - ': '') +
                    page.title +
                    '</a>' +
                    '<div class="SearchResult-description">' +
                    page.snippet +
                    '</div>' +
                    '</div>');
                $block.find('.SearchResult-siteTitle').on('click', function() {
                    displayPage(page.site, page.uri, page.title);
                });
                $content.append($block);
            });
            $(window).scrollTop(scroll);
            $searchResults.addClass('SearchResult_ACTIVE');
            document.getElementById('spinner').style.display = 'none'
            if (result.count > data.offset + result.data.length) {
                $('.SearchResult-footer').removeClass('SearchResult-footer_hide')
                $('.SearchResult-footer button[data-send="search"]')
                    .data('sendoffset', data.offset + result.data.length)
                    .data('searchquery', data.query)
                    .data('searchsite', data.site)
                    .data('sendlimit', data.limit);
                $('.SearchResult-remain').text('(' + (result.count - data.offset - result.data.length) + ')')
            } else {
                $('.SearchResult-footer').addClass('SearchResult-footer_hide')
            }

        } else {
            if ($this.next('.API-error').length) {
                $this.next('.API-error').text(result.error);
            } else {
                $this.after('<div class="API-error">' + result.error + '</div>');
            }
        }
    }

    function statisticsAction(result, $this) {
        if (result.result){
            if ($this.next('.API-error').length) {
                $this.next('.API-error').remove();
            }

            let $statistics = $('.Statistics');
            $statistics.find('.HideBlock').not('.Statistics-example').remove();
            $('#totalSites').text(result.statistics.total.sites);
            $('#totalPages').text(result.statistics.total.pages);
            $('#totalLemmas').text(result.statistics.total.lemmas);
            $('select[name="site"] option').not(':first-child').remove();

            result.statistics.detailed.forEach(function(site){
                let $blockSiteExample = $('.Statistics-example').clone(true);
                let statusClass = '';
                switch (site.status) {
                    case 'INDEXED':
                        statusClass = 'Statistics-status_checked';
                        break;
                    case 'FAILED':
                        statusClass = 'Statistics-status_cancel';
                        break;
                    case 'INDEXING':
                        statusClass = 'Statistics-status_pause';
                        break;

                }

                $('select[name="site"]').append('' +
                    '<option value="' + site.url + '">' +
                    site.url +
                    '</option>')
                $blockSiteExample.removeClass('Statistics-example');
                $blockSiteExample.find('.Statistics-status')
                    .addClass(statusClass)
                    .text(site.status)
                    .before(site.name + ' - ' + site.url);

                let time = new Date(site.statusTime);
                $blockSiteExample.find('.Statistics-description')
                    .html('<div class="Statistics-option"><strong>Status time:</strong> ' +
                        time.getDate() + '.' +
                        (time.getMonth() + 1) + '.' +
                        time.getFullYear() + ' ' +
                        time.getHours() + ':' +
                        time.getMinutes() + ':' +
                        time.getSeconds() +
                        '</div><div class="Statistics-option"><strong>Pages:</strong> ' + site.pages +
                        '</div><div class="Statistics-option"><strong>Lemmas:</strong> ' + site.lemmas +
                        '</div><div class="Statistics-option Statistics-option_error"><strong>Error:</strong> ' + site.error + '</div>'+
                        '')

                $statistics.append($blockSiteExample);
                let $thisHideBlock = $statistics.find('.HideBlock').last();
                $thisHideBlock.on('click', HideBlock().trigger);

                $('.Tabs_column > .Tabs-wrap > .Tabs-block').each(function(){
                    let $this = $(this);
                    if ($this.is(':hidden')) {
                        $this.addClass('Tabs-block_update')
                    }
                });
                $statistics.find('.HideBlock').each(function(){
                    var $this = $(this);
                    var height = $this.find('.Statistics-description').outerHeight();
                    $this.find('.HideBlock-content').css('height', height + 40);
                });
                $('.Tabs_column > .Tabs-wrap > .Tabs-block_update').each(function(){
                    var $this = $(this);
                    $this.removeClass('Tabs-block_update')
                });
            });

            if (result.statistics.total.isIndexing) {
                let $btnIndex = $('.btn[data-send="startIndexing"]'),
                    text = $btnIndex.find('.btn-content').text();
                $btnIndex.find('.btn-content').text($btnIndex.data('alttext'));
                $btnIndex
                    .data('check', true)
                    .data('altsend', 'startIndexing')
                    .data('send', 'stopIndexing')
                    .data('alttext', text)
                    .addClass('btn_check')
                $('.UpdatePageBlock').hide(0)
            }

        } else {
            if ($this.next('.API-error').length) {
                $this.next('.API-error').text(result.error);
            } else {
                $this.after('<div class="API-error">' + result.error + '</div>');
            }
        }

        $('.Site-loader').hide(0);
        $('.Site-loadingIsComplete').css('visibility', 'visible').fadeIn(500);
    }
    async function getSuggestions(queryText) {
        let suggestionsList = document.getElementById("suggestions");
        suggestionsList.innerHTML = "";
        if (queryText.length === 0) {
            suggestionsList.style.display = "none";
            return;
        }

        let response = await fetch("/api/suggestions?" + new URLSearchParams({query: queryText}));
        let suggestions = await response.json();

        if (suggestions.length === 0) {
            suggestionsList.style.display = "none";
            return;
        }

        suggestions.forEach(suggestion => {
            let item = document.createElement("li");
            item.style.cssText = "border-bottom: 1px solid #ddd; cursor: pointer; padding-top: 10px; padding-bottom: 10px";
            item.textContent = suggestion;
            item.onclick = function() {
                query.value = suggestion;
                suggestionsList.innerHTML = "";
                suggestionsList.style.display = "none";
            };
            suggestionsList.appendChild(item);
        })
        suggestionsList.style.display = "block";
    }

    async function displayPage(site, path, title) {
        if (isOnline) {
            window.open(site + path, "_blank");
        } else {
            await fetch("/displayPage?" + new URLSearchParams({
                site: site,
                path: path,
                title: title
            })).then(response => response.text())
                .then(htmlContent => {
                    const newTab = window.open();
                    newTab.document.write(htmlContent);
                    newTab.document.close();
                }).catch(error => console.error('Error fetching page content:', error));
        }
    }

    function updateOnlineStatus() {
        if (isSearchTab) {
            fetch('/check-internet').then(response => {
                isOnline = response.ok;
            }).catch(() => {
                isOnline = false;
            });
        }
    }

    async function saveQuery(query) {
        await fetch("/api/saveQuery", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: query
        });
    }

    query.addEventListener("keyup", function() {
        let queryText = encodeURIComponent(query.value);
        getSuggestions(queryText);
    });

    window.addEventListener('load', () => {
        updateOnlineStatus();
        setInterval(updateOnlineStatus, 5000);
    });

    document.getElementById("management_href").addEventListener("click", () => isSearchTab = false);
    document.getElementById("dashboard_href").addEventListener("click", () => isSearchTab = false);
    document.getElementById("search_href").addEventListener("click", () => isSearchTab = true);

    const send = {
        startIndexing:{
            address: '/startIndexing',
            type: 'GET',
            action: function (result, $this) {
                indexingSiteAction(result, $this)
            }
        },
        stopIndexing: {
            address: '/stopIndexing',
            type: 'GET',
            action: function (result, $this) {
                indexingSiteAction(result, $this)
            }
        },
        indexPage: {
            address: '/indexPage',
            type: 'POST',
            action: function (result, $this) {
                indexingPageAction(result, $this)
            }
        },
        search: {
            address: '/search',
            type: 'get',
            action: function(result, $this, data) {
                searchAction(result, $this, data)
            }
        },
        statistics: {
            address: '/statistics',
            type: 'get',
            action: function(result, $this) {
                statisticsAction(result, $this)
            }
        }
    };

    return {
        init: function(){
            let $btnCheck = $('[data-btntype="check"]');
            $btnCheck.on('click', function(e) {
                var $this = $(this);
                if (!$this.data('send')) {
                    shiftCheck($this);
                }
            });
            $btnCheck.on('changeCheck', function() {
                let $this = $(this);
                if ($this.data('btnradio')) {
                    $('[data-btnradio="' + $this.data('btnradio') + '"]').each(function(e) {
                        if($(this).data('check') && !$(this).is($this)) {
                            shiftCheck($(this), true);
                        }
                    });
                }
            });
            sendData(
                send['statistics'].address,
                send['statistics'].type,
                '',
                send['statistics'].action,
                $('.Statistics')
            )

            let $send = $('[data-send]');
            $send.on('submit click', function(e) {
                let $this = $(this);
                let data = '';
                if (($this.hasClass('form') && e.type === 'submit')
                    || (e.type==='click' && !$this.hasClass('form'))) {
                    e.preventDefault();
                    
                    switch ($this.data('send')) {
                        case 'indexPage':
                            let $page = $this.closest('.form').find('input[name="page"]');
                            data = {url: $page.val()};
                            break;
                        case 'search':
                            document.getElementById('spinner').style.display = 'block';
                            let suggestionsList = document.getElementById("suggestions");
                            suggestionsList.innerHTML = "";
                            suggestionsList.style.display = "none";
                            let queryText = document.getElementById("query").value;
                            if (queryText.length > 0) {
                                saveQuery(queryText);
                            }
                            if ($this.data('sendtype')==='next') {
                                data = {
                                    site: $this.data('searchsite'),
                                    query: $this.data('searchquery'),
                                    offset: $this.data('sendoffset'),
                                    limit: $this.data('sendlimit')
                                };
                            } else {
                                data = {
                                    query: $this.find('[name="query"]').val(),
                                    offset: 0,
                                    limit: $this.data('sendlimit')
                                };
                                if ( $this.find('[name="site"]').val() ) {
                                    data.site = $this.find('[name="site"]').val();
                                }
                            }
                            break;
                    }
                    sendData(
                        send[$this.data('send')].address,
                        send[$this.data('send')].type,
                        data,
                        send[$this.data('send')].action,
                        $this
                    )
                }
            });
        }
    };
};
API().init();

const Column = function(){
    return {
        init: function(){
        }
    };
};
Column().init();

const HideBlock = function() {
    let $HideBlock = $('.HideBlock');
    let $trigger = $HideBlock.find('.HideBlock-trigger');
    $HideBlock.each(function() {
        let $this = $(this);
        let $content = $this.find('.HideBlock-content');
        $content.css('height', $content.outerHeight());
        $this.addClass('HideBlock_CLOSE');
    });
    function clickHide (e) {
        e.preventDefault();
        let $this = $(this);
        let $parent = $this.closest($HideBlock);
        if ($parent.hasClass('HideBlock_CLOSE')) {
            $('.HideBlock').addClass('HideBlock_CLOSE');
            $parent.removeClass('HideBlock_CLOSE');
        } else {
            $parent.addClass('HideBlock_CLOSE');
        }
    }
    return {
        init: function(){
            $trigger.on('click', clickHide);
        },
        trigger: clickHide
    };
};
HideBlock().init();

const Middle = function() {
    return {
        init: function() {
        }
    };
};
Middle().init();

const SearchResult = function() {
    return {
        init: function() {
        }
    };
};
SearchResult().init();

const Section = function() {
    return {
        init: function() {
        }
    };
};
Section().init();

const Spoiler = function() {
    let $HideBlock = $('.Spoiler');
    let $trigger = $HideBlock.find('.Spoiler-trigger');
    $HideBlock.addClass('Spoiler_CLOSE');
    return {
        init: function(){
            $trigger.on('click', function(e) {
                e.preventDefault();
                let $this = $(this);
                let scroll = $(window).scrollTop();
                let $parent = $this.closest($HideBlock);
                if ($parent.hasClass('Spoiler_CLOSE')) {
                    $parent.removeClass('Spoiler_CLOSE');
                    $(window).scrollTop(scroll);
                } else {
                    $parent.addClass('Spoiler_CLOSE');
                    $(window).scrollTop(scroll);
                }
            });
        }
    };
};
Spoiler().init();

let Statistics = function() {
    return {
        init: function(){
        }
    };
};
Statistics().init();

const Tabs = function() {
    let $tabs = $('.Tabs');
    let $tabsLink = $('.Tabs-link');
    let $tabsBlock = $('.Tabs-block');
    return {
        init: function(){
            $tabsLink.on('click', function(e) {
                let $this = $(this);
                let href = $this.attr('href');
                if (href[0]==="#"){
                    e.preventDefault();
                    let $parent = $this.closest($tabs);
                    if ($parent.hasClass('Tabs_steps')) {
                    } else {
                        let $blocks = $parent.find($tabsBlock).not($parent.find($tabs).find($tabsBlock));
                        let $links= $this.add($this.siblings($tabsLink));
                        let $active = $(href);
                        $links.removeClass('Tabs-link_ACTIVE');
                        $this.addClass('Tabs-link_ACTIVE');
                        $blocks.hide(0);
                        $active.show(0);
                    }
                }

            });
            $('.TabsLink').on('click', function(e) {
                let $this = $(this);
                let href = $this.attr('href');
                let $active = $(href);
                let $parent = $active.closest($tabs);
                if ($parent.hasClass('Tabs_steps')) {
                } else {
                    let $blocks = $parent.find($tabsBlock).not($parent.find($tabs).find($tabsBlock));
                    let $link = $('.Tabs-link[href="' + href + '"]');
                    let $links= $link.add($link.siblings($tabsLink));
                    $links.removeClass('Tabs-link_ACTIVE');
                    $link.addClass('Tabs-link_ACTIVE');
                    $blocks.hide(0);
                    $active.show(0);
                }

            });
            $tabs.each(function() {
                $(this).find($tabsLink).eq(0).trigger('click');
            });
            if (~window.location.href.indexOf('#')){
                let tab = window.location.href.split('#');
                tab = tab[tab.length - 1];
                $tabsLink.filter('[href="#' + tab + '"]').trigger('click');
            }
            $('.Site').on('click', 'a', function(){
                var $this = $(this),
                    tab = $this.attr('href').replace(window.location.pathname, '');
                if (~$this.attr('href').indexOf(window.location.pathname)) {
                    $tabsLink.filter('[href="' + tab + '"]').trigger('click');
                }
            });
        }
    };
};
Tabs().init();
});
})(jQuery);