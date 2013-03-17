(function() {

  (function($, window) {
    var $ui, $uis, bindUI, buildUI, changeStepHash, clearSpotAnimations, closureAnimation, currentStep, defaultAnimationDelay, doEntranceAnimations, doSpotAnimations, entrance, getHashParams, goToStep, init, keyboardNav, nextStep, previousStep, readStepFromHash, renderSpotAnimation, resize, scrollDuration, showSpot, spotsPosition, stepsPosition;
    $ui = $uis = null;
    currentStep = 0;
    scrollDuration = 300;
    defaultAnimationDelay = 300;
    entrance = {
      fadeIn: {
        from: {
          opacity: 0
        },
        to: {
          opacity: 1
        }
      },
      up: {
        from: {
          top: 100,
          opacity: 0
        },
        to: {
          top: 0,
          opacity: 1
        }
      },
      down: {
        from: {
          top: -100,
          opacity: 0
        },
        to: {
          top: 0,
          opacity: 1
        }
      },
      left: {
        from: {
          left: 100,
          opacity: 0
        },
        to: {
          left: 0,
          opacity: 1
        }
      },
      right: {
        from: {
          left: -100,
          opacity: 0
        },
        to: {
          left: 0,
          opacity: 1
        }
      },
      zoomIn: {
        from: {
          transform: "scale(0)",
          opacity: 0
        },
        to: {
          transform: "scale(1)",
          opacity: 1
        }
      },
      zoomOut: {
        from: {
          transform: "scale(2)",
          opacity: 0
        },
        to: {
          transform: "scale(1)",
          opacity: 1
        }
      }
    };
    init = function() {
      buildUI();
      stepsPosition();
      spotsPosition();
      bindUI();
      $("body").removeClass("js-loading");
      readStepFromHash();
      return new FastClick(document.body);
    };
    buildUI = function() {
      $ui = $("#container");
      return $uis = {
        steps: $ui.find(".step"),
        spots: $ui.find(".spot"),
        navitem: $("#overflow .to-step"),
        previous: $("#overflow .nav .arrows .previous"),
        next: $("#overflow .nav .arrows .next")
      };
    };
    bindUI = function() {
      $uis.steps.on("click", ".spot", showSpot);
      $uis.previous.on("click", previousStep);
      $uis.next.on("click", nextStep);
      $(window).keydown(keyboardNav);
      $(window).resize(resize);
      return $(window).hashchange(readStepFromHash);
    };
    stepsPosition = function() {
      return $uis.steps.each(function(i, step) {
        var $previousStep, $step;
        $step = $(step);
        if (i > 0) {
          $previousStep = $uis.steps.eq(i - 1);
          return $step.css("left", $previousStep.position().left + $previousStep.width());
        }
      });
    };
    spotsPosition = function() {
      return $uis.spots.each(function(i, spot) {
        var $spot;
        $spot = $(spot);
        $spot.css("margin-left", $spot.outerWidth() / -2);
        return $spot.css("margin-top", $spot.outerHeight() / -2);
      });
    };
    showSpot = function(event) {
      var $this;
      $this = $(this);
      if ($this.data("html")) {
        return alert($this.data("html"));
      }
    };
    keyboardNav = function(event) {
      switch (event.keyCode) {
        case 37:
          previousStep();
          break;
        case 38:
          previousStep();
          break;
        case 39:
          nextStep();
          break;
        case 40:
          nextStep();
          break;
        default:
          return;
      }
      return event.preventDefault();
    };
    previousStep = function() {
      return changeStepHash(1 * currentStep - 1);
    };
    nextStep = function() {
      return changeStepHash(1 * currentStep + 1);
    };
    changeStepHash = function(step) {
      if (step >= 0 && step < $uis.steps.length) {
        return location.hash = "#step=" + step;
      }
    };
    goToStep = function(step) {
      var $body;
      if (step >= 0 && step < $uis.steps.length) {
        currentStep = 1 * step;
        jQuery.scrollTo.window().queue([]).stop();
        $ui.scrollTo($uis.steps.eq(currentStep), scrollDuration);
        $uis.steps.removeClass("js-current").eq(currentStep).addClass("js-current");
        $body = $("body");
        $body.toggleClass("js-first", currentStep === 0);
        $body.toggleClass("js-last", currentStep === $uis.steps.length - 1);
        $uis.steps.eq(currentStep).find(".spot[data-entrance] .js-animation-wrapper").addClass("hidden");
        clearSpotAnimations();
        return setTimeout(doEntranceAnimations, scrollDuration);
      }
    };
    doEntranceAnimations = function() {
      var $step, queue;
      doSpotAnimations();
      $step = $uis.steps.filter(".js-current");
      queue = 0;
      return $step.find(".spot[data-entrance]").each(function(i, elem) {
        var $elem, $wrapper, animation, animationKey, delay;
        $elem = $(elem);
        $wrapper = $elem.find(".js-animation-wrapper");
        animationKey = $elem.data("entrance");
        animation = entrance[animationKey];
        if (animation !== undefined) {
          $wrapper.stop().css(animation.from).removeClass("hidden");
          delay = animation.delay || defaultAnimationDelay;
          if ($elem.data("queue")) {
            queue++;
          }
          if ($wrapper.t) {
            clearTimeout($wrapper.t);
          }
          return $wrapper.t = setTimeout(function() {
            return $wrapper.animate(animation.to, delay);
          }, delay * queue);
        }
      });
    };
    clearSpotAnimations = function() {
      return $uis.spots.each(function(i, spot) {
        var $spot;
        $spot = $(spot);
        if ($spot.d) {
          window.cancelAnimationFrame($spot.d);
          return delete $spot.d;
        }
      });
    };
    doSpotAnimations = function() {
      var $spots, $step;
      $step = $uis.steps.filter(".js-current");
      $spots = $step.find(".spot");
      return $spots.each(function(i, spot) {
        var data, requestField, requestParams;
        data = $(spot).data();
        requestField = "d";
        if (data["background"] && data["backgroundDirection"] !== undefined) {
          $(spot).css("background-position", "0 0");
          if (spot[requestField]) {
            window.cancelAnimationFrame(spot[requestField]);
          }
          requestParams = closureAnimation(spot, requestField, renderSpotAnimation);
          return spot[requestField] = window.requestAnimationFrame(requestParams);
        }
      });
    };
    renderSpotAnimation = function(spot) {
      var $spot, data, directions, speed;
      $spot = $(spot);
      data = $spot.data();
      directions = ("" + data["backgroundDirection"]).split(" ");
      speed = data["backgroundSpeed"] || 3;
      return $(directions).each(function(i, direction) {
        var radian, x, x0, y, y0;
        switch (direction) {
          case "left":
            return $spot.css("backgroundPositionX", "-=" + speed);
          case "right":
            return $spot.css("backgroundPositionX", "+=" + speed);
          case "top":
            return $spot.css("backgroundPositionY", "-=" + speed);
          case "bottom":
            return $spot.css("backgroundPositionY", "+=" + speed);
          default:
            if (!isNaN(direction)) {
              radian = direction * Math.PI / 180.0;
              x0 = $spot.css("backgroundPositionX");
              y0 = $spot.css("backgroundPositionY");
              x = speed * Math.cos(radian);
              y = speed * Math.sin(radian);
              $spot.css("backgroundPositionX", "+=" + x);
              return $spot.css("backgroundPositionY", "+=" + y);
            }
        }
      });
    };
    closureAnimation = function(elem, requestField, func) {
      return function() {
        if (elem[requestField]) {
          elem[requestField] = window.requestAnimationFrame(closureAnimation(elem, requestField, func));
        }
        return func(elem);
      };
    };
    resize = function() {
      return stepsPosition();
    };
    readStepFromHash = function() {
      return goToStep(getHashParams().step || 0);
    };
    getHashParams = function() {
      var a, d, e, hashParams, q, r;
      hashParams = {};
      e = void 0;
      a = /\+/g;
      r = /([^&;=]+)=?([^&;]*)/g;
      d = function(s) {
        return decodeURIComponent(s.replace(a, " "));
      };
      q = window.location.hash.substring(1);
      while (e = r.exec(q)) {
        hashParams[d(e[1])] = d(e[2]);
      }
      return hashParams;
    };
    return $(window).load(init);
  })(jQuery, window);

}).call(this);
