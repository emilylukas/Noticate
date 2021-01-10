var express = require('express');
var router = express.Router();

const multer = require("multer"); 
const uuid = require("uuid").v4;

var mongodb = require('mongodb');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
      const { originalname } = file;
      cb(null, originalname); 
  }
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const upload = multer({storage})
const app = express();
router.use(express.static('public'));

router.post("/upload", upload.single('avatar'), (req, res) => {
    return res.json({status: "OK"});
});

router.get('/thelist', function(req, res){
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://ec2-18-222-146-206.us-east-2.compute.amazonaws.com:27017/sampsite';
	MongoClient.connect(url, function(err, db){
		if(err){
			console.log("unable to connect", err);
		}
		else{
			console.log("connection established");
			var collection = db.collection('students');
			collection.find({}).toArray(function(err, result){
				if(err){
					res.send(err);
				}
				else if(result.length){
					res.render('studentlist', {
						"studentList": result;
					})
				}
				else
					res.send("no documents found");
			db.close();
			});
		}
	});
});

module.exports = router;
