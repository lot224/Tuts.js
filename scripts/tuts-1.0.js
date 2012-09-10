/*
jQuery Tuts.js plug-in.
Copyright 2012 David Gardyasz
http://www.lot224.net
Version 1.0
*/

(function ($) {
  $.fn.Tuts = function (options) {
    if ($.fn.TutsManager === undefined) {
      $.fn.TutsManager = new Manager();
    }
    $.fn.TutsManager.init(this, options);
  }

  function Manager() {
    var _container
        = '<div id="tuts-js" class="tuts-container">'
        + '  <span class="tuts-arrow tuts-bottom"></span>'
        + '  <span class="tuts-arrow-shadow tuts-south"></span>'
        + '  <span class="tuts-exit">X</span>'
        + '  <div class="tuts-content"></div>'
        + '  <span class="tuts-next"></span>'
        + '  <span class="tuts-close"></span>'
        + '</div>';

    var _settings = {
      'classname': 'tuts-container', // the classname to use on the main container
      'position': 'bottom',          // top, left, right, bottom
      'align': 'center',             // top, left, right, bottom, center
      'duration': 300,               // scroll speed and effect speed
      'onFinish': null,              // callback to fire when array of Tut's are complete
      'onNext': null,                // callback to fire before the next Tut is shown
      'nextLabel': 'next->',         // label for the next button
      'closeLabel': 'close',         // label for the close button
      'margin': 20                   // margin from the anchor in px
    };

    $.extend(this, {
      'init': init,
      'execute': execute
    });

    $(window).on('resize', function () {
      if ($('#tuts-js').is(':visible')) {

        var item = _items[_currentIndex];
        var s = getSettings($(item), _settings);

        if (s.anchor != null) {
          var anchor = $(s.anchor);
          if (anchor.length == 1) {
            setPosition(item, s, anchor, null);
          }
        }
      }
    });

    var _grip = getContainer();

    var _items = {};
    var _currentIndex = 0;

    function init(element, options) {
      _settings = $.extend(_settings, options); // Merge the defaults with the passed options.
      _settings = getSettings(element, _settings);   // Merge the settings with the element options.

      _items = element.children();
      if (_items.length > 0)
        execute(0);
    }

    function execute(index) {
      _currentIndex = index;
      var item = $(_items[index]);
      var s = getSettings(item, _settings);

      if (s.anchor != null) {
        var anchor = $(s.anchor);
        if (anchor.length == 1) {
          if (jQuery.support.opacity) {
            _grip.fadeOut(s.duration, function () {
              _grip.find('.tuts-content').html(item.html());
              _grip.attr('class', s.classname);
              setPosition(item, s, anchor, function () {
                _grip.fadeIn(s.duration);
              });
            });
          } else {
            _grip.hide();
            _grip.find('.tuts-content').html(item.html());
            _grip.attr('class', s.classname);
            setPosition(item, s, anchor, function () {
              _grip.fadeIn(s.duration);
            });
            _grip.show();
          }

          return;
        }
      }

      if (console != null && console.log != null)
        console.log("Tuts.js: anchor (" + s.anchor + ") not found, skipping tip.");

      if (!(_currentIndex + 1 > _items.length - 1)) {
        execute(_currentIndex + 1);
      }

    }

    function setPosition(item, s, a, func) {
      if (_currentIndex + 1 < _items.length) {
        _grip.find('.tuts-close').css('visibility', 'hidden');
        _grip.find('.tuts-next').html(s.nextLabel).css('visibility', 'visible');
      } else {
        _grip.find('.tuts-next').css('visibility', 'hidden');
        _grip.find('.tuts-close').html(s.closeLabel).css('visibility', 'visible');
      }

      var x = getBoundingRect(a);
      var n = { top: 0, left: 0 };

      $('.tuts-arrow').attr('class', 'tuts-arrow');
      $('.tuts-arrow-shadow').attr('class', 'tuts-arrow-shadow');

      var pos = s.position.toLowerCase();
      var align = s.align.toLowerCase();

      switch (pos) {

        case "left": case "right":
          if (pos == "left") {
            n.left = (x.l - _grip.outerWidth()) - s.margin;
          } else {
            n.left = (x.l + x.w) + s.margin;
          }

          switch (align) {
            case 'top':
              n.top = x.t;
              break;

            case 'bottom':
              n.top = (x.t + x.h) - _grip.outerHeight();
              break;

            default:
              align = 'center';
              n.top = x.t - ((_grip.outerHeight() - x.h) / 2);
              break;
          }
          break;

        case "top": default:
          if (pos == "top") {
            n.top = (x.t - _grip.outerHeight()) - s.margin;
          } else {
            pos = "bottom";
            n.top = (x.t + x.h) + s.margin;
          };

          switch (align) {
            case 'left':
              n.left = x.l;
              break;

            case 'right':
              n.left = (x.l + x.w) - _grip.outerWidth();
              break;

            default:
              align = 'center';
              n.left = x.l - ((_grip.outerWidth() - x.w) / 2);
              break;
          }
          break;
      };

      $('.tuts-arrow,.tuts-arrow-shadow').addClass('tuts-' + pos + '-' + align);

      _grip.css(n);

      var scroll = Math.ceil(n.top + ((_grip.outerHeight()) / 2)) - ($(window).height() / 2);

      $("html, body").stop(true, false).animate({
        scrollTop: scroll
      }, s.duration, 'swing', func);

    }



    function getBoundingRect(anchor) {
      var p = anchor.offset();

      return {
        t: p.top,
        l: p.left,
        w: anchor.outerWidth(),
        h: anchor.outerHeight()
      }

    }

    function getSettings(element, array) {
      var settings = {
        'classname': element.data('classname') != null ? element.data('classname') : array.classname,
        'position': element.data('position') != null ? element.data('position') : array.position,
        'align': element.data('align') != null ? element.data('align') : array.align,
        'duration': element.data('duration') != null ? element.data('duration') : array.duration,
        'onFinish': element.data('onfinish') != null ? element.data('onfinish') : array.onFinish,
        'onNext': element.data('onnext') != null ? element.data('onnext') : array.onNext,
        'nextLabel': element.data('nextlabel') != null ? element.data('nextlabel') : array.nextLabel,
        'closeLabel': element.data('closelabel') != null ? element.data('closelabel') : array.closeLabel,
        'margin': element.data('margin') != null ? element.data('margin') : array.margin,
        'anchor': element.data('anchor') != null ? element.data('anchor') : null
      }
      return settings;

    }

    function getContainer() {
      var c = $('#tuts-js');
      if (c.length == 1)
        return c;

      c = $(_container).prependTo('body');
      c.find('.tuts-exit').on('click', function () { if ($.support.opacity) { c.fadeOut(); } else { c.hide(); } });
      c.find('.tuts-next').on('click', function () { $.fn.TutsManager.execute(_currentIndex + 1); });
      c.find('.tuts-close').on('click', function () { if ($.support.opacity) { c.fadeOut(); } else { c.hide(); } });

      return c;
    }

  };
})(jQuery);
