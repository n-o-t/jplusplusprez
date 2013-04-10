$poplink = $("#container").find('*[data-toggle]')

$($poplink)
	.popover({
    	trigger		: 'hover',
    	placement 	: 'top',
    	container 	: 'body',
    	html		: true
  	})
    .click(function(e) {
    	e.preventDefault()
    })