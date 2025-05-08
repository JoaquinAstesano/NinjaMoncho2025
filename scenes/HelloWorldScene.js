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
    this.load.image("fondomenu", "./public/assets/FondoMenu.jpg");
    this.load.image("plataform", "./public/assets/platform.png");
    this.load.image("ninja","./public/assets/Ninja.png")
    this.load.image("diamond", "./public/assets/diamond.png");
    this.load.image("square", "./public/assets/square.png");
    this.load.image("triangle", "./public/assets/triangle.png");
    this.load.image("bomb", "./public/assets/bomb.png"); 
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
    
    // Contador de tiempo
    this.timeLeft = 60; // 60 segundos
    this.timerText = this.add.text(16, 16, `Tiempo: ${this.timeLeft}`, { fontSize: '32px', fill: '#FFF' });

    this.time.addEvent({
      delay: 1000, // 1 segundo
      callback: () => {
        this.timeLeft--; // Reducir el tiempo restante
        this.timerText.setText(`Tiempo: ${this.timeLeft}`); // Actualizar el texto del temporizador
        if (this.timeLeft <= 0) {
          this.gameOver(); // Llamar a la función de Game Over
        }
      },
      loop: true,
    });

    // Crear un suelo invisible para detectar colisiones con los objetos que caen
    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 600, "plataform").setScale(2, 0.1).refreshBody(); // Suelo invisible fuera de la pantalla

    // Puntuación inicial
    this.score = 0;
    this.scoreText = this.add.text(16, 50, `Puntos: ${this.score}`, { fontSize: '32px', fill: '#FFF' });

    // Función para manejar colisiones con la plataforma y el suelo
    const handleCollision = (object) => {
      if (object.valor > 0) {
        object.valor -= 5; // Reducir el valor en 5
        if (object.valor <= 0) {
          object.destroy(); // Destruir el objeto si el valor llega a 0
        }
      } else if (object.rebotes !== undefined) {
        object.rebotes++; // Incrementar contador de rebotes para bombas
        if (object.rebotes >= 2) {
          object.destroy(); // Destruir la bomba después de 2 rebotes
        }
      }
    };

    // Evento para generar bombas cada 3 segundos
    this.time.addEvent({
      delay: 3000, // 3 segundos
      callback: () => {
        const x = Phaser.Math.Between(50, 750); // Posición aleatoria en x
        const fallingBomb = this.physics.add.sprite(x, 50, "bomb").setScale(0.5); // Crear bomba

        fallingBomb.valor = -10; // La bomba descuenta 10 puntos
        fallingBomb.rebotes = 0; // Contador de rebotes para las bombas

        // Configurar rebote
        fallingBomb.setBounce(0.8); // Rebote ajustado para las bombas
        fallingBomb.setCollideWorldBounds(true); // Evitar que salga del mundo

        // Colisión con la plataforma y el suelo
        this.physics.add.collider(fallingBomb, this.platform, () => handleCollision(fallingBomb));
        this.physics.add.collider(fallingBomb, this.ground, () => handleCollision(fallingBomb));

        // Detectar superposición con el ninja y destruir la bomba
        this.physics.add.overlap(fallingBomb, this.ninja, () => {
          this.score += fallingBomb.valor; // Restar puntos
          this.scoreText.setText(`Puntos: ${this.score}`); // Actualizar texto de puntuación
          if (this.score >= 100) { // Condición de victoria al llegar a 100 puntos
            this.victory(); // Llamar a la función de victoria
          }
          fallingBomb.destroy(); // Destruir la bomba
        });
      },
      loop: true,
    });

    // Evento para generar otros objetos cada 1 segundo
    this.time.addEvent({
      delay: 1000, // 1 segundo
      callback: () => {
        const x = Phaser.Math.Between(50, 750); // Posición aleatoria en x
        const tipo = Phaser.Utils.Array.GetRandom(["triangle", "square", "diamond"]);
        const fallingObject = this.physics.add.sprite(x, 50, tipo).setScale(0.5); // Crear objeto

        // Asignar valor al objeto
        fallingObject.valor = tipo === "square" ? 5 : tipo === "triangle" ? 10 : 15;

        // Configurar rebote
        fallingObject.setBounce(0.8); // Rebote ajustado para todas las figuras
        fallingObject.setCollideWorldBounds(true); // Evitar que salga del mundo

        // Colisión con la plataforma y el suelo
        this.physics.add.collider(fallingObject, this.platform, () => handleCollision(fallingObject));
        this.physics.add.collider(fallingObject, this.ground, () => handleCollision(fallingObject));

        // Detectar superposición con el ninja y destruir el objeto
        this.physics.add.overlap(fallingObject, this.ninja, () => {
          this.score += fallingObject.valor; // Sumar puntos
          this.scoreText.setText(`Puntos: ${this.score}`); // Actualizar texto de puntuación
          if (this.score >= 100) { // Condición de victoria al llegar a 100 puntos
            this.victory(); // Llamar a la función de victoria
          }
          fallingObject.destroy(); // Destruir el objeto
        });
      },
      loop: true,
    });
  }

  update() {
    const speed = 200;

    
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
  gameOver() {
    // Cambiar a la escena de fin con el mensaje de derrota
    this.scene.start("end-scene", { message: "¡Perdiste!" });
  }

  victory() {
    // Cambiar a la escena de fin con el mensaje de victoria
    this.scene.start("end-scene", { message: "¡Ganaste!" });
  }
}

