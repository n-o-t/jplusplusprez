;(function($, window) {

    var $ui = $uis = null;
    var currentStep = 0;
    var scrollDuration = 300;

    var init = function() {        
        buildUI();       
        stepsPosition();
        spotsPosition();
        bindUI();
        goToStep(0);
    };

    var buildUI = function() {
        $ui = $("#container");
        $uis = {
            steps: $ui.find(".step"),
            spots: $ui.find(".spot")
        };
    };

    var bindUI = function() {
        $uis.steps.on("click", ".spot", showSpot);
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
            $uis.steps.removeClass("js-current js-animate").eq(currentStep).addClass("js-current");
            // Add the entrance animation after the scroll
            setTimeout(function() {
                $uis.steps.eq(currentStep).addClass("js-animate");
            }, scrollDuration)
        }
    };

    var resize = function() {
        stepsPosition();
    };

    $(window).load(init);

})(jQuery, window)