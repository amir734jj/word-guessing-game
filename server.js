var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/', express.static('public'));

var port = process.env.PORT || 3000;
var router = express.Router();
const _FILENAME_ = "corpus.txt";
var words = [];

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(_FILENAME_)
});

lineReader.on('line', function (line) {
  line = line.trim();
  words.push(...line.split(/(\s+)/).map(x => x.trim()
       .replace("\"", "")
       .replace("?", "")
       .replace("!", "")
       .replace("'", "")
     ));
});

lineReader.on('close', function () {
  words = words.filter(x => !(/^\s*$/g).test(x));
  words = [...new Set(words)];
});

router.get('/', (req, res) => {
  res.json(words);
});

router.post('/getResult', (req, res) => {
  var str = "";
  for (var index = 0; index < req.body.length; index++) {
    var character = req.body[index] || "";

    if ((/^\s*$/g).test(character)) {
      str += "[a-zA-Z0-9]";
    } else {
      str += `[${character.toLowerCase()}${character.toUpperCase()}]`;
    }
  }

  var regex = new RegExp(str);

  var retVal = [ ...new Set(words.filter(x => x.length === req.body.length && regex.test(x))
                .map(x => x.toLowerCase())) ];

  res.json(retVal);
});

app.use('/api', router);

app.listen(port, () => {
  console.log('Magic happens on port ' + port);
});
