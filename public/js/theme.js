"use strict";

(function($, window, i) {
  // Bootstrap 4 Modal
  $.fn.fireModal = function(options) {
    var options = $.extend({
      size: 'modal-md',
      center: false,
      animation: true,
      title: 'Modal Title',
      closeButton: true,
      header: true,
      bodyClass: '',
      footerClass: '',
      body: '',
      buttons: [],
      autoFocus: true,
      created: function() {},
      appended: function() {},
      onFormSubmit: function() {},
      modal: {}
    }, options);

    this.each(function() {
      i++;
      var id = 'fire-modal-' + i,
        trigger_class = 'trigger--' + id,
        trigger_button = $('.' + trigger_class);

      $(this).addClass(trigger_class);

      // Get modal body
      let body = options.body;

      if(typeof body == 'object') {
        if(body.length) {
          let part = body;
          body = body.removeAttr('id').clone().removeClass('modal-part');
          part.remove();
        }else{
          body = '<div class="text-danger">Modal part element not found!</div>';
        }
      }

      // Modal base template
      var modal_template = '   <div class="modal'+ (options.animation == true ? ' fade' : '') +'" tabindex="-1" role="dialog" id="'+ id +'">  '  + 
                 '     <div class="modal-dialog '+options.size+(options.center ? ' modal-dialog-centered' : '')+'" role="document">  '  + 
                 '       <div class="modal-content">  '  + 
                 ((options.header == true) ?
                 '         <div class="modal-header">  '  + 
                 '           <h5 class="modal-title">'+ options.title +'</h5>  '  + 
                 ((options.closeButton == true) ?
                 '           <button type="button" class="close" data-dismiss="modal" aria-label="Close">  '  + 
                 '             <span aria-hidden="true">&times;</span>  '  + 
                 '           </button>  '
                 : '') + 
                 '         </div>  '
                 : '') +
                 '         <div class="modal-body">  '  + 
                 '         </div>  '  +
                 (options.buttons.length > 0 ?
                 '         <div class="modal-footer">  '  + 
                 '         </div>  '  
                 : '')+ 
                 '       </div>  '  + 
                 '     </div>  '  + 
                 '  </div>  ' ; 

      // Convert modal to object
      var modal_template = $(modal_template);

      // Start creating buttons from 'buttons' option
      var this_button;
      options.buttons.forEach(function(item) {
        // get option 'id'
        let id = "id" in item ? item.id : '';

        // Button template
        this_button = '<button type="'+ ("submit" in item && item.submit == true ? 'submit' : 'button') +'" class="'+ item.class +'" id="'+ id +'">'+ item.text +'</button>';

        // add click event to the button
        this_button = $(this_button).off('click').on("click", function() {
          // execute function from 'handler' option
          item.handler.call(this, modal_template);
        });
        // append generated buttons to the modal footer
        $(modal_template).find('.modal-footer').append(this_button);
      });

      // append a given body to the modal
      $(modal_template).find('.modal-body').append(body);

      // add additional body class
      if(options.bodyClass) $(modal_template).find('.modal-body').addClass(options.bodyClass);

      // add footer body class
      if(options.footerClass) $(modal_template).find('.modal-footer').addClass(options.footerClass);
      
      // execute 'created' callback
      options.created.call(this, modal_template, options);

      // modal form and submit form button
      let modal_form = $(modal_template).find('.modal-body form'),
        form_submit_btn = modal_template.find('button[type=submit]');

      // append generated modal to the body
      $("body").append(modal_template);

      // execute 'appended' callback
      options.appended.call(this, $('#' + id), modal_form, options);

      // if modal contains form elements
      if(modal_form.length) {
        // if `autoFocus` option is true
        if(options.autoFocus) {
          // when modal is shown
          $(modal_template).on('shown.bs.modal', function() {
            // if type of `autoFocus` option is `boolean`
            if(typeof options.autoFocus == 'boolean')
              modal_form.find('input:eq(0)').focus(); // the first input element will be focused
            // if type of `autoFocus` option is `string` and `autoFocus` option is an HTML element
            else if(typeof options.autoFocus == 'string' && modal_form.find(options.autoFocus).length) 
              modal_form.find(options.autoFocus).focus(); // find elements and focus on that
          });
        }

        // form object
        let form_object = {
          startProgress: function() {
            modal_template.addClass('modal-progress');
          },
          stopProgress: function() {
            modal_template.removeClass('modal-progress');
          }
        };

        // if form is not contains button element
        if(!modal_form.find('button').length) $(modal_form).append('<button class="d-none" id="'+ id +'-submit"></button>');

        // add click event
        form_submit_btn.click(function() {
          modal_form.submit();
        });

        // add submit event
        modal_form.submit(function(e) {
          // start form progress
          form_object.startProgress();

          // execute `onFormSubmit` callback
          options.onFormSubmit.call(this, modal_template, e, form_object);
        });
      }

      $(document).on("click", '.' + trigger_class, function() {
        $('#' + id).modal(options.modal);
        
        return false;
      });
    });
  }

  // Bootstrap Modal Destroyer
  $.destroyModal = function(modal) {
    modal.modal('hide');
    modal.on('hidden.bs.modal', function() {
    });
  }

  // Card Progress Controller
  $.cardProgress = function(card, options) {
    var options = $.extend({
      dismiss: false,
      dismissText: 'Cancel',
      spinner: true,
      onDismiss: function() {}
    }, options);

    var me = $(card);

    me.addClass('card-progress');
    if(options.spinner == false) {
      me.addClass('remove-spinner');
    }

    if(options.dismiss == true) {
      var btn_dismiss = '<a class="btn btn-danger card-progress-dismiss">'+options.dismissText+'</a>';
      btn_dismiss = $(btn_dismiss).off('click').on('click', function() {
        me.removeClass('card-progress');
        me.find('.card-progress-dismiss').remove();
        options.onDismiss.call(this, me);
      });
      me.append(btn_dismiss);
    }

    return {
      dismiss: function(dismissed) {
        $.cardProgressDismiss(me, dismissed);
      }
    };
  }

  $.cardProgressDismiss = function(card, dismissed) {
    var me = $(card);
    me.removeClass('card-progress');
    me.find('.card-progress-dismiss').remove();   
    if(dismissed)
      dismissed.call(this, me);
  }

  $.chatCtrl = function(element, chat) {
    var chat = $.extend({
      position: 'chat-right',
      text: '',
      time: moment(new Date().toISOString()).format('hh:mm'),
      picture: '',
      type: 'text', // or typing
      timeout: 0,
      onShow: function() {}
    }, chat);

    var target = $(element),
        element = '<div class="chat-item '+chat.position+'" style="display:none">' +
                  '<img src="'+chat.picture+'">' +
                  '<div class="chat-details">' +
                  '<div class="chat-text">'+chat.text+'</div>' +
                  '<div class="chat-time">'+chat.time+'</div>' +
                  '</div>' +
                  '</div>',
        typing_element = '<div class="chat-item chat-left chat-typing" style="display:none">' +
                  '<img src="'+chat.picture+'">' +
                  '<div class="chat-details">' +
                  '<div class="chat-text"></div>' +
                  '</div>' +
                  '</div>';

      var append_element = element;
      if(chat.type == 'typing') {
        append_element = typing_element;
      }

      if(chat.timeout > 0) {
        setTimeout(function() {
          target.find('.chat-content').append($(append_element).fadeIn());
        }, chat.timeout);
      }else{
        target.find('.chat-content').append($(append_element).fadeIn());
      }

      var target_height = 0;
      target.find('.chat-content .chat-item').each(function() {
        target_height += $(this).outerHeight();
      });
      setTimeout(function() {
        target.find('.chat-content').scrollTop(target_height, -1);
      }, 100);
      chat.onShow.call(this, append_element);
  }
})(jQuery, this, 0);


