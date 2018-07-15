(function () {
enchant();

var SaveData = {
  init: function () {
    if (!localStorage['ahoge_data']) {
      this.contents_ = {};
      return this;
    }
    this.contents_ = JSON.parse(localStorage['ahoge_data']);
    return this;
  },

  write: function (key, value) {
    this.contents_[key] = value;
    return this;
  },

  save: function () {
    localStorage['ahoge_data'] = JSON.stringify(this.contents_);
  }
};

// http://write-remember.com/program/javascript/date_diff/
function getDiff(date1Str, date2Str) {
  var date1 = new Date(date1Str);
  var date2 = new Date(date2Str);

  var msDiff = date1.getTime() - date2.getTime();

  var daysDiff = Math.floor(msDiff / (1000 * 60 * 60 *24));

  return ++daysDiff;
}

var main = function () {
  var game = new Core(640, 480);
  game.fps = 30;
  game.scale = 1;
  game.preload('wrist.png', 'salt-hand.png', 'salt.png', 'death-cry.wav', 'death-cry.mp3', 'jam.png', 'jam-stage2.png', 'jam-stage3.png');

  game.addEventListener('load', function () {
    var wrist = new Sprite(248, 512);
    wrist.image = game.assets['wrist.png'];
    wrist.position = { x: game.width/4 - wrist.width/4, y: game.height - wrist.height + 40};
    wrist.moveTo(wrist.position.x, wrist.position.y);
    var wristRect = {
      left: 110,
      top: 200,
      right: 230,
      bottom: 320
    };

    var haveSalt = new Sprite(388, 172);
    haveSalt.image = game.assets['salt-hand.png'];
    haveSalt.visible = false;

    var salt = new Sprite(74, 106);
    salt.image = game.assets['salt.png'];
    salt.visible = false;

    var jam = new Sprite(100, 133);
    jam.scale(0.8, 0.8);
    jam.moveTo(game.width/1.5, game.width/4);
    if (SaveData.contents_.count >= 500 || getDiff(Date.now(), SaveData.contents_.latest) >= 14) {
      jam.image = game.assets['jam-stage3.png'];
    } else if (SaveData.contents_.count >= 100 || getDiff(Date.now(), SaveData.contents_.latest) >= 7) {
      jam.image = game.assets['jam-stage2.png'];
    } else {
      jam.image = game.assets['jam.png'];
    }

    var userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('msie') >= 0 ||
      userAgent.indexOf('trident') >= 0) {
      var voice = game.assets['death-cry.mp3'];
    } else {
      var voice = game.assets['death-cry.wav'];
    }

    var scene = new Scene();
    scene.addChild(jam);
    scene.addChild(wrist);
    scene.addChild(haveSalt);
    scene.addChild(salt);
    game.replaceScene(scene);

    scene.addEventListener('touchstart', function (e) {
      if (!haveSalt.visible || !salt.visible) {
        haveSalt.visible = true;
        salt.visible = true;
      }
      haveSalt.moveTo(e.x - haveSalt.width/12, e.y - haveSalt.height/1.6);
      var haveSaltLine = new Timeline(haveSalt);
      haveSaltLine.moveBy(0, -120 , 3);
      haveSaltLine.moveTo(e.x - haveSalt.width/12, e.y - haveSalt.height/1.6, 3);

      salt.moveTo(haveSalt.x-salt.width+30, haveSalt.y + haveSalt.height-30);
      new Timeline(salt).fadeOut(10);
      new Timeline(salt).show();

      if (e.x >= wrist.x+wristRect.left && e.y >= wrist.y+wristRect.top && e.x <= wrist.x+wristRect.right && e.y <= wrist.y+wristRect.bottom) {
        voice.volume = 1;
        voice.play();
        voice = voice.clone();

        var wristLine = new Timeline(wrist);
        wristLine.moveBy(-25, -2, 2);
        wristLine.moveBy(50, -2, 1);
        wristLine.moveBy(-50, -2, 1);
        wristLine.moveBy(50, -2, 2);
        wristLine.moveBy(-50, -2, 1);
        wristLine.moveBy(50, 2, 1);
        wristLine.moveBy(-50, 2, 2);
        wristLine.moveBy(50, 2, 2);
        wristLine.moveBy(-50, 2, 1);
        wristLine.moveBy(25, 2, 2);
        wristLine.moveTo(wrist.position.x, wrist.position.y, 2);

        SaveData.write('latest', Date.now());
        if (!SaveData.contents_.count) {
          SaveData.contents_.count = 0;
        }
        SaveData.write('count', ++SaveData.contents_.count).save();
      }
    });

    document.getElementById('enchant-stage').addEventListener("mousemove", function(e) {
      if (!haveSalt.visible) {
        haveSalt.visible = true;
      }
      haveSalt.moveTo(e.pageX - haveSalt.width/12, e.pageY - haveSalt.height/1.6);
    });
  });
  game.start();
};

SaveData.init();
window.addEventListener('load', main);
})();