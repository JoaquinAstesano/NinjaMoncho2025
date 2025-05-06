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
    this.load.image("cielo", "./public/assets/cielo.webp");
    this.load.image("fondomenu", "./public/assets/phaser3-logo.png");
    this.load.image("plataform", "./public/assets/platform.png");
    this.load.image("ninja","./public/assets/Ninja.png")
    }

  create() {
    // objetos del juego
    this.add.image(400, 300, "cielo").setScale(2);
    this.ninja = this.physics.add.sprite(400, 530, "ninja").setScale(0.125);
    //this.ninja.body.setGravityY(500);

    // platform
    this.platform = this.physics.add.staticGroup(); 
    this.platform.create(400, 585, "plataform").setScale(2, 1.6).refreshBody();
    this.platform.create(700, 350, "plataform").setScale(0.5, 1.2).refreshBody();
    
    // colisiones
    this.physics.add.collider(this.ninja, this.platform);

    // tecclas de movimiento
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.inAir = true
  }

  update() {
    const speed = 200;

    //no movimiento
    
    //movimiento horizontal
    if (this.cursors.left.isDown) {
      this.ninja.setVelocityX(-speed);
    } 
    if (this.cursors.right.isDown) {
      this.ninja.setVelocityX(speed);
    }
    //no movimiento
    if (this.cursors.left.isDown && this.cursors.right.isDown) {
      this.ninja.setVelocityX(0);
      //this.ninja.angle = 0;
    } else if (this.cursors.left.isUp && this.cursors.right.isUp) {
      this.ninja.setVelocityX(0);
    }

    // movimiento vertical
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
    // restringir movimiento horizontal
    if (this.ninja.x < 0 || this.ninja.x > 800) {
      this.ninja.setPosition(400, 500);
    }
  }
}
