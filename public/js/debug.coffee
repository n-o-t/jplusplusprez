window.recordSpotPosition = (spot) ->
    # Shortcuts
    $this = $(spot)
    $step = $this.parents(".step")

    # Data
    step = $this.data("step")
    spot = $this.data("spot")
    page = $step.data("page")
    left = parseInt($this.css("left")) / ($step.width() / 100)
    top = parseInt($this.css("top")) / ($step.height() / 100)

    # Round the values at 4 decimals
    left = (~~(left * 10000) / 10000) + "%"
    top = (~~(top * 10000) / 10000) + "%"

    # Print positions
    console.log left, top

    # Send the value to update the json
    $.getJSON "/" + page + "/" + step + "/" + spot,
      left: left
      top: top

$(window).load ->
    console.log "Debug mode unable."



    $(".spot").draggable stop: (event, ui) ->
        recordSpotPosition(this)

    # Add a focus class to the spot where we click
    $(".spot").on "click", (e) ->
        $(".spot").not(this).removeClass("focus")
        $(this).toggleClass("focus")

    # Disable other key events
    $(window).off("keyup keydown").on "keyup", (e)->        
        $div = $ '.js-current .spot.focus'
        if $div.length
            switch e.which
                # left arrow key
                when 37 then $div.css "left", '-=1%'                                
                # up arrow key                
                when 38 then $div.css "top", '-=1%'                                
                # right arrow key                
                when 39 then $div.css "left", '+=1%'                                
                # bottom arrow key                
                when 40 then $div.css "top", '+=1%'
                # Or stop here
                else return

            # Record the div position
            recordSpotPosition $div