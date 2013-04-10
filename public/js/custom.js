$poplink = $("#container").find('*[data-toggle]')

$($poplink)
	.popover({
    	trigger		: 'hover',
    	container 	: 'body',
    	html		: true,
    	animation 	: true
  	})
    .click(function(e) {
    	e.preventDefault()
    })