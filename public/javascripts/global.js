;(function($, window) {

    var $ui = $uis = null;
    var currentStep = 0;
    var scrollDuration = 300;
    var defaultAnimationDelay = 300; 

    // Aniamations patterns
    var animations = {
        fadeIn: {            
            from: { opacity:0 },
            to: { opacity:1 }
        },
        up: {
            from: { top: 100, opacity: 0 },
            to: { top: 0,   opacity: 1 }
        },
        down: {
            from: { top: -100, opacity: 0 },
            to: { top: 0,   opacity: 1 }
        },
        left: {
            from: { left: 100, opacity: 0 },
            to: { left: 0,   opacity: 1 }
        },
        right: {
            from: { left: -100, opacity: 0 },
            to: { left: 0,   opacity: 1 }
        },
        zoomIn: {
            from: { transform: "scale(0)", opacity: 0 },
            to: { transform: "scale(1)",  opacity: 1 }
        },
        zoomOut: {
            from: { transform: "scale(2)", opacity: 0 },
            to: { transform: "scale(1)",  opacity: 1 }
        }
    };


    var init = function() {        
        buildUI();       
        stepsPosition();
        spotsPosition();
        bindUI();
        goToStep(0);
        // Remove loading overlay
        $("body").removeClass("js-loading");
    };

    var buildUI = function() {
        $ui = $("#container");
        $uis = {
            steps:    $ui.find(".step"),
            spots:    $ui.find(".spot"),
            navitem:  $("#overflow .to-step"),
            previous: $("#overflow nav .arrows .previous"),
            next:     $("#overflow nav .arrows .next")
        };
    };

    var bindUI = function() {
        $uis.steps.on("click", ".spot", showSpot);
        $uis.navitem.on("click", navitemClick);
        $uis.previous.on("click", previousStep);
        $uis.next.on("click", nextStep);
        $(window).keydown(keyboardNav);
        $(window).resize(resize);
    };

    var stepsPosition = function() {        
        $uis.steps.each(function(i, step) {
            var $step = $(step);            
            // Do not position the first step
            if(i > 0) {
                var $previousStep = $uis.steps.eq(i-1);
                $step.css("left", $previousStep.position().left + $previousStep.width() );
            }
        });
    };

    var spotsPosition = function() {
        // Add a negative margin on each spot
        // (position the spot from its center)
        $uis.spots.each(function(i, spot) {
            var $spot = $(spot);   
            $spot.css("margin-left", $spot.outerWidth()/-2 );
            $spot.css("margin-top", $spot.outerHeight()/-2 );
        });
    };

    var showSpot = function(event) {
        var $this = $(this);        
        if( $this.data("html") ) {
            alert( $this.data("html") )
        }
    };

    var keyboardNav = function(event) {            
        switch(event.keyCode) {
            // Left and up
            case 37: previousStep(); break;
            case 38: previousStep(); break;
            // Right and down
            case 39: nextStep(); break;     
            case 40: nextStep(); break;            
            // Stop here for the other keys
            default: return;
        }
        event.preventDefault();
    };    

    var previousStep = function() {
        goToStep(currentStep  - 1);
    };

    var nextStep = function() {
        goToStep(currentStep  + 1);
    };

    var goToStep = function(step) {
        if(step >= 0 && step < $uis.steps.length) {
            // Update the current step id
            currentStep = step;            
            // Prevent scroll queing
            jQuery.scrollTo.window().queue([]).stop();
            // And scroll to the current step
            $ui.scrollTo( $uis.steps.eq(currentStep) , scrollDuration);            
            // Remove current class
            $uis.steps.removeClass("js-current").eq(currentStep).addClass("js-current");
            // Add a class to[] the body
            var $body = $("body");
            // Is this the first step ?
            $body.toggleClass("js-first", currentStep === 0);
            // Is this the last step ?
            $body.toggleClass("js-last", currentStep === $uis.steps.length-1);
            // Hides element with entrance
            $uis.steps.eq(currentStep).find(".spot[data-entrance] .js-animation-wrapper").addClass("hidden");
            // Add the entrance animation after the scroll
            setTimeout(doStepAnimations, scrollDuration)
        }        
    };

    var navitemClick = function() {             
        goToStep( $(this).data("step") );
    }

    var doStepAnimations = function() {
        // Find the current step
        var $step = $uis.steps.filter(".js-current");
        // Number of element behind before animate the entrance
        var queue = 0;
        // Find spots with animated entrance
        $step.find(".spot[data-entrance]").each(function(i, elem) {
            
            var $elem = $(elem),
            // Works on an animation wrapper
             $wrapper = $elem.find(".js-animation-wrapper");

            // Get the animation key of the given element
            var animationKey = $elem.data("entrance"),
                   animation = animations[animationKey];

            // If the animation exist
            if(animation != undefined) {
                // Set the original style with visible element
                $wrapper.stop().css(animation.from).removeClass("hidden")
                // Take the default delay or the current animation one
                var delay = animation.delay || defaultAnimationDelay
                // If there is a queue
                if( $elem.data("queue") ) queue++;                
                // Clear existing timeout
                if( $wrapper.t ) clearTimeout( $wrapper.t );
                // Wait a delay...
                $wrapper.t = setTimeout(function() {                        
                    // ...before animate the wrapper
                    $wrapper.animate(animation.to, delay) 
                // ...and increase the queue
                }, delay*queue);
            }
        });
    }

    var resize = function() {
        stepsPosition();
    };


    $(window).load(init);

})(jQuery, window)