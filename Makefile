lint:
	jshint --verbose src/
	plato -d plato src/skyrim-alchemy.js
	open plato/index.html
data:
	php data/buildjson.php
.PHONY: data