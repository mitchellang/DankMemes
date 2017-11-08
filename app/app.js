var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.render('index');
});

app.post('/analyze', function (req, res) {
	var tags = req.body.tags;
	// console.log(tags);
	if (tags === undefined) {
		res.status(400).send('Invalid format.');
		return;
	}
	if (tags.length === 0) {
		res.status(400).send('Not enough tags!');
		return;
	}
	var cmd = "python3 ~/analyze.py";
	for (var i = 0; i < tags.length; i++) {
		cmd += " " + tags[i];
	}
	exec(cmd, function(error, stdout, stderr) {
		if (error) {
			console.log("Error!");
			res.status(500).send('Error!');
			return;
		}
		var output = stdout;
		output = output.split("\n");
		console.log(output);
		if (output.length === 4) {
			res.json({"1": output[0], "2": output[1], "3": output[2]});
		} else {
			res.status(500).send('Output length not 4');
			return;
		}
	});
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});