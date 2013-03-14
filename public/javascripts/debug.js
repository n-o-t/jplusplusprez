$(function() {
    console.log("Debug mode unable.")

    $(".spot" ).draggable({
        stop: function( event, ui ) {

            // Shortcut
            var $this = $(this),
                $step = $this.parents(".step"),
            // Data
                 step = $this.data("step"),
                 spot = $this.data("spot")
                 page = $step.data("page");

            var left = parseInt( $this.css("left")) /  ($step.width() / 100),
                top  = parseInt( $this.css("top")) / ( $step.height() / 100);

            // Round the values at 4 decimals
            left = ( ~~(left*10000)/10000 )+"%";
            top  = ( ~~(top*10000)/10000  )+"%";

            // Update position with percentage
            $this.css("left", left);
            $this.css("top", top);


            // Send the value to update the json
            $.getJSON("/"+page+"/"+step+"/"+spot, {left: left, top: top}, console.log)
        }
    });
})
