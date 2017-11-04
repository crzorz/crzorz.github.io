
/*
iphone height: 14.36cm * 0.5 + 0.5 + moveyCount * 0.01
*/

enchant();

window.onload = function () {
	var game = new Core(640, 480);
	game.fps = 30;
	game.scale = 1;
	game.preload('iphone.png', 'iphone-extend.png', 'iphone-foot.png', 'hand.png', 'icon.png', 'icon-head.png', 'icon-body.png', 'icon-foot.png');

	game.onload = function () {
		var gameScene = function () {
			var scene = new Scene();
			iphone = new Sprite(132, 266);
			iphone.image = game.assets['iphone.png'];
			iphone.moveTo(game.width/2 - iphone.width/2, game.height/2 - iphone.height/2);

			hand = new Sprite(282, 336);
			hand.image = game.assets['hand.png'];
			hand.moveTo(game.width/2 - hand.width/2 + 36, game.height/2 - iphone.height/2);
			scene.addChild(hand);
			scene.addChild(iphone);

			var extend = new Sprite(132, 105);
			extend.image = game.assets['iphone-extend.png'];
			extend.moveTo(iphone.x, iphone.y + 133);
			scene.addChild(extend);

			var foot = new Sprite(132, 28);
			foot.image = game.assets['iphone-foot.png'];
			foot.moveTo(extend.x, extend.y + extend.height);
			scene.addChild(foot);

			var timeLeft = 20;
			var timeLeftText = new Label('残り時間　　' + timeLeft);
			scene.addChild(timeLeftText);

			var movey;
			window.moveyCount = 0;
			scene.addEventListener('touchmove', function(evn) {
				if (movey != evn.y) {
					hand.y = evn.y;
					if (Math.abs(movey - evn.y) > 10) {
						++moveyCount;
					}
					if (!(moveyCount % 3)) {
						extend.scaleY = 1 + moveyCount * 0.01;
						extend.y = Math.floor(extend.height * extend.scaleY/2) - extend.height/2 + iphone.y + 133;
						foot.y = Math.floor(extend.height * extend.scaleY/2) + extend.height/2 + extend.y;
					}
				}
				movey = evn.y;
			});

			scene.addEventListener('enterframe', function (evn) {
				if (!(evn.target.age % game.fps)) {
					--timeLeft;
					timeLeftText.text ='残り時間　　' + timeLeft;
				}
				if (timeLeft <= 0) {
					game.replaceScene(resultScene());
				}
			});
			return scene;
		};

		var resultScene = function () {
			var scene = new Scene();

			var icon = new Sprite(30, 60);
			icon.image = game.assets['icon.png'];
			scene.addChild(icon);
			icon.moveTo(0, game.height - icon.height);

			var iconFoot = new Sprite(30, 6);
			iconFoot.image = game.assets['icon-foot.png'];
			scene.addChild(iconFoot);
			iconFoot.moveTo(icon.width * 2, game.height - iconFoot.height);

			var iconBody = new Sprite(30, 24);
			iconBody.image = game.assets['icon-body.png'];
			scene.addChild(iconBody);
			iconBody.moveTo(iconFoot.x, iconFoot.y - iconBody.height);

			var iconHead = new Sprite(30, 30);
			iconHead.image = game.assets['icon-head.png'];
			iconHead.moveTo(iconBody.x, iconBody.y - iconHead.height);
			scene.addChild(iconHead);

			var addScore = 0;
			scene.addEventListener('enterframe', function(evn) {
				if (addScore < moveyCount) {
					addScore += 6;
				}
				else if (addScore != moveyCount) {
					addScore = moveyCount;
				}
				iconBody.scaleY = 1 + addScore * 0.01;
				iconBody.y = iconFoot.y - Math.floor(iconBody.height * iconBody.scaleY/2) - iconBody.height/2;
				iconHead.y = iconFoot.y - Math.floor(iconBody.height * iconBody.scaleY) - iconHead.height +1;    /* +1 is padding */
			});


			var h1 = new Label('結果');
			h1.font = '32px "ＭＳ Ｐゴシック"';
			h1.moveTo(game.width / 3, game.height * 5 / 16);
			scene.addChild(h1);

			var score = 14.36 * (0.5 + 0.5 + moveyCount * 0.01);
			    score = Math.floor(score * 100) / 100;
			var scoreLabel = new Label(score + 'cm');
			scoreLabel.font = '16px "ＭＳ Ｐゴシック"';
			scoreLabel.moveTo(h1.x + 100, game.height * 7 / 16);
			scene.addChild(scoreLabel);


			var replayBtn = new Label('もう1回伸ばす');
			replayBtn.font = '24px "ＭＳ Ｐゴシック"';
			replayBtn.moveTo(game.width * 2 / 3, game.height * 14 / 16);
			scene.addChild(replayBtn);

			replayBtn.addEventListener('touchstart', function () {
				game.replaceScene(gameScene());
			});

			return scene;
		};
		game.replaceScene(gameScene());

	}
	game.start();
}