const encryption = require("./methods");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const dbName = "msg";
var db;

app.use(bodyParser.json());
app.use(cors());

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err);

  db = client.db(dbName);

  console.log("Connected");
});
app.use(bodyParser.urlencoded({ extended: true }));
var data;
app.get("/api/getMessages", (req, res) => {
  db.collection("msg_data")
    .find()
    .sort({ _id: -1 })
    .toArray()
    .then((results) => {
      console.log(results);
      res.send(results);
    });
  console.log(data);
});

app.delete("/api/deleteAll", (req, res) => {
  db.collection("msg_data")
    .deleteMany({})
    .then((results) => {
      console.log(results.deletedCount);
      res.send(results);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/api/:Id", (req, res) => {
  var d = req.params["Id"];
  db.collection("msg_data")
    .deleteOne({ _id: ObjectId(d) })
    .then((results) => {
      console.log(results.deletedCount);
      res.send(results);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/api/getDecrypted/:id", async (req, res) => {
  var id = req.params["id"];
  var result = await db
    .collection("msg_data")
    .find({ _id: ObjectId(id) })
    .toArray();

  if (result[0].encrypt_type == "Backwards") {
    decrypt = result[0].encrypt_msg.dereverse();
  } else if (result[0].encrypt_type == "Emo-gize") {
    decrypt = result[0].encrypt_msg.deemojize();
  } else {
    decrypt = encryption.deletter_scramble(
      result[0].encrypt_msg,
      result[0].flag
    );
  }

  res.send(decrypt);
});

app.get("/api/:messageId", (req, res) => {
  var d = req.params["messageId"];
  db.collection("msg_data")
    .find({ _id: ObjectId(d) })
    .toArray()
    .then((results) => {
      console.log(results.data + "Hello this iiiiiiii");
      res.send(results);
    });

  //console.log(d);
});

app.put("/api/update/:messageId", (req, res, next) => {
  console.log(req.body);
  if (req.body.encryptType == "Emo-gize") {
    var en = req.body.newMsg.emojize();
  } else if (req.body.encryptType == "Backwards") {
    var en = req.body.newMsg.reverse();
  } else if (req.body.encryptType == "Letter-scramble") {
    var { encrypt: en, a } = encryption.letter_scramble(req.body.newMsg);
  } else {
    en = req.body.newMsg;
  }

  db.collection("msg_data")
    .updateOne(
      { _id: ObjectId(req.params["messageId"]) },
      { $set: { encrypt_msg: en, message: req.body.newMsg } }
    )
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
const alphabets = [..."qwertyuiopasdfghjklzxcvbnm"];
const digits = [..."1234567890"];
const emojis = [
  "1F600",
  "1F603",
  "1F604",
  "1F601",
  "1F606",
  "1F605",
  "1F923",
  "1F602",
  "1F642",
  "1F643",
  "1F609",
  "1F60A",
  "1F607",
  "1F970",
  "1F60D",
  "1F929",
  "1F618",
  "1F617",
  "263A, U+FE0F",
  "1F61A",
  "1F619",
  "1F972",
  "1F60B",
  "1F61B",
  "1F61C",
  "1F92A",
  "1F61D",
  "1F911",
  "1F917",
  "1F92D",
  "1F92B",
  "1F914",
  "1F910",
  "1F928",
  "1F610",
  "1F611",
  "1F636",
  "1F60F",
  "1F612",
  "1F644",
  "1F62C",
  "1F925",
  "1F60C",
  "1F614",
  "1F62A",
  "1F924",
  "1F634",
  "1F637",
  "1F912",
  "1F915",
  "1F922",
  "1F92E",
  "1F927",
  "1F975",
  "1F976",
  "1F974",
  "1F635",
  "1F92F",
  "1F920",
  "1F973",
  "1F978",
  "1F60E",
  "1F913",
  "1F9D0",
  "1F615",
  "1F61F",
  "1F641",
  "2639, U+FE0F",
  "1F62E",
  "1F62F",
  "1F632",
  "1F633",
  "1F97A",
  "1F626",
  "1F627",
  "1F628",
  "1F630",
  "1F625",
  "1F622",
  "1F62D",
  "1F631",
  "1F616",
  "1F623",
  "1F61E",
  "1F613",
  "1F629",
  "1F62B",
  "1F971",
  "1F624",
  "1F621",
  "1F620",
  "1F92C",
  "1F608",
  "1F47F",
  "1F480",
  "2620, U+FE0F",
  "1F4A9",
  "1F921",
  "1F479",
].map((ucp) => String.fromCodePoint(parseInt(ucp, 16)));
const get_emojis_map = () => {
  let ret = {};
  let i = 0;
  alphabets.forEach((a) => {
    ret[a] = emojis[i++];
    ret[a.toUpperCase()] = emojis[i++];
  });
  digits.forEach((d) => {
    ret[d] = emojis[i++];
  });
  return ret;
};
const emoji_map = get_emojis_map();
const get_reverse_object = (obj) => {
  const ret = {};
  Object.keys(obj).forEach((k) => (ret[obj[k]] = k));
  return ret;
};
const reverse_emoji_map = get_reverse_object(emoji_map);
String.prototype.apply_map = function (map) {
  return [...this].map((a) => map[a] || a).join("");
};
String.prototype.emojize = function () {
  return this.apply_map(emoji_map);
};
String.prototype.deemojize = function () {
  return this.apply_map(reverse_emoji_map);
};
String.prototype.reverse = function () {
  return [...this].reverse().join("");
};

String.prototype.dereverse = function () {
  return [...this].reverse().join("");
};

app.post("/api/postmessage", (req, res, next) => {
  console.log(req.body.message);
  if (req.body.encrypt_type == "Backwards") {
    // var en = encryption.backwardEncrypt(req.body.message);
    // var en = [...req.body.message].reverse().join(''); //encryption.backwardEncrypt(req.body.message);
    var en = req.body.message.reverse();
  } else if (req.body.encrypt_type == "Emo-gize") {
    var en = req.body.message.emojize(); //encryption.emojiEncrypt(req.body.message);
  } else if (req.body.encrypt_type == "Letter-scramble") {
    var { encrypt: en, a } = encryption.letter_scramble(req.body.message);
    console.log(`${en}dashdlahsd`);
  } else {
    en = req.body.message;
  }

  db.collection("msg_data")
    .insertOne({
      message: req.body.message,
      encrypt_type: req.body.encrypt_type,
      encrypt_msg: en,
      time: req.body.time,
      flag: a,
    })
    .then((result) => {
      res.send("Success");
      console.log(result.pretty());
    })
    .catch((error) => console.error(error));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