"use strict";

// ChartJS
if(window.Chart) {
  Chart.defaults.global.defaultFontFamily = "'Nunito', 'Segoe UI', 'Arial'";
  Chart.defaults.global.defaultFontSize = 11;
  Chart.defaults.global.defaultFontStyle = 500;
  Chart.defaults.global.defaultFontColor = "#999";
  Chart.defaults.global.tooltips.backgroundColor = '#000';
  Chart.defaults.global.tooltips.titleFontFamily = "'Nunito', 'Segoe UI', 'Arial'";
  Chart.defaults.global.tooltips.titleFontColor = '#fff';
  Chart.defaults.global.tooltips.titleFontSize = 20;
  Chart.defaults.global.tooltips.xPadding = 10;
  Chart.defaults.global.tooltips.yPadding = 10;
  Chart.defaults.global.tooltips.cornerRadius = 3;
}

// DropzoneJS
if(window.Dropzone) {
  Dropzone.autoDiscover = false;
}

// Basic confirm box
$('[data-confirm]').each(function() {
  var me = $(this),
      me_data = me.data('confirm');

  me_data = me_data.split("|");
  me.fireModal({
    title: me_data[0],
    body: me_data[1],
    buttons: [
      {
        text: me.data('confirm-text-yes') || 'Yes',
        class: 'btn btn-danger btn-shadow',
        handler: function() {
          eval(me.data('confirm-yes'));
        }
      },
      {
        text: me.data('confirm-text-cancel') || 'Cancel',
        class: 'btn btn-secondary',
        handler: function(modal) {
          $.destroyModal(modal);
          eval(me.data('confirm-no'));
        }
      }
    ]
  })
});

