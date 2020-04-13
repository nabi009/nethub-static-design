"use strict";
var userAgent = navigator.userAgent.toLowerCase(),
    initialDate = new Date(),
    $document = $(document),
    $window = $(window),
    $html = $("html"),
    isDesktop = $html.hasClass("desktop"),
    isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
    isFirefox = typeof InstallTrigger !== 'undefined',
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouch = "ontouchstart" in window,
    onloadCaptchaCallback, c3ChartsArray = [],
    plugins = {
        pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
        bootstrapTooltip: $("[data-toggle='tooltip']"),
        bootstrapModalDialog: $('.modal'),
        bootstrapTabs: $(".tabs-custom-init"),
        materialParallax: $(".parallax-container"),
        rdNavbar: $(".rd-navbar"),
        rdGoogleMaps: $(".rd-google-map"),
        rdMailForm: $(".rd-mailform"),
        rdInputLabel: $(".form-label"),
        regula: $("[data-constraints]"),
        owl: $(".owl-carousel"),
        swiper: $(".swiper-slider"),
        search: $(".rd-search"),
        circleProgress: $(".progress-bar-circle"),
        searchResults: $('.rd-search-results'),
        statefulButton: $('.btn-stateful'),
        isotope: $(".isotope"),
        popover: $('[data-toggle="popover"]'),
        viewAnimate: $('.view-animate'),
        radio: $("input[type='radio']"),
        checkbox: $("input[type='checkbox']"),
        customToggle: $("[data-custom-toggle]"),
        counter: $(".counter"),
        progressLinear: $(".progress-linear"),
        dateCountdown: $('.DateCountdown'),
        pageLoader: $("#page-loader"),
        captcha: $('.recaptcha'),
        flickrfeed: $(".flickr"),
        customWaypoints: $('[data-custom-scroll-to]'),
        fixedHeight: $('[data-fixed-height]'),
        twitterfeed: $(".twitter"),
        slick: $('.slick-slider'),
        d3Charts: $('.d3-chart'),
        lightGallery: $("[data-lightgallery='group']"),
        lightGalleryItem: $("[data-lightgallery='item']"),
        lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
        mailchimp: $('.mailchimp-mailform'),
        campaignMonitor: $('.campaign-mailform'),
        customParallax: $(".custom-parallax"),
        scroller: $(".scroll-wrap"),
        mfp: $('[data-lightbox]').not('[data-lightbox="gallery"] [data-lightbox]'),
        mfpGallery: $('[data-lightbox^="gallery"]'),
        maps: $(".google-map-container")
    };
