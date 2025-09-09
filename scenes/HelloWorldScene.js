// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
  }

  preload() {
    //assets
    this.load.image("cielo", "./public/assets/Cielo.webp");
    this.load.image("fondomenu", "./public/assets/FondoMenu.jpg");
    this.load.image("plataform", "./public/assets/platform.png");
    this.load.image("ninja","./public/assets/Ninja.png")
    this.load.image("diamond", "./public/assets/diamond.png");
    this.load.image("square", "./public/assets/square.png");
    this.load.image("triangle", "./public/assets/triangle.png");
    this.load.image("bomb", "./public/assets/bomb.png"); 
    }

  create() {
    this.add.image(400, 300, "cielo").setScale(2);
    this.ninja = this.physics.add.sprite(400, 530, "ninja").setScale(0.125);
    //this.ninja.body.setGravityY(500);

    this.platform = this.physics.add.staticGroup(); 
    this.platform.create(400, 585, "plataform").setScale(2, 1.6).refreshBody();
    this.platform.create(700, 350, "plataform").setScale(0.5, 1.2).refreshBody();
                                   
    this.physics.add.collider(this.ninja, this.platform);
 
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.inAir = true

    this.timeLeft = 60; 
    this.timerText = this.add.text(16, 16, `Tiempo: ${this.timeLeft}`, { fontSize: '32px', fill: '#FFF' });

    this.time.addEvent({
      delay: 1000, 
      callback: () => {
        this.timeLeft--; 
        this.timerText.setText(`Tiempo: ${this.timeLeft}`); 
        if (this.timeLeft <= 0) {
          this.gameOver(); 
        }
      },
      loop: true,
    });

    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 600, "plataform").setScale(2, 0.1).refreshBody(); 

    this.score = 0;
    this.scoreText = this.add.text(16, 50, `Puntos: ${this.score}`, { fontSize: '32px', fill: '#FFF' });

    const handleCollision = (object) => {
      if (object.valor > 0) {
        object.valor -= 5;
        if (object.valor <= 0) {
          object.destroy(); 
        }
      } else if (object.rebotes !== undefined) {
        object.rebotes++; 
        if (object.rebotes >= 2) {
          object.destroy(); 
        }
      }
    };

    this.time.addEvent({
      delay: 3000, 
      callback: () => {
        const x = Phaser.Math.Between(50, 750); 
        const fallingBomb = this.physics.add.sprite(x, 50, "bomb").setScale(0.5); 

        fallingBomb.valor = -10; 
        fallingBomb.rebotes = 0; 

        fallingBomb.setBounce(0.8); 
        fallingBomb.setCollideWorldBounds(true); 

        this.physics.add.collider(fallingBomb, this.platform, () => handleCollision(fallingBomb));
        this.physics.add.collider(fallingBomb, this.ground, () => handleCollision(fallingBomb));


        this.physics.add.overlap(fallingBomb, this.ninja, () => {
          this.score += fallingBomb.valor; 
          this.scoreText.setText(`Puntos: ${this.score}`); 
          if (this.score >= 100) { 
            this.victory();
          }
          fallingBomb.destroy(); 
        });
      },
      loop: true,
    });


    this.time.addEvent({
      delay: 1000, 
      callback: () => {
        const x = Phaser.Math.Between(50, 750);
        const tipo = Phaser.Utils.Array.GetRandom(["triangle", "square", "diamond"]);
        const fallingObject = this.physics.add.sprite(x, 50, tipo).setScale(0.5); 

        fallingObject.valor = tipo === "square" ? 5 : tipo === "triangle" ? 10 : 15;

        fallingObject.setBounce(0.8);
        fallingObject.setCollideWorldBounds(true); 

        this.physics.add.collider(fallingObject, this.platform, () => handleCollision(fallingObject));
        this.physics.add.collider(fallingObject, this.ground, () => handleCollision(fallingObject));

        this.physics.add.overlap(fallingObject, this.ninja, () => {
          this.score += fallingObject.valor; 
          this.scoreText.setText(`Puntos: ${this.score}`);
          if (this.score >= 100) { 
            this.victory();
          }
          fallingObject.destroy(); 
        });
      },
      loop: true,
    });
  }

  update() {
    const speed = 200;

    
    if (this.cursors.left.isDown) {
      this.ninja.setVelocityX(-speed);
    } 
    if (this.cursors.right.isDown) {
      this.ninja.setVelocityX(speed);
    }
    if (this.cursors.left.isDown && this.cursors.right.isDown) {
      this.ninja.setVelocityX(0);
      //this.ninja.angle = 0;
    } else if (this.cursors.left.isUp && this.cursors.right.isUp) {
      this.ninja.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.ninja.body.touching.down) {
      this.ninja.setVelocityY(-350);
    } 
    if (this.cursors.down.isDown && this.inAir && !this.ninja.body.touching.down) {
      this.ninja.setVelocityY(300);
      this.inAir = false;
    }
    if (this.ninja.body.touching.down) {
      this.inAir = true;
    }
    if (this.ninja.x < 0 || this.ninja.x > 800) {
    this.ninja.setPosition(400, 500);
    }
  }
  gameOver() {
    this.scene.start("end-scene", { message: "¡Perdiste!", score: this.score });
  }

  victory() {
    // Detener todos los eventos de tiempo para evitar que sigan generando objetos
    this.time.events && this.time.events.removeAll && this.time.events.removeAll();
    this.scene.start("end-scene", { message: "¡Ganaste!", score: this.score });
  }
}

