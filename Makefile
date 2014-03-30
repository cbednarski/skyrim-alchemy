lint:
	jshint --verbose src/
	plato -d plato src/
	open plato/index.html
data:
	php data/buildjson.php
.PHONY: data