$document.ready(function() {
    var isNoviBuilder = window.xMode;

    function getSwiperHeight(object, attr) {
        var val = object.attr("data-" + attr),
            dim;
        if (!val) {
            return undefined;
        }
        dim = val.match(/(px)|(%)|(vh)$/i);
        if (dim.length) {
            switch (dim[0]) {
                case "px":
                    return parseFloat(val);
                case "vh":
                    return $(window).height() * (parseFloat(val) / 100);
                case "%":
                    return object.width() * (parseFloat(val) / 100);
            }
        } else {
            return undefined;
        }
    }

    function toggleSwiperInnerVideos(swiper) {
        var prevSlide = $(swiper.slides[swiper.previousIndex]),
            nextSlide = $(swiper.slides[swiper.activeIndex]),
            videos;
        prevSlide.find("video").each(function() {
            this.pause();
        });
        videos = nextSlide.find("video");
        if (videos.length) {
            videos.get(0).play();
        }
    }

    function toggleSwiperCaptionAnimation(swiper) {
        var prevSlide = $(swiper.container),
            nextSlide = $(swiper.slides[swiper.activeIndex]);
        prevSlide.find("[data-caption-animate]").each(function() {
            var $this = $(this);
            $this.removeClass("animated").removeClass($this.attr("data-caption-animate")).addClass("not-animated");
        });
        nextSlide.find("[data-caption-animate]").each(function() {
            var $this = $(this),
                delay = $this.attr("data-caption-delay");
            if (!isNoviBuilder) {
                setTimeout(function() {
                    $this.removeClass("not-animated").addClass($this.attr("data-caption-animate")).addClass("animated");
                }, delay ? parseInt(delay) : 0);
            } else {
                $this.removeClass("not-animated")
            }
        });
    }

    function initLightGallery(itemsToInit, addClass) {
        if (!isNoviBuilder) {
            $(itemsToInit).lightGallery({
                thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
                selector: "[data-lightgallery='item']",
                autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
                pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
                addClass: addClass,
                mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
                loop: $(itemsToInit).attr("data-lg-loop") !== "false"
            });
        }
    }

    function initDynamicLightGallery(itemsToInit, addClass) {
        if (!isNoviBuilder) {
            $(itemsToInit).on("click", function() {
                $(itemsToInit).lightGallery({
                    thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
                    selector: "[data-lightgallery='item']",
                    autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
                    pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
                    addClass: addClass,
                    mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
                    loop: $(itemsToInit).attr("data-lg-loop") !== "false",
                    dynamic: true,
                    dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
                });
            });
        }
    }

    function initLightGalleryItem(itemToInit, addClass) {
        if (!isNoviBuilder) {
            $(itemToInit).lightGallery({
                selector: "this",
                addClass: addClass,
                counter: false,
                youtubePlayerParams: {
                    modestbranding: 1,
                    showinfo: 0,
                    rel: 0,
                    controls: 0
                },
                vimeoPlayerParams: {
                    byline: 0,
                    portrait: 0
                }
            });
        }
    }

    function getLatLngObject(str, marker, map, callback) {
        var coordinates = {};
        try {
            coordinates = JSON.parse(str);
            callback(new google.maps.LatLng(coordinates.lat, coordinates.lng), marker, map)
        } catch (e) {
            map.geocoder.geocode({
                'address': str
            }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    callback(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)), marker, map)
                }
            })
        }
    }

    function makeWaypointScroll(obj) {
        var $this = $(obj);
        if (!isNoviBuilder) {
            $this.on('click', function(e) {
                e.preventDefault();
                $("body, html").stop().animate({
                    scrollTop: $($(this).attr('data-custom-scroll-to')).offset().top
                }, 1000, function() {
                    $window.trigger("resize");
                });
            });
        }
    }

    function parseJSONObject(element, attr) {
        return JSON.parse($(element).attr(attr), function(key, value) {
            if ((typeof value) === 'string') {
                if (value.indexOf('function') == 0 || value.indexOf('format') == 0 || value.indexOf('position') == 0) {
                    return eval('(' + value + ')');
                }
            }
            return value;
        });
    }

    function makeParallax(el, speed, wrapper, prevScroll) {
        var scrollY = window.scrollY || window.pageYOffset;
        if (prevScroll != scrollY) {
            prevScroll = scrollY;
            el.addClass('no-transition');
            el[0].style['transform'] = 'translate3d(0,' + -scrollY * (1 - speed) + 'px,0)';
            el.height();
            el.removeClass('no-transition');
            if (el.attr('data-fade') === 'true') {
                var bound = el[0].getBoundingClientRect(),
                    offsetTop = bound.top * 2 + scrollY,
                    sceneHeight = wrapper.outerHeight(),
                    sceneDivider = wrapper.offset().top + sceneHeight / 2.0,
                    layerDivider = offsetTop + el.outerHeight() / 2.0,
                    pos = sceneHeight / 6.0,
                    opacity;
                if (sceneDivider + pos > layerDivider && sceneDivider - pos < layerDivider) {
                    el[0].style["opacity"] = 1;
                } else {
                    if (sceneDivider - pos < layerDivider) {
                        opacity = 1 + ((sceneDivider + pos - layerDivider) / sceneHeight / 3.0 * 5);
                    } else {
                        opacity = 1 - ((sceneDivider - pos - layerDivider) / sceneHeight / 3.0 * 5);
                    }
                    el[0].style["opacity"] = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity.toFixed(2);
                }
            }
        }
        requestAnimationFrame(function() {
            makeParallax(el, speed, wrapper, prevScroll);
        });
    }

    function initSwiperCustomParallax(swiper) {
        if (isNoviBuilder) return;
        var prevSlide = $(swiper.container),
            nextSlide = $(swiper.slides[swiper.activeIndex]);
        prevSlide.find(".custom-parallax").each(function() {
            var $this = $(this)
            wrapper = $('.custom-parallax-wrap'), parallax = true, speed;
            if (parallax && !isIE && !isMobile) {
                if (speed = $this.attr("data-speed")) {
                    makeParallax($this, speed, wrapper, false);
                }
            }
        });
        nextSlide.find(".custom-parallax").each(function() {
            var $this = $(this)
            wrapper = $('.custom-parallax-wrap'), parallax = true, speed;
            if (parallax && !isIE && !isMobile) {
                if (speed = $this.attr("data-speed")) {
                    makeParallax($this, speed, wrapper, false);
                }
            }
        });
    }

    function initOwlCarousel(c) {
        var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
            values = [0, 480, 576, 768, 992, 1200, 1600],
            responsive = {};
        for (var j = 0; j < values.length; j++) {
            responsive[values[j]] = {};
            for (var k = j; k >= -1; k--) {
                if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
                    responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
                }
                if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
                    responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
                }
                if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
                    responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
                }
            }
        }
        if (c.attr('data-dots-custom')) {
            c.on("initialized.owl.carousel", function(event) {
                var carousel = $(event.currentTarget),
                    customPag = $(carousel.attr("data-dots-custom")),
                    active = 0;
                if (carousel.attr('data-active')) {
                    active = parseInt(carousel.attr('data-active'), 10);
                }
                carousel.trigger('to.owl.carousel', [active, 300, true]);
                customPag.find("[data-owl-item='" + active + "']").addClass("active");
                customPag.find("[data-owl-item]").on('click', function(e) {
                    e.preventDefault();
                    carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
                });
                carousel.on("translate.owl.carousel", function(event) {
                    customPag.find(".active").removeClass("active");
                    customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
                });
            });
        }
        c.on("initialized.owl.carousel", function() {
            initLightGalleryItem(c.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
        });
        if (c.attr('data-nav-custom')) {
            c.on("initialized.owl.carousel", function(event) {
                var carousel = $(event.currentTarget),
                    customNav = $(carousel.attr("data-nav-custom"));
                customNav.find(".owl-arrow-next").click(function(e) {
                    e.preventDefault();
                    carousel.trigger('next.owl.carousel');
                });
                customNav.find(".owl-arrow-prev").click(function(e) {
                    e.preventDefault();
                    carousel.trigger('prev.owl.carousel');
                });
            });
        }
        c.owlCarousel({
            autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
            loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
            items: 1,
            center: c.attr("data-center") === "true",
            dotsContainer: c.attr("data-pagination-class") || false,
            navContainer: c.attr("data-navigation-class") || false,
            mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
            nav: c.attr("data-nav") === "true",
            dots: c.attr("data-dots") === "true",
            dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
            animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
            animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
            responsive: responsive,
            navText: c.attr("data-nav-text") ? $.parseJSON(c.attr("data-nav-text")) : [],
            navClass: c.attr("data-nav-class") ? $.parseJSON(c.attr("data-nav-class")) : ['owl-prev', 'owl-next']
        });
    }

    function isScrolledIntoView(elem) {
        if (!isNoviBuilder) {
            return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
        } else {
            return true;
        }
    }

    function lazyInit(element, func) {
        var $win = jQuery(window);
        $win.on('load scroll', function() {
            if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
                func.call();
                element.addClass('lazy-loaded');
            }
        });
    }

    function liveSearch(options) {
        $('#' + options.live).removeClass('cleared').html();
        options.current++;
        options.spin.addClass('loading');
        $.get(handler, {
            s: decodeURI(options.term),
            liveSearch: options.live,
            dataType: "html",
            liveCount: options.liveCount,
            filter: options.filter,
            template: options.template
        }, function(data) {
            options.processed++;
            var live = $('#' + options.live);
            if (options.processed == options.current && !live.hasClass('cleared')) {
                live.find('> #search-results').removeClass('active');
                live.html(data);
                setTimeout(function() {
                    live.find('> #search-results').addClass('active');
                }, 50);
            }
            options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
        })
    }

    function attachFormValidator(elements) {
        for (var i = 0; i < elements.length; i++) {
            var o = $(elements[i]),
                v;
            o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
            v = o.parent().find(".form-validation");
            if (v.is(":last-child")) {
                o.addClass("form-control-last-child");
            }
        }
        elements.on('input change propertychange blur', function(e) {
            var $this = $(this),
                results;
            if (e.type != "blur") {
                if (!$this.parent().hasClass("has-error")) {
                    return;
                }
            }
            if ($this.parents('.rd-mailform').hasClass('success')) {
                return;
            }
            if ((results = $this.regula('validate')).length) {
                for (i = 0; i < results.length; i++) {
                    $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
                }
            } else {
                $this.siblings(".form-validation").text("").parent().removeClass("has-error")
            }
        }).regula('bind');
        var regularConstraintsMessages = [{
            type: regula.Constraint.Required,
            newMessage: "The text field is required."
        }, {
            type: regula.Constraint.Email,
            newMessage: "The email is not a valid email."
        }, {
            type: regula.Constraint.Numeric,
            newMessage: "Only numbers are required"
        }, {
            type: regula.Constraint.Selected,
            newMessage: "Please choose an option."
        }];
        for (var i = 0; i < regularConstraintsMessages.length; i++) {
            var regularConstraint = regularConstraintsMessages[i];
            regula.override({
                constraintType: regularConstraint.type,
                defaultMessage: regularConstraint.newMessage
            });
        }
    }

    function isValidated(elements, captcha) {
        var results, errors = 0;
        if (elements.length) {
            for (j = 0; j < elements.length; j++) {
                var $input = $(elements[j]);
                if ((results = $input.regula('validate')).length) {
                    for (k = 0; k < results.length; k++) {
                        errors++;
                        $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                    }
                } else {
                    $input.siblings(".form-validation").text("").parent().removeClass("has-error")
                }
            }
            if (captcha) {
                if (captcha.length) {
                    return validateReCaptcha(captcha) && errors == 0
                }
            }
            return errors == 0;
        }
        return true;
    }

    function initBootstrapTooltip(tooltipPlacement) {
        if (window.innerWidth < 599) {
            plugins.bootstrapTooltip.tooltip('destroy');
            plugins.bootstrapTooltip.tooltip({
                placement: 'bottom'
            });
        } else {
            plugins.bootstrapTooltip.tooltip('destroy');
            plugins.bootstrapTooltip.tooltipPlacement;
            plugins.bootstrapTooltip.tooltip();
        }
    }
    var o = $("#copyright-year");
    if (o.length) {
        o.text(initialDate.getFullYear());
    }
    if (plugins.pageLoader) {
        $window.on("load", function() {
            setTimeout(function() {
                plugins.pageLoader.addClass("loaded");
                $window.trigger("resize");
            }, 10);
        });
    }

    function validateReCaptcha(captcha) {
        var $captchaToken = captcha.find('.g-recaptcha-response').val();
        if ($captchaToken == '') {
            captcha.siblings('.form-validation').html('Please, prove that you are not robot.').addClass('active');
            captcha.closest('.form-wrap').addClass('has-error');
            captcha.bind('propertychange', function() {
                var $this = $(this),
                    $captchaToken = $this.find('.g-recaptcha-response').val();
                if ($captchaToken != '') {
                    $this.closest('.form-wrap').removeClass('has-error');
                    $this.siblings('.form-validation').removeClass('active').html('');
                    $this.unbind('propertychange');
                }
            });
            return false;
        }
        return true;
    }
    onloadCaptchaCallback = function() {
        for (i = 0; i < plugins.captcha.length; i++) {
            var $capthcaItem = $(plugins.captcha[i]);
            grecaptcha.render($capthcaItem.attr('id'), {
                sitekey: $capthcaItem.attr('data-sitekey'),
                size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
                theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
                callback: function(e) {
                    $('.recaptcha').trigger('propertychange');
                }
            });
            $capthcaItem.after("<span class='form-validation'></span>");
        }
    };
    if (plugins.captcha.length) {
        $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
    }
    if (navigator.platform.match(/(Mac)/i)) $html.addClass("mac-os");
    if (isIE) {
        if (isIE < 10) {
            $html.addClass("lt-ie-10");
        }
        if (isIE < 11) {
            if (plugins.pointerEvents) {
                $.getScript(plugins.pointerEvents).done(function() {
                    $html.addClass("ie-10");
                    PointerEventsPolyfill.initialize({});
                });
            }
        }
        if (isIE === 11) {
            $("html").addClass("ie-11");
        }
        if (isIE === 12) {
            $("html").addClass("ie-edge");
        }
    }
    if (plugins.bootstrapTooltip.length) {
        var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
        initBootstrapTooltip(tooltipPlacement);
        $(window).on('resize orientationchange', function() {
            initBootstrapTooltip(tooltipPlacement);
        })
    }
    if (plugins.bootstrapModalDialog.length > 0) {
        var i = 0;
        for (i = 0; i < plugins.bootstrapModalDialog.length; i++) {
            var modalItem = $(plugins.bootstrapModalDialog[i]);
            modalItem.on('hidden.bs.modal', $.proxy(function() {
                var activeModal = $(this),
                    rdVideoInside = activeModal.find('video'),
                    youTubeVideoInside = activeModal.find('iframe');
                if (rdVideoInside.length) {
                    rdVideoInside[0].pause();
                }
                if (youTubeVideoInside.length) {
                    var videoUrl = youTubeVideoInside.attr('src');
                    youTubeVideoInside.attr('src', '').attr('src', videoUrl);
                }
            }, modalItem))
        }
    }
    if (plugins.radio.length) {
        var i;
        for (i = 0; i < plugins.radio.length; i++) {
            var $this = $(plugins.radio[i]);
            $this.addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
        }
    }
    if (plugins.checkbox.length) {
        var i;
        for (i = 0; i < plugins.checkbox.length; i++) {
            var $this = $(plugins.checkbox[i]);
            $this.addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
        }
    }
    if (plugins.popover.length) {
        if (window.innerWidth < 767) {
            plugins.popover.attr('data-placement', 'bottom');
            plugins.popover.popover();
        } else {
            plugins.popover.popover();
        }
    }
    if (plugins.statefulButton.length) {
        $(plugins.statefulButton).on('click', function() {
            var statefulButtonLoading = $(this).button('loading');
            setTimeout(function() {
                statefulButtonLoading.button('reset')
            }, 2000);
        })
    }
    if (isDesktop && !isNoviBuilder) {
        $().UItoTop({
            easingType: 'easeOutQuart',
            containerClass: 'ui-to-top fa fa-angle-up'
        });
    }
    if (plugins.rdNavbar.length) {
        for (i = 0; i < plugins.rdNavbar.length; i++) {
            var $currentNavbar = $(plugins.rdNavbar[i]);
            $currentNavbar.RDNavbar({
                stickUpClone: ($currentNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? $currentNavbar.attr("data-stick-up-clone") === 'true' : false,
                responsive: {
                    0: {
                        stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-stick-up") === 'true' : false
                    },
                    768: {
                        stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-sm-stick-up") === 'true' : false
                    },
                    992: {
                        stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-md-stick-up") === 'true' : false
                    },
                    1200: {
                        stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-lg-stick-up") === 'true' : false
                    }
                },
                callbacks: {
                    onStuck: function() {
                        var navbarSearch = this.$element.find('.rd-search input');
                        if (navbarSearch) {
                            navbarSearch.val('').trigger('propertychange');
                        }
                    },
                    onUnstuck: function() {
                        if (this.$clone === null)
                            return;
                        var navbarSearch = this.$clone.find('.rd-search input');
                        if (navbarSearch) {
                            navbarSearch.val('').trigger('propertychange');
                            navbarSearch.blur();
                        }
                    },
                    onDropdownOver: function() {
                        return !isNoviBuilder;
                    }
                }
            });
            if (plugins.rdNavbar.attr("data-body-class")) {
                document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
            }
        }
    }
    if (plugins.search.length || plugins.searchResults) {
        var handler = "bat/rd-search.php";
        var defaultTemplate = '<h5 class="search_title"><a target="_top" href="#{href}" class="search_link">#{title}</a></h5>' +
            '<p>...#{token}...</p>' +
            '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
        var defaultFilter = '*.html';
        if (plugins.search.length) {
            for (i = 0; i < plugins.search.length; i++) {
                var searchItem = $(plugins.search[i]),
                    options = {
                        element: searchItem,
                        filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
                        template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
                        live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
                        liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live')) : 4,
                        current: 0,
                        processed: 0,
                        timer: {}
                    };
                if ($('.rd-navbar-search-toggle').length) {
                    var toggle = $('.rd-navbar-search-toggle');
                    toggle.on('click', function() {
                        if (!($(this).hasClass('active'))) {
                            searchItem.find('input').val('').trigger('propertychange');
                        }
                    });
                }
                if (options.live) {
                    var clearHandler = false;
                    searchItem.find('input').on("keyup input propertychange", $.proxy(function() {
                        this.term = this.element.find('input').val().trim();
                        this.spin = this.element.find('.input-group-addon');
                        clearTimeout(this.timer);
                        if (this.term.length > 2) {
                            this.timer = setTimeout(liveSearch(this), 200);
                            if (clearHandler == false) {
                                clearHandler = true;
                                $("body").on("click", function(e) {
                                    if ($(e.toElement).parents('.rd-search').length == 0) {
                                        $('#rd-search-results-live').addClass('cleared').html('');
                                    }
                                })
                            }
                        } else if (this.term.length == 0) {
                            $('#' + this.live).addClass('cleared').html('');
                        }
                    }, options, this));
                }
                searchItem.submit($.proxy(function() {
                    $('<input />').attr('type', 'hidden').attr('name', "filter").attr('value', this.filter).appendTo(this.element);
                    return true;
                }, options, this))
            }
        }
        if (plugins.searchResults.length) {
            var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
            var match = regExp.exec(location.search);
            if (match != null) {
                $.get(handler, {
                    s: decodeURI(match[1]),
                    dataType: "html",
                    filter: match[2],
                    template: defaultTemplate,
                    live: ''
                }, function(data) {
                    plugins.searchResults.html(data);
                })
            }
        }
    }
    if (plugins.materialParallax.length) {
        if (!isNoviBuilder && !isIE && !isMobile) {
            plugins.materialParallax.parallax();
            $window.on('load', function() {
                setTimeout(function() {
                    $window.scroll();
                }, 500);
            });
        } else {
            for (var i = 0; i < plugins.materialParallax.length; i++) {
                var parallax = $(plugins.materialParallax[i]),
                    imgPath = parallax.data("parallax-img");
                parallax.css({
                    "background-image": 'url(' + imgPath + ')',
                    "background-size": "cover"
                });
            }
        }
    }
    if (plugins.viewAnimate.length) {
        var i;
        for (i = 0; i < plugins.viewAnimate.length; i++) {
            var $view = $(plugins.viewAnimate[i]).not('.active');
            $document.on("scroll", $.proxy(function() {
                if (isScrolledIntoView(this)) {
                    this.addClass("active");
                }
            }, $view)).trigger("scroll");
        }
    }
    var interleaveOffset = -.7;
    var interleaveEffect = {
        effect: 'slide',
        speed: 1200,
        watchSlidesProgress: true,
        onProgress: function(swiper, progress) {
            for (var i = 0; i < swiper.slides.length; i++) {
                var slide = swiper.slides[i];
                var translate, innerTranslate;
                progress = slide.progress;
                if (progress > 0) {
                    translate = progress * swiper.width;
                    innerTranslate = translate * interleaveOffset;
                } else {
                    innerTranslate = Math.abs(progress * swiper.width) * interleaveOffset;
                    translate = 0;
                }
                slide.style.transform = 'translate3d(' + translate + 'px,0,0)';
                slide.getElementsByClassName('slide-inner')[0].style.transform = 'translate3d(' + innerTranslate + 'px,0,0)';
            }
        },
        onTouchStart: function(swiper) {
            for (var i = 0; i < swiper.slides.length; i++) {
                this.slide.style.transition = '0s';
            }
        },
        onSetTransition: function(swiper, speed) {
            for (var i = 0; i < swiper.slides.length; i++) {
                $(swiper.slides[i]).find('.slide-inner').andSelf().css({
                    transition: speed + 'ms'
                });
            }
        },
        onSlideNextStart: function(swiper) {
            setTimeout(function() {
                toggleSwiperCaptionAnimation(swiper);
            }, 300);
        },
        onSlidePrevStart: function(swiper) {
            setTimeout(function() {
                toggleSwiperCaptionAnimation(swiper);
            }, 300);
        },
        onTransitionEnd: function(swiper) {
            return false;
        }
    };
    if (plugins.swiper.length) {
        for (var i = 0; i < plugins.swiper.length; i++) {
            var s = $(plugins.swiper[i]);
            var pag = s.find(".swiper-pagination"),
                next = s.find(".swiper-button-next"),
                prev = s.find(".swiper-button-prev"),
                bar = s.find(".swiper-scrollbar"),
                swiperSlide = s.find(".swiper-slide"),
                autoplay = false;
            for (var j = 0; j < swiperSlide.length; j++) {
                var $this = $(swiperSlide[j]),
                    url;
                if (url = $this.attr("data-slide-bg")) {
                    $this.css({
                        "background-image": "url(" + url + ")",
                        "background-size": "cover"
                    })
                }
            }
            swiperSlide.end().find("[data-caption-animate]").addClass("not-animated").end();
            s.swiper({
                autoplay: !isNoviBuilder && $.isNumeric(s.attr('data-autoplay')) ? s.attr('data-autoplay') : false,
                direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
                effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
                speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
                keyboardControl: s.attr('data-keyboard') === "true",
                mousewheelControl: s.attr('data-mousewheel') === "true",
                mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
                nextButton: next.length ? next.get(0) : null,
                prevButton: prev.length ? prev.get(0) : null,
                pagination: pag.length ? pag.get(0) : null,
                paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
                paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function(swiper, index, className) {
                    return '<span class="' + className + '">' + (index + 1) + '</span>';
                } : null : null,
                scrollbar: bar.length ? bar.get(0) : null,
                scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
                scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
                loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
                simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
                onTransitionStart: function(swiper) {
                    toggleSwiperInnerVideos(swiper);
                },
                onTransitionEnd: function(swiper) {
                    toggleSwiperCaptionAnimation(swiper);
                },
                onInit: function(swiper) {
                    toggleSwiperInnerVideos(swiper);
                    toggleSwiperCaptionAnimation(swiper);
                    initLightGalleryItem(s.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
                }
            });
            $window.on("resize", (function(s) {
                return function() {
                    var mh = getSwiperHeight(s, "min-height"),
                        h = getSwiperHeight(s, "height");
                    if (h) {
                        s.css("height", mh ? mh > h ? mh : h : h);
                    }
                }
            })(s)).trigger("resize");
        }
    }
    if (plugins.owl.length) {
        for (var i = 0; i < plugins.owl.length; i++) {
            var c = $(plugins.owl[i]);
            plugins.owl[i].owl = c;
            initOwlCarousel(c);
        }
    }
    if (plugins.isotope.length) {
        var i, j, isogroup = [];
        for (i = 0; i < plugins.isotope.length; i++) {
            var isotopeItem = plugins.isotope[i],
                filterItems = $(isotopeItem).closest('.isotope-wrap').find('[data-isotope-filter]'),
                iso = new Isotope(isotopeItem, {
                    itemSelector: '.isotope-item',
                    layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
                    filter: '*',
                    masonry: {
                        columnWidth: 0.25
                    }
                });
            isogroup.push(iso);
        }
        $(window).on('load', function() {
            setTimeout(function() {
                var i;
                for (i = 0; i < isogroup.length; i++) {
                    isogroup[i].element.className += " isotope--loaded";
                    isogroup[i].layout();
                }
            }, 600);
        });
        var resizeTimout, isotopeFilter = $("[data-isotope-filter]");
        isotopeFilter.on("click", function(e) {
            e.preventDefault();
            var filter = $(this);
            clearTimeout(resizeTimout);
            filter.parents(".isotope-filters").find('.active').removeClass("active");
            filter.addClass("active");
            var iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]');
            iso.isotope({
                itemSelector: '.isotope-item',
                layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
                filter: this.getAttribute("data-isotope-filter") == '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]',
                masonry: {
                    columnWidth: 0.25
                }
            });
        }).eq(0).trigger("click")
    }
    if (isDesktop && $html.hasClass("wow-animation") && $(".wow").length) {
        new WOW().init();
    }
    if (plugins.slick.length) {
        var i;
        for (i = 0; i < plugins.slick.length; i++) {
            var $slickItem = $(plugins.slick[i]);
            $slickItem.slick({
                slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll')) || 1,
                asNavFor: $slickItem.attr('data-for') || false,
                dots: $slickItem.attr("data-dots") == "true",
                infinite: isNoviBuilder ? false : $slickItem.attr("data-loop") == "true",
                focusOnSelect: true,
                arrows: $slickItem.attr("data-arrows") == "true",
                swipe: $slickItem.attr("data-swipe") == "true",
                autoplay: $slickItem.attr("data-autoplay") == "true",
                centerMode: $slickItem.attr("data-center-mode") == "true",
                centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
                mobileFirst: true,
                responsive: [{
                    breakpoint: 0,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-items')) || 1,
                        vertical: $slickItem.attr('data-vertical') == 'true' || false
                    }
                }, {
                    breakpoint: 479,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-xs-items')) || 1,
                        vertical: $slickItem.attr('data-xs-vertical') == 'true' || false
                    }
                }, {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-sm-items')) || 1,
                        vertical: $slickItem.attr('data-sm-vertical') == 'true' || false
                    }
                }, {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-md-items')) || 1,
                        vertical: $slickItem.attr('data-md-vertical') == 'true' || false
                    }
                }, {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-lg-items')) || 1,
                        vertical: $slickItem.attr('data-lg-vertical') == 'true' || false
                    }
                }]
            }).on('afterChange', function(event, slick, currentSlide, nextSlide) {
                var $this = $(this),
                    childCarousel = $this.attr('data-child');
                if (childCarousel) {
                    $(childCarousel + ' .slick-slide').removeClass('slick-current');
                    $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
                }
            });
        }
    }
    if (plugins.maps.length) {
        $.getScript("//maps.google.com/maps/api/js?key=AIzaSyAwH60q5rWrS8bXwpkZwZwhw9Bw0pqKTZM&sensor=false&libraries=geometry,places&v=3.7", function() {
            var head = document.getElementsByTagName('head')[0],
                insertBefore = head.insertBefore;
            head.insertBefore = function(newElement, referenceElement) {
                if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') !== -1 || newElement.innerHTML.indexOf('gm-style') !== -1) {
                    return;
                }
                insertBefore.call(head, newElement, referenceElement);
            };
            var geocoder = new google.maps.Geocoder;
            for (var i = 0; i < plugins.maps.length; i++) {
                var zoom = parseInt(plugins.maps[i].getAttribute("data-zoom"), 10) || 11;
                var styles = plugins.maps[i].hasAttribute('data-styles') ? JSON.parse(plugins.maps[i].getAttribute("data-styles")) : [];
                var center = plugins.maps[i].getAttribute("data-center") || "New York";
                var map = new google.maps.Map(plugins.maps[i].querySelectorAll(".google-map")[0], {
                    zoom: zoom,
                    styles: styles,
                    scrollwheel: false,
                    center: {
                        lat: 0,
                        lng: 0
                    }
                });
                plugins.maps[i].map = map;
                plugins.maps[i].geocoder = geocoder;
                plugins.maps[i].google = google;
                getLatLngObject(center, null, plugins.maps[i], function(location, markerElement, mapElement) {
                    mapElement.map.setCenter(location);
                })
                var markerItems = plugins.maps[i].querySelectorAll(".google-map-markers li");
                if (markerItems.length) {
                    var markers = [];
                    for (var j = 0; j < markerItems.length; j++) {
                        var markerElement = markerItems[j];
                        getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[i], function(location, markerElement, mapElement) {
                            var icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
                            var activeIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active");
                            var info = markerElement.getAttribute("data-description") || "";
                            var infoWindow = new google.maps.InfoWindow({
                                content: info
                            });
                            markerElement.infoWindow = infoWindow;
                            var markerData = {
                                position: location,
                                map: mapElement.map
                            }
                            if (icon) {
                                markerData.icon = icon;
                            }
                            var marker = new google.maps.Marker(markerData);
                            markerElement.gmarker = marker;
                            markers.push({
                                markerElement: markerElement,
                                infoWindow: infoWindow
                            });
                            marker.isActive = false;
                            google.maps.event.addListener(infoWindow, 'closeclick', (function(markerElement, mapElement) {
                                var markerIcon = null;
                                markerElement.gmarker.isActive = false;
                                markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
                                markerElement.gmarker.setIcon(markerIcon);
                            }).bind(this, markerElement, mapElement));
                            google.maps.event.addListener(marker, 'click', (function(markerElement, mapElement) {
                                if (markerElement.infoWindow.getContent().length === 0) return;
                                var gMarker, currentMarker = markerElement.gmarker,
                                    currentInfoWindow;
                                for (var k = 0; k < markers.length; k++) {
                                    var markerIcon;
                                    if (markers[k].markerElement === markerElement) {
                                        currentInfoWindow = markers[k].infoWindow;
                                    }
                                    gMarker = markers[k].markerElement.gmarker;
                                    if (gMarker.isActive && markers[k].markerElement !== markerElement) {
                                        gMarker.isActive = false;
                                        markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")
                                        gMarker.setIcon(markerIcon);
                                        markers[k].infoWindow.close();
                                    }
                                }
                                currentMarker.isActive = !currentMarker.isActive;
                                if (currentMarker.isActive) {
                                    if (markerIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active")) {
                                        currentMarker.setIcon(markerIcon);
                                    }
                                    currentInfoWindow.open(map, marker);
                                } else {
                                    if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")) {
                                        currentMarker.setIcon(markerIcon);
                                    }
                                    currentInfoWindow.close();
                                }
                            }).bind(this, markerElement, mapElement))
                        })
                    }
                }
            }
        });
    }
    if (plugins.bootstrapTabs.length) {
        var i;
        for (i = 0; i < plugins.bootstrapTabs.length; i++) {
            var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);
            if (bootstrapTabsItem.find('.owl-carousel').length) {
                var carouselObj = bootstrapTabsItem.find('.tab-content .tab-pane.active .owl-carousel');
                initOwlCarousel(carouselObj);
                bootstrapTabsItem.find('.nav-custom a').on('click', $.proxy(function() {
                    var $this = $(this);
                    $this.find('.owl-carousel').trigger('destroy.owl.carousel').removeClass('owl-loaded');
                    $this.find('.owl-carousel').find('.owl-stage-outer').children().unwrap();
                    setTimeout(function() {
                        var carouselObj = $this.find('.tab-content .tab-pane.active .owl-carousel');
                        if (carouselObj.length) {
                            for (var j = 0; j < carouselObj.length; j++) {
                                var carouselItem = $(carouselObj[j]);
                                initOwlCarousel(carouselItem);
                            }
                        }
                    }, isNoviBuilder ? 1500 : 300);
                }, bootstrapTabsItem));
            }
            if (bootstrapTabsItem.find('.slick-slider').length) {
                bootstrapTabsItem.find('.nav-tabs > li > a').on('click', $.proxy(function() {
                    var $this = $(this);
                    var setTimeOutTime = isNoviBuilder ? 1500 : 300;
                    setTimeout(function() {
                        $this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
                    }, setTimeOutTime);
                }, bootstrapTabsItem));
            }
        }
    }
    if (plugins.rdInputLabel.length) {
        plugins.rdInputLabel.RDInputLabel();
    }
    if (plugins.regula.length) {
        attachFormValidator(plugins.regula);
    }
    if (plugins.mailchimp.length) {
        for (i = 0; i < plugins.mailchimp.length; i++) {
            var $mailchimpItem = $(plugins.mailchimp[i]),
                $email = $mailchimpItem.find('input[type="email"]');
            $mailchimpItem.attr('novalidate', 'true');
            $email.attr('name', 'EMAIL');
            $mailchimpItem.on('submit', $.proxy(function($email, event) {
                event.preventDefault();
                var $this = this;
                var data = {},
                    url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
                    dataArray = $this.serializeArray(),
                    $output = $("#" + $this.attr("data-form-output"));
                for (i = 0; i < dataArray.length; i++) {
                    data[dataArray[i].name] = dataArray[i].value;
                }
                $.ajax({
                    data: data,
                    url: url,
                    dataType: 'jsonp',
                    error: function(resp, text) {
                        $output.html('Server error: ' + text);
                        setTimeout(function() {
                            $output.removeClass("active");
                        }, 4000);
                    },
                    success: function(resp) {
                        $output.html(resp.msg).addClass('active');
                        $email[0].value = '';
                        var $label = $('[for="' + $email.attr('id') + '"]');
                        if ($label.length) $label.removeClass('focus not-empty');
                        setTimeout(function() {
                            $output.removeClass("active");
                        }, 6000);
                    },
                    beforeSend: function(data) {
                        var isNoviBuilder = window.xMode;
                        var isValidated = (function() {
                            var results, errors = 0;
                            var elements = $this.find('[data-constraints]');
                            var captcha = null;
                            if (elements.length) {
                                for (var j = 0; j < elements.length; j++) {
                                    var $input = $(elements[j]);
                                    if ((results = $input.regula('validate')).length) {
                                        for (var k = 0; k < results.length; k++) {
                                            errors++;
                                            $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                                        }
                                    } else {
                                        $input.siblings(".form-validation").text("").parent().removeClass("has-error")
                                    }
                                }
                                if (captcha) {
                                    if (captcha.length) {
                                        return validateReCaptcha(captcha) && errors === 0
                                    }
                                }
                                return errors === 0;
                            }
                            return true;
                        })();
                        if (isNoviBuilder || !isValidated)
                            return false;
                        $output.html('Submitting...').addClass('active');
                    }
                });
                return false;
            }, $mailchimpItem, $email));
        }
    }
    if (plugins.campaignMonitor.length) {
        for (i = 0; i < plugins.campaignMonitor.length; i++) {
            var $campaignItem = $(plugins.campaignMonitor[i]);
            $campaignItem.on('submit', $.proxy(function(e) {
                var data = {},
                    url = this.attr('action'),
                    dataArray = this.serializeArray(),
                    $output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
                    $this = $(this);
                for (i = 0; i < dataArray.length; i++) {
                    data[dataArray[i].name] = dataArray[i].value;
                }
                $.ajax({
                    data: data,
                    url: url,
                    dataType: 'jsonp',
                    error: function(resp, text) {
                        $output.html('Server error: ' + text);
                        setTimeout(function() {
                            $output.removeClass("active");
                        }, 4000);
                    },
                    success: function(resp) {
                        $output.html(resp.Message).addClass('active');
                        setTimeout(function() {
                            $output.removeClass("active");
                        }, 6000);
                    },
                    beforeSend: function(data) {
                        if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
                            return false;
                        $output.html('Submitting...').addClass('active');
                    }
                });
                var inputs = $this[0].getElementsByTagName('input');
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].value = '';
                    var label = document.querySelector('[for="' + inputs[i].getAttribute('id') + '"]');
                    if (label) label.classList.remove('focus', 'not-empty');
                }
                return false;
            }, $campaignItem));
        }
    }
    if (plugins.rdMailForm.length) {
        var i, j, k, msg = {
            'MF000': 'Successfully sent!',
            'MF001': 'Recipients are not set!',
            'MF002': 'Form will not work locally!',
            'MF003': 'Please, define email field in your form!',
            'MF004': 'Please, define type of your form!',
            'MF254': 'Something went wrong with PHPMailer!',
            'MF255': 'Aw, snap! Something went wrong.'
        };
        for (i = 0; i < plugins.rdMailForm.length; i++) {
            var $form = $(plugins.rdMailForm[i]),
                formHasCaptcha = false;
            $form.attr('novalidate', 'novalidate').ajaxForm({
                data: {
                    "form-type": $form.attr("data-form-type") || "contact",
                    "counter": i
                },
                beforeSubmit: function(arr, $form, options) {
                    if (isNoviBuilder)
                        return;
                    var form = $(plugins.rdMailForm[this.extraData.counter]),
                        inputs = form.find("[data-constraints]"),
                        output = $("#" + form.attr("data-form-output")),
                        captcha = form.find('.recaptcha'),
                        captchaFlag = true;
                    output.removeClass("active error success");
                    if (isValidated(inputs, captcha)) {
                        if (captcha.length) {
                            var captchaToken = captcha.find('.g-recaptcha-response').val(),
                                captchaMsg = {
                                    'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                                    'CPT002': 'Something wrong with google reCaptcha'
                                }
                            formHasCaptcha = true;
                            $.ajax({
                                method: "POST",
                                url: "bat/reCaptcha.php",
                                data: {
                                    'g-recaptcha-response': captchaToken
                                },
                                async: false
                            }).done(function(responceCode) {
                                if (responceCode != 'CPT000') {
                                    if (output.hasClass("snackbars")) {
                                        output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')
                                        setTimeout(function() {
                                            output.removeClass("active");
                                        }, 3500);
                                        captchaFlag = false;
                                    } else {
                                        output.html(captchaMsg[responceCode]);
                                    }
                                    output.addClass("active");
                                }
                            });
                        }
                        if (!captchaFlag) {
                            return false;
                        }
                        form.addClass('form-in-process');
                        if (output.hasClass("snackbars")) {
                            output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
                            output.addClass("active");
                        }
                    } else {
                        return false;
                    }
                },
                error: function(result) {
                    if (isNoviBuilder)
                        return;
                    var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
                        form = $(plugins.rdMailForm[this.extraData.counter]);
                    output.text(msg[result]);
                    form.removeClass('form-in-process');
                    if (formHasCaptcha) {
                        grecaptcha.reset();
                    }
                },
                success: function(result) {
                    if (isNoviBuilder)
                        return;
                    var form = $(plugins.rdMailForm[this.extraData.counter]),
                        output = $("#" + form.attr("data-form-output"));
                    form.addClass('success').removeClass('form-in-process');
                    if (formHasCaptcha) {
                        grecaptcha.reset();
                    }
                    result = result.length === 5 ? result : 'MF255';
                    output.text(msg[result]);
                    if (result === "MF000") {
                        if (output.hasClass("snackbars")) {
                            output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
                        } else {
                            output.addClass("active success");
                        }
                    } else {
                        if (output.hasClass("snackbars")) {
                            output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
                        } else {
                            output.addClass("active error");
                        }
                    }
                    form.clearForm();
                    form.find('input, textarea').blur();
                    setTimeout(function() {
                        output.removeClass("active error success");
                        form.removeClass('success');
                    }, 3500);
                }
            });
        }
    }
    if (plugins.flickrfeed.length > 0) {
        var i;
        for (i = 0; i < plugins.flickrfeed.length; i++) {
            var flickrfeedItem = $(plugins.flickrfeed[i]);
            flickrfeedItem.RDFlickr({
                callback: function() {
                    var items = flickrfeedItem.find("[data-photo-swipe-item]");
                    if (items.length && !isNoviBuilder) {
                        for (var j = 0; j < items.length; j++) {
                            var image = new Image();
                            image.setAttribute('data-index', j);
                            image.onload = function() {
                                items[this.getAttribute('data-index')].setAttribute('data-size', this.naturalWidth + 'x' + this.naturalHeight);
                            };
                            image.src = items[j].getAttribute('href');
                        }
                    }
                }
            });
            setTimeout(function() {
                var items = flickrfeedItem.find("[data-photo-swipe-item]");
                if (items.length && isNoviBuilder) {
                    for (var j = 0; j < items.length; j++) {
                        items[j].setAttribute('href', '#');
                        items[j].addEventListener('click', function(e) {
                            e.preventDefault();
                            return false;
                        });
                    }
                }
            }, 350);
        }
    }
    if (plugins.lightGallery.length) {
        for (var i = 0; i < plugins.lightGallery.length; i++) {
            initLightGallery(plugins.lightGallery[i]);
        }
    }
    if (plugins.lightGalleryItem.length) {
        var notCarouselItems = [];
        for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
            if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length && !$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length && !$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
                notCarouselItems.push(plugins.lightGalleryItem[z]);
            }
        }
        plugins.lightGalleryItem = notCarouselItems;
        for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
            initLightGalleryItem(plugins.lightGalleryItem[i]);
        }
    }
    if (plugins.lightDynamicGalleryItem.length) {
        for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
            initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
        }
    }
    if (plugins.customToggle.length) {
        var i;
        for (i = 0; i < plugins.customToggle.length; i++) {
            var $this = $(plugins.customToggle[i]);
            $this.on('click', $.proxy(function(event) {
                event.preventDefault();
                var $ctx = $(this);
                $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
            }, $this));
            if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
                $("body").on("click", $this, function(e) {
                    if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length && e.data.find($(e.target)).length == 0) {
                        $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
                    }
                })
            }
            if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
                $("body").on("click", $this, function(e) {
                    if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length == 0 && e.data.find($(e.target)).length == 0) {
                        $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
                    }
                })
            }
        }
    }
    if (plugins.counter.length) {
        var i;
        for (i = 0; i < plugins.counter.length; i++) {
            var $counterNotAnimated = $(plugins.counter[i]).not('.animated');
            $document.on("scroll", $.proxy(function() {
                var $this = this;
                if ((!$this.hasClass("animated")) && (isScrolledIntoView($this))) {
                    $this.countTo({
                        refreshInterval: 40,
                        from: 0,
                        to: parseInt($this.text(), 10),
                        speed: $this.attr("data-speed") || 1000,
                        formatter: function(value, options) {
                            if ($this.attr('data-zero') == 'true') {
                                value = value.toFixed(options.decimals);
                                if (value < 10) {
                                    return '0' + value;
                                }
                                return value;
                            } else {
                                return value.toFixed(options.decimals);
                            }
                        }
                    });
                    $this.addClass('animated');
                }
            }, $counterNotAnimated)).trigger("scroll");
        }
    }
    if (plugins.dateCountdown.length) {
        var i;
        for (i = 0; i < plugins.dateCountdown.length; i++) {
            var dateCountdownItem = $(plugins.dateCountdown[i]),
                time = {
                    "Days": {
                        "text": "Days",
                        "show": true,
                        color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                    },
                    "Hours": {
                        "text": "Hours",
                        "show": true,
                        color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                    },
                    "Minutes": {
                        "text": "Minutes",
                        "show": true,
                        color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                    },
                    "Seconds": {
                        "text": "Seconds",
                        "show": true,
                        color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                    }
                };
            dateCountdownItem.TimeCircles({
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "rgba(247, 247, 247, 1)",
                animation: "smooth",
                bg_width: dateCountdownItem.attr("data-bg-width") ? dateCountdownItem.attr("data-bg-width") : 0.6,
                circle_bg_color: dateCountdownItem.attr("data-bg") ? dateCountdownItem.attr("data-bg") : "rgba(0, 0, 0, 1)",
                fg_width: dateCountdownItem.attr("data-width") ? dateCountdownItem.attr("data-width") : 0.03
            });
            $(window).on('load resize orientationchange', function() {
                if (window.innerWidth < 479) {
                    dateCountdownItem.TimeCircles({
                        time: {
                            "Days": {
                                "text": "Days",
                                "show": true,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            },
                            "Hours": {
                                "text": "Hours",
                                "show": true,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            },
                            "Minutes": {
                                "text": "Minutes",
                                "show": true,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            },
                            Seconds: {
                                "text": "Seconds",
                                show: false,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            }
                        }
                    }).rebuild();
                } else if (window.innerWidth < 767) {
                    dateCountdownItem.TimeCircles({
                        time: {
                            "Days": {
                                "text": "Days",
                                "show": true,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            },
                            "Hours": {
                                "text": "Hours",
                                "show": true,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            },
                            "Minutes": {
                                "text": "Minutes",
                                "show": true,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            },
                            Seconds: {
                                text: '',
                                show: false,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            }
                        }
                    }).rebuild();
                } else {
                    dateCountdownItem.TimeCircles({
                        time: time
                    }).rebuild();
                }
            });
        }
    }
    if (plugins.circleProgress.length) {
        var i;
        for (i = 0; i < plugins.circleProgress.length; i++) {
            var circleProgressItem = $(plugins.circleProgress[i]);
            $document.on("scroll", function() {
                if (!circleProgressItem.hasClass('animated')) {
                    var arrayGradients = circleProgressItem.attr('data-gradient').split(",");
                    circleProgressItem.circleProgress({
                        value: parseFloat(circleProgressItem.text(), 10),
                        size: circleProgressItem.attr('data-size') ? circleProgressItem.attr('data-size') : 140,
                        fill: {
                            gradient: arrayGradients,
                            gradientAngle: Math.PI / 4
                        },
                        startAngle: -Math.PI / 4 * 2,
                        emptyFill: circleProgressItem.attr('data-empty-fill') ? circleProgressItem.attr('data-empty-fill') : "rgb(245,245,245)",
                        thickness: circleProgressItem.attr('data-thickness') ? parseInt(circleProgressItem.attr('data-thickness')) : 10,
                    }).on('circle-animation-progress', function(event, progress, stepValue) {
                        $(this).find('span').text(String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1'));
                    });
                    circleProgressItem.addClass('animated');
                }
            }).trigger("scroll");
        }
    }
    if (plugins.progressLinear.length) {
        for (i = 0; i < plugins.progressLinear.length; i++) {
            var progressBar = $(plugins.progressLinear[i]);
            $window.on("scroll load", $.proxy(function() {
                var bar = $(this);
                if (!bar.hasClass('animated-first') && isScrolledIntoView(bar)) {
                    var end = parseInt($(this).find('.progress-value').text(), 10);
                    bar.find('.progress-bar-linear').css({
                        width: end + '%'
                    });
                    bar.find('.progress-value').countTo({
                        refreshInterval: 40,
                        from: 0,
                        to: end,
                        speed: 500
                    });
                    bar.addClass('animated-first');
                }
            }, progressBar));
        }
    }
    if (plugins.customWaypoints.length && !isNoviBuilder) {
        var i;
        for (i = 0; i < plugins.customWaypoints.length; i++) {
            var $this = $(plugins.customWaypoints[i]);
            makeWaypointScroll($this);
        }
    }
    if (plugins.fixedHeight) {
        for (var i = 0; i < plugins.fixedHeight.length; i++) {
            $(window).on('resize orientationchange', function(object) {
                setFixedHeight(object);
            }(plugins.fixedHeight[i]))
        }
        $window.trigger("resize");
    }

    function setFixedHeight(object) {
        object.style.minHeight = object.offsetHeight + 'px';
    }
    if (plugins.twitterfeed.length > 0) {
        var i;
        for (i = 0; i < plugins.twitterfeed.length; i++) {
            var twitterfeedItem = plugins.twitterfeed[i];
            $(twitterfeedItem).RDTwitter({});
        }
    }
    if (plugins.d3Charts.length) {}

    function fillNumbers(n) {
        return Array.apply(null, {
            length: n
        }).map(Function.call, Number);
    }
    var d3Charts = [];
    var lineChartObjectData = [1, 2, 1.3, 3, 4.6, 2, 1.8, 3, 3.3, 3.6],
        lineChartObject = {
            bindto: '#line-chart',
            legend: {
                show: false
            },
            color: {
                pattern: ['#ffe500']
            },
            point: {
                r: 4
            },
            padding: {
                left: 30,
                right: 30,
                top: 0,
                bottom: 0,
            },
            data: {
                x: 'x',
                columns: [
                    ['x', 1, 1.5, 3, 4.4, 5, 7, 9, 10, 11, 12],
                    ['data1'].concat(lineChartObjectData)
                ],
                axes: {
                    data1: 'y'
                },
                type: 'area',
                classes: {
                    data1: 'stocks-rating-chart',
                }
            },
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            },
            labels: true,
            axis: {
                x: {
                    min: 0,
                    max: 12.5,
                    tick: {
                        values: fillNumbers(13),
                        format: function(x) {
                            return ('0' + x).slice(-2);
                        },
                        outer: false
                    },
                    padding: {
                        left: 0,
                        right: 0,
                    }
                },
                y: {
                    min: 0,
                    max: 6,
                    tick: {
                        values: fillNumbers(13),
                        format: function(x) {
                            return x == 0 ? '' : ('0' + x).slice(-2);
                        },
                        outer: false
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
            },
            tooltip: {
                format: {
                    name: function(name, ratio, id, index) {
                        return '';
                    },
                    value: function(value, ratio, id, index) {
                        var val = Math.round(typeof lineChartObjectData[index - 1] === 'undefined' ? 0 : ((value - lineChartObjectData[index - 1]) / value) * 100)
                        return (val == 0 ? '' : val > 0 ? '+ ' : '- ') + Math.abs(val) + " %";
                    }
                }
            },
            line: {
                connectNull: true
            }
        };
    var lineChartObjectData2 = [
            [1, 2, 1.5, 3, 2, 1.6, 2],
            [2.5, 3.5, 3, 4.5, 3.5, 4.3, 4.8, 5]
        ],
        lineChartObject2 = {
            bindto: '#line-chart-2',
            legend: {
                show: false
            },
            color: {
                pattern: ['#ffe500', '#000']
            },
            point: {
                r: 4
            },
            padding: {
                left: 30,
                right: 30,
                top: 0,
                bottom: 0,
            },
            data: {
                xs: {
                    'data1': 'x1',
                    'data2': 'x2',
                },
                names: {
                    data1: '2016',
                    data2: '2017'
                },
                columns: [
                    ['x1', 1, 1.5, 3, 4.4, 7, 9, 12],
                    ['x2', 1, 1.5, 3, 4.4, 7, 10, 11, 12],
                    ['data1'].concat(lineChartObjectData2[0]), ['data2'].concat(lineChartObjectData2[1])
                ],
                axes: {
                    data1: 'y'
                }
            },
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            },
            labels: true,
            axis: {
                x: {
                    min: 0,
                    max: 12.5,
                    tick: {
                        values: fillNumbers(13),
                        format: function(x) {
                            return ('0' + x).slice(-2);
                        },
                        outer: false
                    },
                    padding: {
                        left: 0,
                        right: 0,
                    }
                },
                y: {
                    min: 0,
                    max: 6,
                    tick: {
                        values: fillNumbers(13),
                        format: function(x) {
                            return x == 0 ? '' : ('0' + x).slice(-2);
                        },
                        outer: false
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
            },
            tooltip: {
                format: {
                    value: function(value) {
                        return value;
                    }
                }
            },
            line: {
                connectNull: true
            }
        };
    d3Charts.push(c3.generate(lineChartObject));
    d3Charts.push(c3.generate(lineChartObject2));
    if (plugins.customParallax.length && !isNoviBuilder) {
        for (var k = 0; k < plugins.customParallax.length; k++) {
            var $this = $(plugins.customParallax[k]),
                wrapper = $('.custom-parallax-wrap'),
                parallax = true,
                speed;
            if (parallax && !isIE && !isMobile) {
                if (speed = $this.attr("data-speed")) {
                    makeParallax($this, speed, wrapper, false);
                }
            }
        }
    }
    if (plugins.scroller.length) {
        var i;
        for (i = 0; i < plugins.scroller.length; i++) {
            var scrollerItem = $(plugins.scroller[i]);
            scrollerItem.mCustomScrollbar({
                theme: scrollerItem.attr('data-theme') ? scrollerItem.attr('data-theme') : 'minimal',
                scrollInertia: 100,
                scrollButtons: {
                    enable: false
                }
            });
        }
    }
    if (plugins.mfp.length > 0 || plugins.mfpGallery.length > 0 && !isNoviBuilder) {
        if (plugins.mfp.length) {
            for (i = 0; i < plugins.mfp.length; i++) {
                var mfpItem = plugins.mfp[i];
                $(mfpItem).magnificPopup({
                    type: mfpItem.getAttribute("data-lightbox")
                });
            }
        }
        if (plugins.mfpGallery.length) {
            for (i = 0; i < plugins.mfpGallery.length; i++) {
                var mfpGalleryItem = $(plugins.mfpGallery[i]).find('[data-lightbox]');
                for (var c = 0; c < mfpGalleryItem.length; c++) {
                    $(mfpGalleryItem).addClass("mfp-" + $(mfpGalleryItem).attr("data-lightbox"));
                }
                mfpGalleryItem.end().magnificPopup({
                    delegate: '[data-lightbox]',
                    type: "image",
                    gallery: {
                        enabled: true
                    }
                });
            }
        }
    }
});


/*------------------------
    Accordion
    --------------------------*/

    jQuery('.ad-title').on('click',function(e) {
        e.preventDefault();

      var $this = jQuery(this);

        if($this.next().hasClass('show')) {
            $this.next().removeClass('show');
            $this.next().slideUp(350);
            $this.parent().removeClass('ad-active');
        }else{
            $this.parent().addClass('ad-active');
            jQuery('.ad-title').not(this).parent().removeClass('ad-active');
            $this.parent().parent().find('div .ad-details').removeClass('show');
            $this.parent().parent().find('div .ad-details').slideUp(350);
            $this.next().toggleClass('show');
            $this.next().slideToggle(350);
      }
    });


    /*=============================================
    =            swiper slider activation            =
    =============================================*/
    $(document).ready(function(){
    var brandLogoSlider = new Swiper('.brand-logo-slider__container', {
        slidesPerView : 6,
        loop: true,
        speed: 1000,
        spaceBetween : 30,
        autoplay: {
            delay: 3000,
        },

        breakpoints: {
            1499:{
                slidesPerView : 6
            },

            991:{
                slidesPerView : 4
            },

            767:{
                slidesPerView : 3

            },

            575:{
                slidesPerView : 2
            }
        }
    });
    
    var carouselSlider = new Swiper('.top-info-slider__container', {
        slidesPerView : 3,
        slidesPerGroup: 1,
        loop: true,
        speed: 1000,
        autoplay: true,
        spaceBetween : 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination-1',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            1499:{
                slidesPerView : 3
            },
            1200:{
                slidesPerView : 2
            },

            991:{
                slidesPerView : 1
            },

            767:{
                slidesPerView : 1

            },

            575:{
                slidesPerView : 1
            }
        }
    });
        
    var carouselSlider = new Swiper('.single-flexible__container', {
        slidesPerView : 1,
        slidesPerGroup: 1,
        loop: true,
        speed: 1000,
        spaceBetween : 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination-1',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            1499:{
                slidesPerView : 3
            },
            1200:{
                slidesPerView : 2
            },

            991:{
                slidesPerView : 1
            },

            767:{
                slidesPerView : 1

            },

            575:{
                slidesPerView : 1
            }
        }
    });

        
    var carouselSlider = new Swiper('.service-slider__container', {
        slidesPerView : 4,
        slidesPerGroup: 4,
        loop: true,
        speed: 1000,
        autoplay: true,
        spaceBetween : 0,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination-service',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            1499:{
                slidesPerView : 3,
                slidesPerGroup: 3
            },
            1200:{
                slidesPerView : 3,
                slidesPerGroup: 3
            },

            991:{
                slidesPerView : 2,
                slidesPerGroup: 2
            },

            767:{
                slidesPerView : 1,
                slidesPerGroup: 1

            },

            575:{
                slidesPerView : 1,
                slidesPerGroup: 1
            }
        }
    });
  
    var carouselSlider = new Swiper('.service-slider__project-active', {
        slidesPerView : 1,
        slidesPerGroup: 1,
        loop: true,
        speed: 1000,
        autoplay: false,
        spaceBetween : 0,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination-service',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            1499:{
                slidesPerView : 1
            },
            1200:{
                slidesPerView : 1
            },

            991:{
                slidesPerView : 1
            },

            767:{
                slidesPerView : 1

            },

            575:{
                slidesPerView : 1
            }
        }
    });

    
    var carouselSlider = new Swiper('.three-flexible__container', {
        slidesPerView : 3,
        slidesPerGroup: 1,
        loop: true,
        speed: 1000,
        autoplay: true,
        spaceBetween : 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination-3',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            1499:{
                slidesPerView : 3
            },

            991:{
                slidesPerView : 2
            },

            767:{
                slidesPerView : 1

            },

            575:{
                slidesPerView : 1
            }
        }
    });


    var carouselSlider = new Swiper('.auto--center-flexible__container', {
        slidesPerView: 'auto',
        centeredSlides: true,
        freeMode: false,    
        slidesPerGroup: 1,
        loop: true,
        speed: 1000,
        spaceBetween : 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination-auto',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            1499:{
                slidesPerView : 3
            },

            991:{
                slidesPerView : 2
            },

            767:{
                slidesPerView : 1

            },

            575:{
                slidesPerView : 1
            }
        }
    });

    var carouselSlider = new Swiper('.auto--per-flexible__container', {
        slidesPerView: 'auto',
        centeredSlides: false,
        freeMode: true,    
        slidesPerGroup: 1,
        loop: true,
        speed: 1000,
        spaceBetween : 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination-5',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            1499:{
                slidesPerView : 3
            },

            991:{
                slidesPerView : 2
            },

            767:{
                slidesPerView : 1

            },

            575:{
                slidesPerView : 1
            }
        }
    });

    var mySwiper = new Swiper('.auto--pree-mode-flexible__container', {
        spaceBetween : 30,
        loop: true,
        freeMode: true,
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination-6',
            type: 'bullets',
            clickable: true
        },
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        speed: 7000
    });
        
    var carouselSlider = new Swiper('.carousel-slider__container', {
        slidesPerView : 3,
        slidesPerGroup: 1,
        loop: true,
        speed: 1000,
        spaceBetween : 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination-9',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            1499:{
                slidesPerView : 3
            },

            991:{
                slidesPerView : 2
            },

            767:{
                slidesPerView : 1

            },

            575:{
                slidesPerView : 1
            }
        }
    });
        
    var carouselSlider = new Swiper('.projects-slider__container', {
        slidesPerView : 3,
        slidesPerGroup: 1,
        loop: true,
        speed: 1000,
        spaceBetween : 0,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination-project',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            1499:{
                slidesPerView : 3
            },

            1200:{
                slidesPerView : 2
            },
            
            991:{
                slidesPerView : 2
            },

            767:{
                slidesPerView : 1

            },

            575:{
                slidesPerView : 1
            }
        }
    });    
        
        
    var carouselSlider = new Swiper('.testimonial-slider__container', {
        slidesPerView : 2,
        slidesPerGroup: 1,
        loop: true,
        speed: 1000,
        spaceBetween : 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination-t01',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            1499:{
                slidesPerView : 2
            },

            991:{
                slidesPerView : 1
            },

            767:{
                slidesPerView : 1

            },

            575:{
                slidesPerView : 1
            }
        }
    });
        
    var carouselSlider = new Swiper('.testimonial-slider__container-two', {
        slidesPerView : 3,
        slidesPerGroup: 1,
        centeredSlides: true,
        loop: true,
        speed: 1000,
        spaceBetween : 50,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination-t0',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            1499:{
                slidesPerView : 2
            },

            991:{
                slidesPerView : 1
            },

            767:{
                slidesPerView : 1

            },

            575:{
                slidesPerView : 1
            }
        }
    });

    /*=====  End of swiper slider activation  ======*/
    });