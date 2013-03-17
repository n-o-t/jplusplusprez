# Dependencies
# Well, it's jQuery! 
#= require vendor/jquery-1.7.1.min.js

# Improve the touch experience by removing the tap delay
#= require vendor/fastclick.js

# Helper to bind the hash change event
#= require vendor/jquery-hashchange.js

# Allow jQuery to animate 2D transformations
#= require vendor/jquery.transform2d.js

# Imrpove the jQuery animate method by using CSS3 transitions when possible
#= require vendor/jquery.animate-enhanced.min.js

# Add the scrollTo method to jQuery
#= require vendor/jquery.scrollTo.min.js

# Add a better support for background position within the CSS method
#= require vendor/bgpos.js

# Patch the requestAnimationFrame function for better compatibility
#= require vendor/rAF.js


(($, window) ->
  $ui = $uis = null
  currentStep = 0
  scrollDuration = 300
  defaultAnimationDelay = 300
  
  # Entrance animations patterns
  entrance =
    fadeIn:
      from:
        opacity: 0

      to:
        opacity: 1

    up:
      from:
        top: 100
        opacity: 0

      to:
        top: 0
        opacity: 1

    down:
      from:
        top: -100
        opacity: 0

      to:
        top: 0
        opacity: 1

    left:
      from:
        left: 100
        opacity: 0

      to:
        left: 0
        opacity: 1

    right:
      from:
        left: -100
        opacity: 0

      to:
        left: 0
        opacity: 1

    zoomIn:
      from:
        transform: "scale(0)"
        opacity: 0

      to:
        transform: "scale(1)"
        opacity: 1

    zoomOut:
      from:
        transform: "scale(2)"
        opacity: 0

      to:
        transform: "scale(1)"
        opacity: 1


  ###*
   * Initializrs the page 
  ###
  init = ->
    buildUI()
    stepsPosition()
    spotsPosition()
    bindUI()    
    # Remove loading overlay
    $("body").removeClass "js-loading"    
    # Read the step from the hash
    readStepFromHash()    
    # Activate fast click to avoid tap delay on touch screen
    new FastClick(document.body)

  ###*
   * Gets every jquery shortcuts
   * @return {Object} Main page container
  ###
  buildUI = ->
    $ui = $("#container")
    $uis =
      steps: $ui.find(".step")
      spots: $ui.find(".spot")
      navitem: $("#overflow .to-step")
      previous: $("#overflow .nav .arrows .previous")
      next: $("#overflow .nav .arrows .next")
    return $ui

  ###*
   * Bind javascript event on page elements
   * @return {Object} jQuest window ibject
  ###
  bindUI = ->
    $uis.steps.on "click", ".spot", showSpot
    $uis.previous.on "click", previousStep
    $uis.next.on "click", nextStep
    $(window).keydown keyboardNav
    $(window).resize resize
    $(window).hashchange readStepFromHash

  ###*
   * Position every steps in the container
   * @return {Array} Steps list
  ###
  stepsPosition = ->
    $uis.steps.each (i, step) ->
      $step = $(step)
      
      # Do not position the first step
      if i > 0
        $previousStep = $uis.steps.eq(i - 1)
        $step.css "left", $previousStep.position().left + $previousStep.width()

  ###*
   * Position every spots in each steps
   * @return {Array} Spots list
  ###
  spotsPosition = ->
    
    # Add a negative margin on each spot
    # (position the spot from its center)
    $uis.spots.each (i, spot) ->
      $spot = $(spot)
      $spot.css "margin-left", $spot.outerWidth() / -2
      $spot.css "margin-top", $spot.outerHeight() / -2

  ###*
   * TODO: open a contextual popin when clicking on a spot
   * @param  {Object} event Click event
   * @return {[type]}       [description]
  ###
  showSpot = (event) ->
    $this = $(this)
    alert $this.data("html")  if $this.data("html")

  ###*
   * Bind the keyboard keydown event to navigate through the page
   * @param  {Object} event Keydown event
   * @return {Object}       Keydown event
  ###
  keyboardNav = (event) ->
    switch event.keyCode      
      # Left and up
      when 37, 38 then previousStep()      
      # Right and down
      when 39, 40 then nextStep()      
      # Stop here for the other keys
      else return event
    event.preventDefault()

  ###*
   * Go to the previous step
   * @return {Number} New current step number
  ###
  previousStep = ->
    changeStepHash 1 * currentStep - 1

  ###*
   * Go to the next step
   * @return {Number} New current step number
  ###
  nextStep = ->
    changeStepHash 1 * currentStep + 1

  ###*
   * Change the URL hash to fit to the given step
   * @param  {Number} step Target step
   * @return {String}      New location hash
  ###
  changeStepHash = (step=0) ->
    location.hash = "#step=" + step  if step >= 0 and step < $uis.steps.length

  ###*
   * Just go to step directcly
   * @return {Number} New step number
  ###
  readStepFromHash = -> goToStep getHashParams().step or 0

  ###*
   * Slide to the given step
   * @param  {Number} step New current step number
   * @return {Number}      New current step number
  ###
  goToStep = (step=0) ->
    if step >= 0 and step < $uis.steps.length      
      # Update the current step id
      currentStep = 1 * step      
      # Prevent scroll queing
      jQuery.scrollTo.window().queue([]).stop()      
      # And scroll to the current step
      $ui.scrollTo $uis.steps.eq(currentStep), scrollDuration      
      # Remove current class
      $uis.steps.removeClass("js-current").eq(currentStep).addClass "js-current"      
      # Add a class to[] the body
      $body = $("body")      
      # Is this the first step ?
      $body.toggleClass "js-first", currentStep is 0      
      # Is this the last step ?
      $body.toggleClass "js-last", currentStep is $uis.steps.length - 1
      # Hides element with entrance
      $uis.steps.eq(currentStep).find(".spot[data-entrance] .js-animation-wrapper").addClass "hidden"      
      # Clear all spot animations
      clearSpotAnimations()      
      # Add the entrance animation after the scroll
      setTimeout doEntranceAnimations, scrollDuration
    return currentStep

  ###*
   * Set step animations
  ###
  doEntranceAnimations = ->    
    # Launch hotspot background animations
    doSpotAnimations()    
    # Find the current step
    $step = $uis.steps.filter(".js-current")    
    # Number of element behind before animate the entrance
    queue = 0    
    # Find spots with animated entrance
    $step.find(".spot[data-entrance]").each (i, elem) ->
      $elem = $(elem)      
      # Works on an animation wrapper
      $wrapper = $elem.find(".js-animation-wrapper")      
      # Get the animation key of the given element
      animationKey = $elem.data("entrance")
      animation = entrance[animationKey]      

      # If the animation exist
      unless animation is `undefined`        
        # Set the original style with visible element
        $wrapper.stop().css(animation.from).removeClass "hidden"        
        # Take the default delay or the current animation one
        delay = animation.delay or defaultAnimationDelay        
        # If there is a queue
        queue++  if $elem.data("queue")        
        # Clear existing timeout
        clearTimeout $wrapper.t  if $wrapper.t        
        # Wait a delay...
        $wrapper.t = setTimeout(->          
          # ...before animate the wrapper
          $wrapper.animate animation.to, delay        
        # ...and increase the queue
        , delay * queue)


  ###*
   * Clear every spots animations
   * @return {Array} Spots list
  ###
  clearSpotAnimations = ->
    $uis.spots.each (i, spot) ->
      $spot = $(spot)
      if $spot.d
        window.cancelAnimationFrame $spot.d
        delete ($spot.d)

  ###*
   * Trigger spots background animations in the current step
   * @return {Array} List of the spots
  ###
  doSpotAnimations = ->    
    # Find the current step
    $step = $uis.steps.filter(".js-current")    
    # Find its spots
    $spots = $step.find(".spot")
    
    # On each spot, create an animation
    $spots.each (i, spot) ->
      data = $(spot).data()
      requestField = "d"
      
      # Is there a background and an animation on it
      if data["background"] and data["backgroundDirection"] isnt `undefined`        
        # Reset background position
        $(spot).css "background-position", "0 0"        
        # Clear existing request animation frame
        window.cancelAnimationFrame spot[requestField]  if spot[requestField]
        requestParams = closureAnimation(spot, requestField, renderSpotAnimation)        
        # Add animation frame with a closure function
        spot[requestField] = window.requestAnimationFrame(requestParams)

  ###*
   * Process spot rendering
   * @param  {Object} spot Spot html element
   * @return {Array}       Directions array
  ###
  renderSpotAnimation = (spot) ->
    $spot = $(spot)
    data = $spot.data()
    directions = ("" + data.backgroundDirection).split(" ")
    speed = data.backgroundSpeed or 3
    lastRAF = spot.lastRAF or 0
    
    # Skip this render if its too early
    return false if new Date().getTime() - lastRAF < (data.backgroundFrequency or 0)

    # Set the time of the last animation
    spot.lastRAF = new Date().getTime()

    # Allow several animation
    $(directions).each (i, direction) ->
      switch direction
        when "left"
          $spot.css "backgroundPositionX", "-=" + speed
        when "right"
          $spot.css "backgroundPositionX", "+=" + speed
        when "top"
          $spot.css "backgroundPositionY", "-=" + speed
        when "bottom"
          $spot.css "backgroundPositionY", "+=" + speed
        else          
          # We receive a number,
          # we interpret it as a direction degree
          unless isNaN(direction)
            radian = direction * Math.PI / 180.0
            x0 = $spot.css("backgroundPositionX")
            y0 = $spot.css("backgroundPositionY")
            x = speed * Math.cos(radian)
            y = speed * Math.sin(radian)
            $spot.css "backgroundPositionX", "+=" + x
            $spot.css "backgroundPositionY", "+=" + y

  ###*
   * Closure function to execute the given function within the receive element
   * @param  {Object}   elem         HTML element
   * @param  {String}   requestField Name of the field into elem where record the animation frame 
   * @param  {Function} func         Callback function of the animation
  ###
  closureAnimation = (elem, requestField, func) ->
    ->
      # Continue to the next frame                  
      # Add animation frame with a closure function
      elem[requestField] = window.requestAnimationFrame(closureAnimation(elem, requestField, func))  if elem[requestField]      
      # Apply the animation render
      func elem

  ###*
   * Bind the windows rezie event
  ###
  resize = -> stepsPosition()

  ###*
   * Read the parameters into the location hash using the following format:
   * /#foo=2&bar=3
   * @copyright http://stackoverflow.com/questions/4197591/parsing-url-hash-fragment-identifier-with-javascript#comment10274416_7486972
   * @return {Object} Data object]
  ###
  getHashParams = ->
    hashParams = {}
    e = undefined
    a = /\+/g # Regex for replacing addition symbol with a space
    r = /([^&;=]+)=?([^&;]*)/g
    d = (s) ->
      decodeURIComponent s.replace(a, " ")

    q = window.location.hash.substring(1)
    hashParams[d(e[1])] = d(e[2])  while e = r.exec(q)
    hashParams

  # When the window is completely loaded, launch the page !
  $(window).load init

) jQuery, window