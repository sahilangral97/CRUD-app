class methods {
  static backwardEncrypt(msg) {
    var encrypt = "";
    for (var i = msg.length - 1; i >= 0; i--) {
      encrypt += msg[i];
    }
    return encrypt;
  }

  static emojiEncrypt(msg) {
    var encrypt = [];
    const flag = 128455;
    for (var i = 0; i <= msg.length - 1; i++) {
      var e = (msg.charCodeAt(i) + flag).toString(16);
      encrypt.push(e);
    }
    return encrypt;
  }

  static letter_scramble(msg) {
    const a = Math.floor(Math.random() * Math.floor(20));
    var encrypt = "";
    for (var i = 0; i < msg.length; i++) {
      var c = msg.charCodeAt(i);
      if (c >= 97 && c <= 122) {
        var x = c + a;
        if (x <= 122) {
          var s = String.fromCharCode(x);
          encrypt = encrypt + s;
        } else {
          var flag = x - 122;
          var s = String.fromCharCode(96 + flag);
          encrypt = encrypt + s;
        }
      } else if (c >= 65 && c <= 90) {
        var x = c + a;
        if (x <= 90) {
          var s = String.fromCharCode(x);
          encrypt = encrypt + s;
        } else {
          var flag = x - 90;
          var s = String.fromCharCode(64 + flag);
          encrypt = encrypt + s;
        }
      } else {
        encrypt = encrypt + msg[i];
      }
    }

    console.log(encrypt);
    return { encrypt, a };
  }

  static deletter_scramble(msg, a) {
    console.log(msg + " " + a);

    var decrypt = "";
    for (var i = 0; i < msg.length; i++) {
      var c = msg.charCodeAt(i);
      console.log(c);
      if (c >= 97 && c <= 122) {
        var x = c - a;
        if (x >= 97) {
          console.log(x);
          var s = String.fromCharCode(x);
          decrypt = decrypt + s;
        } else {
          var flag = 97 - x;
          console.log(123 - flag);
          var s = String.fromCharCode(123 - flag);
          decrypt = decrypt + s;
        }
      } else if (c >= 65 && c <= 90) {
        var x = c - a;
        if (x >= 65) {
          console.log(x);
          var s = String.fromCharCode(x);
          decrypt = decrypt + s;
        } else {
          var flag = 65 - x;
          console.log(91 - flag);
          var s = String.fromCharCode(91 - flag);
          decrypt = decrypt + s;
        }
      } else {
        decrypt = decrypt + msg[i];
      }
    }
    console.log(decrypt);
    return decrypt;
  }
}

module.exports = methods;
