(function () {
enchant();

function main () {

  var game = new Core(640, 640);
  game.fps = 30;
  game.scale = 1;
  game.preload('cup.png', 'body.png', 'blast.png', 'bgm-peep.mp3', 'blastoff.mp3');

  game.addEventListener('load', function () {
    var blenderCup = new Sprite(243, 480);
    blenderCup.image = game.assets['cup.png'];
    blenderCup.position = { x: game.width/2 - blenderCup.width/2, y: game.height/2 - blenderCup.height/2 };
    blenderCup.moveTo(blenderCup.position.x, blenderCup.position.y);

    var blenderBody = new Sprite(243, 480);
    blenderBody.image = game.assets['body.png'];
    blenderBody.position = { x: game.width/2 - blenderBody.width/2, y: game.height/2 - blenderBody.height/2 };
    blenderBody.moveTo(blenderBody.position.x, blenderBody.position.y);

    var blenderBtn4 = new Sprite(20, 44);
    blenderBtn4.position = { x: blenderBody.x + 133, y: blenderBody.y + 381 };
    blenderBtn4.moveTo(blenderBtn4.position.x, blenderBtn4.position.y);
    blenderBtn4.addEventListener('touchstart', function (e) {
      scene.removeChild(blenderBtn4);
      clearInterval(bgmLoop);
      game.assets['bgm-peep.mp3'].stop();
      game.assets['blastoff.mp3'].play();
      lbTop.tl.moveTo(0, 0, 10);
      lbBottom.tl.moveTo(0, game.height-lbBottom.height, 10);

      var blenderCupLine = new Timeline(blenderCup);

      var blast = new Sprite(164, 410);
      blast.image = game.assets['blast.png'];
      blast.visible = false;
      blast.moveTo(blenderCup.x+30, blenderCup.y+246);
      scene.addChild(blast);
      scene.addChild(blenderBody);
      scene.addChild(lbTop);
      scene.addChild(lbBottom);

      blenderCup.tl.delay(120);
      for (var i = 0; i < 20; i++) {
        blenderCup.tl.moveBy(-6, 0, 1);
        blenderCup.tl.moveBy(6, 0, 1);
      }

      var frame = 0;
      scene.addEventListener('enterframe', function(ev) {
        blast.frame = ++frame % 2;
        if (frame > 160) {
          blast.visible = true;
        }
        if (frame > 250) {
          blenderCup.moveBy(0, -10);
        }
        blast.moveTo(blenderCup.x+30, blenderCup.y+246);
      });
      blenderCup.tl.moveBy(0, -20, 70);
      blenderCup.tl.moveBy(0, -100, 50);

    });

    var surface = new Surface(640, 60);
    surface.context.beginPath();
    surface.context.fillStyle = 'black';
    surface.context.fillRect(0, 0, 640, 60);

    var lbTop = new Sprite(640, 60);
    lbTop.image = surface;
    lbTop.moveTo(0, -lbTop.height);

    var lbBottom = new Sprite(640, 60);
    lbBottom.image = surface;
    lbBottom.moveTo(0, game.height);

    var scene = new Scene();
    scene.addChild(blenderCup);
    scene.addChild(blenderBody);
    scene.addChild(blenderBtn4);
    game.replaceScene(scene);

    var bgmLoop = setInterval(function () {
      game.assets['bgm-peep.mp3'].play();
    }, 20000);
  });

  game.start();
}

window.addEventListener('load', main);
})();