// Global
$(function() {
  let sidebar_nicescroll_opts = {
    cursoropacitymin: 0,
    cursoropacitymax: .8,
    zindex: 892
  }, now_layout_class = null;

  var sidebar_sticky = function() {
    if($("body").hasClass('layout-2')) {    
      $("body.layout-2 #sidebar-wrapper").stick_in_parent({
        parent: $('body')
      });
      $("body.layout-2 #sidebar-wrapper").stick_in_parent({recalc_every: 1});
    }
  }
  sidebar_sticky();

  var sidebar_nicescroll;
  var update_sidebar_nicescroll = function() {
    let a = setInterval(function() {
      if(sidebar_nicescroll != null)
        sidebar_nicescroll.resize();
    }, 10);

    setTimeout(function() {
      clearInterval(a);
    }, 600);
  }

  var sidebar_dropdown = function() {
    if($(".main-sidebar").length) {
      $(".main-sidebar").niceScroll(sidebar_nicescroll_opts);
      sidebar_nicescroll = $(".main-sidebar").getNiceScroll();

      $(".main-sidebar .sidebar-menu li a.has-dropdown").off('click').on('click', function() {
        var me = $(this);

        me.parent().find('> .dropdown-menu').slideToggle(500, function() {
          update_sidebar_nicescroll();
          return false;
        });
        return false;
      });
    }
  }
  sidebar_dropdown();

  if($("#top-5-scroll").length) {
    $("#top-5-scroll").css({
      height: 315
    }).niceScroll();
  }

  $(".main-content").css({
    minHeight: $(window).outerHeight() - 95
  })

  $(".nav-collapse-toggle").click(function() {
    $(this).parent().find('.navbar-nav').toggleClass('show');
    return false;
  });

  $(document).on('click', function(e) {
    $(".nav-collapse .navbar-nav").removeClass('show');
  });

  var toggle_sidebar_mini = function(mini) {
    let body = $('body');

    if(!mini) {
      body.removeClass('sidebar-mini');
      $(".main-sidebar").css({
        overflow: 'hidden'
      });
      setTimeout(function() {
        $(".main-sidebar").niceScroll(sidebar_nicescroll_opts);
        sidebar_nicescroll = $(".main-sidebar").getNiceScroll();
      }, 500);
      $(".main-sidebar .sidebar-menu > li > ul .dropdown-title").remove();
      $(".main-sidebar .sidebar-menu > li > a").removeAttr('data-toggle');
      $(".main-sidebar .sidebar-menu > li > a").removeAttr('data-original-title');
      $(".main-sidebar .sidebar-menu > li > a").removeAttr('title');
    }else{
      body.addClass('sidebar-mini');
      body.removeClass('sidebar-show');
      sidebar_nicescroll.remove();
      sidebar_nicescroll = null;
      $(".main-sidebar .sidebar-menu > li").each(function() {
        let me = $(this);

        if(me.find('> .dropdown-menu').length) {
          me.find('> .dropdown-menu').hide();
          me.find('> .dropdown-menu').prepend('<li class="dropdown-title pt-3">'+ me.find('> a').text() +'</li>');
        }else{
          me.find('> a').attr('data-toggle', 'tooltip');
          me.find('> a').attr('data-original-title', me.find('> a').text());
          $("[data-toggle='tooltip']").tooltip({
            placement: 'right'
          });
        }
      });
    }
  }

  $("[data-toggle='sidebar']").click(function() {
    var body = $("body"),
      w = $(window);

    if(w.outerWidth() <= 1024) {
      body.removeClass('search-show search-gone');
      if(body.hasClass('sidebar-gone')) {
        body.removeClass('sidebar-gone');
        body.addClass('sidebar-show');
      }else{
        body.addClass('sidebar-gone');
        body.removeClass('sidebar-show');
      }

      update_sidebar_nicescroll();
    }else{
      body.removeClass('search-show search-gone');
      if(body.hasClass('sidebar-mini')) {
        toggle_sidebar_mini(false);
      }else{
        toggle_sidebar_mini(true);
      }
    }

    return false;
  });

  var toggleLayout = function() {
    var w = $(window),
      layout_class = $('body').attr('class') || '',
      layout_classes = (layout_class.trim().length > 0 ? layout_class.split(' ') : '');

    if(layout_classes.length > 0) {
      layout_classes.forEach(function(item) {
        if(item.indexOf('layout-') != -1) {
          now_layout_class = item;
        }
      });
    }

    if(w.outerWidth() <= 1024) {
      if($('body').hasClass('sidebar-mini')) {
        toggle_sidebar_mini(false);
        $('.main-sidebar').niceScroll(sidebar_nicescroll_opts);
        sidebar_nicescroll = $(".main-sidebar").getNiceScroll();
      }

      $("body").addClass("sidebar-gone");
      $("body").removeClass("layout-2 layout-3 sidebar-mini sidebar-show");
      $("body").off('click').on('click', function(e) {
        if($(e.target).hasClass('sidebar-show') || $(e.target).hasClass('search-show')) {
          $("body").removeClass("sidebar-show");
          $("body").addClass("sidebar-gone");
          $("body").removeClass("search-show");

          update_sidebar_nicescroll();
        }
      });

      update_sidebar_nicescroll();

      if(now_layout_class == 'layout-3') {
        let nav_second_classes = $(".navbar-secondary").attr('class'),
          nav_second = $(".navbar-secondary");

        nav_second.attr('data-nav-classes', nav_second_classes);
        nav_second.removeAttr('class');
        nav_second.addClass('main-sidebar');

        let main_sidebar = $(".main-sidebar");
        main_sidebar.find('.container').addClass('sidebar-wrapper').removeClass('container');
        main_sidebar.find('.navbar-nav').addClass('sidebar-menu').removeClass('navbar-nav');
        main_sidebar.find('.sidebar-menu .nav-item.dropdown.show a').click();
        main_sidebar.find('.sidebar-brand').remove();
        main_sidebar.find('.sidebar-menu').before($('<div>', {
          class: 'sidebar-brand'
        }).append(
          $('<a>', {
            href: $('.navbar-brand').attr('href'),
          }).html($('.navbar-brand').html())
        ));
        setTimeout(function() {
          sidebar_nicescroll = main_sidebar.niceScroll(sidebar_nicescroll_opts);
          sidebar_nicescroll = main_sidebar.getNiceScroll();
        }, 700);

        sidebar_dropdown();
        $(".main-wrapper").removeClass("container");
      }
    }else{
      $("body").removeClass("sidebar-gone sidebar-show");
      if(now_layout_class)
        $("body").addClass(now_layout_class);

      let nav_second_classes = $(".main-sidebar").attr('data-nav-classes'),
        nav_second = $(".main-sidebar");

      if(now_layout_class == 'layout-3' && nav_second.hasClass('main-sidebar')) {
        nav_second.find(".sidebar-menu li a.has-dropdown").off('click');
        nav_second.find('.sidebar-brand').remove();
        nav_second.removeAttr('class');
        nav_second.addClass(nav_second_classes);
  
        let main_sidebar = $(".navbar-secondary");
        main_sidebar.find('.sidebar-wrapper').addClass('container').removeClass('sidebar-wrapper');
        main_sidebar.find('.sidebar-menu').addClass('navbar-nav').removeClass('sidebar-menu');
        main_sidebar.find('.dropdown-menu').hide();
        main_sidebar.removeAttr('style');
        main_sidebar.removeAttr('tabindex');
        main_sidebar.removeAttr('data-nav-classes');
        $(".main-wrapper").addClass("container");
        // if(sidebar_nicescroll != null)
        //   sidebar_nicescroll.remove();
      }else if(now_layout_class == 'layout-2') {
        $("body").addClass("layout-2");
      }else{
        update_sidebar_nicescroll();
      }
    }
  }
  toggleLayout();
  $(window).resize(toggleLayout);

  $("[data-toggle='search']").click(function() {
    var body = $("body");

    if(body.hasClass('search-gone')) {
      body.addClass('search-gone');
      body.removeClass('search-show');
    }else{
      body.removeClass('search-gone');
      body.addClass('search-show');
    }
  });

  // tooltip
  $("[data-toggle='tooltip']").tooltip();

  // popover
  $('[data-toggle="popover"]').popover({
    container: 'body'
  });

  // Select2
  if(jQuery().select2) {
    $(".select2").select2();
  }

  // Selectric
  if(jQuery().selectric) {
    $(".selectric").selectric({
      disableOnMobile: false,
      nativeOnMobile: false
    });
  }

  $(".notification-toggle").dropdown();
  $(".notification-toggle").parent().on('shown.bs.dropdown', function() {
    $(".dropdown-list-icons").niceScroll({
      cursoropacitymin: .3,
      cursoropacitymax: .8,
      cursorwidth: 7
    });
  });

  $(".message-toggle").dropdown();
  $(".message-toggle").parent().on('shown.bs.dropdown', function() {
    $(".dropdown-list-message").niceScroll({
      cursoropacitymin: .3,
      cursoropacitymax: .8,
      cursorwidth: 7
    });
  });

  if($(".chat-content").length) { 
    $(".chat-content").niceScroll({
        cursoropacitymin: .3,
        cursoropacitymax: .8,
    });
    $('.chat-content').getNiceScroll(0).doScrollTop($('.chat-content').height());
  }

  if(jQuery().summernote) {   
    $(".summernote").summernote({
       dialogsInBody: true,
      minHeight: 250,
    });
    $(".summernote-simple").summernote({
       dialogsInBody: true,
      minHeight: 150,
      toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['font', ['strikethrough']],
        ['para', ['paragraph']]
      ]
    });
  }

  if(window.CodeMirror) {
    $(".codeeditor").each(function() {
      let editor = CodeMirror.fromTextArea(this, {
        lineNumbers: true,
        theme: "duotone-dark",
        mode: 'javascript',
        height: 200
      });
      editor.setSize("100%", 200);
    });
  }

  // Follow function
  $('.follow-btn, .following-btn').each(function() {
    var me = $(this),
        follow_text = 'Follow',
        unfollow_text = 'Following';

    me.click(function() {
      if(me.hasClass('following-btn')) {
        me.removeClass('btn-danger');
        me.removeClass('following-btn');
        me.addClass('btn-primary');
        me.html(follow_text);

        eval(me.data('unfollow-action'));
      }else{
        me.removeClass('btn-primary');
        me.addClass('btn-danger');
        me.addClass('following-btn');
        me.html(unfollow_text);

        eval(me.data('follow-action'));
      }
      return false;
    });
  });

  // Dismiss function
  $("[data-dismiss]").each(function() {
    var me = $(this),
        target = me.data('dismiss');

    me.click(function() {
      $(target).fadeOut(function() {
        $(target).remove();
      });
      return false;
    });
  });

  // Collapsable
  $("[data-collapse]").each(function() {
    var me = $(this),
        target = me.data('collapse');

    me.click(function() {
      $(target).collapse('toggle');
      $(target).on('shown.bs.collapse', function() {
        me.html('<i class="fas fa-minus"></i>');
      });
      $(target).on('hidden.bs.collapse', function() {
        me.html('<i class="fas fa-plus"></i>');
      });
      return false;
    });
  });

  // Gallery
  $(".gallery .gallery-item").each(function() {
    var me = $(this);

    me.attr('href', me.data('image'));
    me.attr('title', me.data('title'));
    if(me.parent().hasClass('gallery-fw')) {
      me.css({
        height: me.parent().data('item-height'),
      });
      me.find('div').css({
        lineHeight: me.parent().data('item-height') + 'px'
      });
    }
    me.css({
      backgroundImage: 'url("'+ me.data('image') +'")'
    });
  });
  if(jQuery().Chocolat) { 
    $(".gallery").Chocolat({
      className: 'gallery',
      imageSelector: '.gallery-item',
    });
  }

  // Background
  $("[data-background]").each(function() {
    var me = $(this);
    me.css({
      backgroundImage: 'url(' + me.data('background') + ')'
    });
  });

  // Custom Tab
  $("[data-tab]").each(function() {
    var me = $(this);

    me.click(function() {
      if(!me.hasClass('active')) {
        var tab_group = $('[data-tab-group="' + me.data('tab') + '"]'),
            tab_group_active = $('[data-tab-group="' + me.data('tab') + '"].active'),
            target = $(me.attr('href')),
            links = $('[data-tab="'+me.data('tab') +'"]');

        links.removeClass('active');
        me.addClass('active');
        target.addClass('active');
        tab_group_active.removeClass('active');
      }
      return false;
    });
  });

  // Bootstrap 4 Validation
  $(".needs-validation").submit(function() {
    var form = $(this);
    if (form[0].checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.addClass('was-validated');
  });

  // alert dismissible
  $(".alert-dismissible").each(function() {
    var me = $(this);

    me.find('.close').click(function() {
      me.alert('close');
    });
  });

  if($('.main-navbar').length) {
  }

  // Image cropper
  $('[data-crop-image]').each(function(e) {
    $(this).css({
      overflow: 'hidden',
      position: 'relative',
      height: $(this).data('crop-image')
    });
  });

  // Slide Toggle
  $('[data-toggle-slide]').click(function() {
    let target = $(this).data('toggle-slide');

    $(target).slideToggle();
    return false;
  });

  // Dismiss modal
  $("[data-dismiss=modal]").click(function() {
    $(this).closest('.modal').modal('hide');

    return false;
  });

  // Width attribute
  $('[data-width]').each(function() {
    $(this).css({
      width: $(this).data('width')
    });
  });
  
  // Height attribute
  $('[data-height]').each(function() {
    $(this).css({
      height: $(this).data('height')
    });
  });

  // Chocolat
  if($('.chocolat-parent').length && jQuery().Chocolat) {
    $('.chocolat-parent').Chocolat();
  }

  // Sortable card
  if($('.sortable-card').length && jQuery().sortable) {
    $('.sortable-card').sortable({
      handle: '.card-header',
      opacity: .8,
      tolerance: 'pointer'
    });
  }

  // Daterangepicker
  if(jQuery().daterangepicker) {
    if($(".datepicker").length) {
      $('.datepicker').daterangepicker({
        locale: {format: 'YYYY-MM-DD'},
        singleDatePicker: true,
      });
    }
    if($(".datetimepicker").length) {
      $('.datetimepicker').daterangepicker({
        locale: {format: 'YYYY-MM-DD hh:mm'},
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true,
      });
    }
    if($(".daterange").length) {
      $('.daterange').daterangepicker({
        locale: {format: 'YYYY-MM-DD'},
        drops: 'down',
        opens: 'right'
      });
    }
  }

  // Timepicker
  if(jQuery().timepicker && $(".timepicker").length) {
    $(".timepicker").timepicker({
      icons: {
        up: 'fas fa-chevron-up',
        down: 'fas fa-chevron-down'
      }
    });
  }
});
/*
 Copyright (C) Federico Zivolo 2017
 Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).
 */(function(a,b){'object'==typeof exports&&'undefined'!=typeof module?module.exports=b(require('popper.js')):'function'==typeof define&&define.amd?define(['popper.js'],b):a.Tooltip=b(a.Popper)})(this,function(a){'use strict';function b(a){return a&&'[object Function]'==={}.toString.call(a)}a=a&&'default'in a?a['default']:a;var c=function(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')},d=function(){function a(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,'value'in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),e=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},f={container:!1,delay:0,html:!1,placement:'top',title:'',template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',offset:0},g=function(){function g(a,b){c(this,g),h.call(this),b=e({},f,b),a.jquery&&(a=a[0]),this.reference=a,this.options=b;var d='string'==typeof b.trigger?b.trigger.split(' ').filter(function(a){return-1!==['click','hover','focus'].indexOf(a)}):[];this._isOpen=!1,this._popperOptions={},this._setEventListeners(a,d,b)}return d(g,[{key:'_create',value:function(a,c,d,e){var f=window.document.createElement('div');f.innerHTML=c.trim();var g=f.childNodes[0];g.id='tooltip_'+Math.random().toString(36).substr(2,10),g.setAttribute('aria-hidden','false');var h=f.querySelector(this.innerSelector);if(1===d.nodeType||11===d.nodeType)e&&h.appendChild(d);else if(b(d)){var i=d.call(a);e?h.innerHTML=i:h.innerText=i}else e?h.innerHTML=d:h.innerText=d;return g}},{key:'_show',value:function(b,c){if(this._isOpen&&!this._isOpening)return this;if(this._isOpen=!0,this._tooltipNode)return this._tooltipNode.style.display='',this._tooltipNode.setAttribute('aria-hidden','false'),this.popperInstance.update(),this;var d=b.getAttribute('title')||c.title;if(!d)return this;var f=this._create(b,c.template,d,c.html);b.setAttribute('aria-describedby',f.id);var g=this._findContainer(c.container,b);return this._append(f,g),this._popperOptions=e({},c.popperOptions,{placement:c.placement}),this._popperOptions.modifiers=e({},this._popperOptions.modifiers,{arrow:{element:this.arrowSelector},offset:{offset:c.offset}}),c.boundariesElement&&(this._popperOptions.modifiers.preventOverflow={boundariesElement:c.boundariesElement}),this.popperInstance=new a(b,f,this._popperOptions),this._tooltipNode=f,this}},{key:'_hide',value:function(){return this._isOpen?(this._isOpen=!1,this._tooltipNode.style.display='none',this._tooltipNode.setAttribute('aria-hidden','true'),this):this}},{key:'_dispose',value:function(){var a=this;return this._events.forEach(function(b){var c=b.func,d=b.event;a.reference.removeEventListener(d,c)}),this._events=[],this._tooltipNode&&(this._hide(),this.popperInstance.destroy(),!this.popperInstance.options.removeOnDestroy&&(this._tooltipNode.parentNode.removeChild(this._tooltipNode),this._tooltipNode=null)),this}},{key:'_findContainer',value:function(a,b){return'string'==typeof a?a=window.document.querySelector(a):!1===a&&(a=b.parentNode),a}},{key:'_append',value:function(a,b){b.appendChild(a)}},{key:'_setEventListeners',value:function(a,b,c){var d=this,e=[],f=[];b.forEach(function(a){'hover'===a?(e.push('mouseenter'),f.push('mouseleave')):'focus'===a?(e.push('focus'),f.push('blur')):'click'===a?(e.push('click'),f.push('click')):void 0}),e.forEach(function(b){var e=function(b){!0===d._isOpening||(b.usedByTooltip=!0,d._scheduleShow(a,c.delay,c,b))};d._events.push({event:b,func:e}),a.addEventListener(b,e)}),f.forEach(function(b){var e=function(b){!0===b.usedByTooltip||d._scheduleHide(a,c.delay,c,b)};d._events.push({event:b,func:e}),a.addEventListener(b,e)})}},{key:'_scheduleShow',value:function(a,b,c){var d=this;this._isOpening=!0;var e=b&&b.show||b||0;this._showTimeout=window.setTimeout(function(){return d._show(a,c)},e)}},{key:'_scheduleHide',value:function(a,b,c,d){var e=this;this._isOpening=!1;var f=b&&b.hide||b||0;window.setTimeout(function(){if((window.clearTimeout(e._showTimeout),!1!==e._isOpen)&&document.body.contains(e._tooltipNode)){if('mouseleave'===d.type){var f=e._setTooltipNodeEvent(d,a,b,c);if(f)return}e._hide(a,c)}},f)}}]),g}(),h=function(){var a=this;this.show=function(){return a._show(a.reference,a.options)},this.hide=function(){return a._hide()},this.dispose=function(){return a._dispose()},this.toggle=function(){return a._isOpen?a.hide():a.show()},this.arrowSelector='.tooltip-arrow, .tooltip__arrow',this.innerSelector='.tooltip-inner, .tooltip__inner',this._events=[],this._setTooltipNodeEvent=function(b,c,d,e){var f=b.relatedreference||b.toElement||b.relatedTarget;return!!a._tooltipNode.contains(f)&&(a._tooltipNode.addEventListener(b.type,function d(f){var g=f.relatedreference||f.toElement||f.relatedTarget;a._tooltipNode.removeEventListener(b.type,d),c.contains(g)||a._scheduleHide(c,e.delay,e,f)}),!0)}};return g});
//# sourceMappingURL=tooltip.min.js.map