
export default class EndScene extends Phaser.Scene {
  constructor() {
    super("end-scene");
  }

  init(data) {
    this.message = data.message || "Fin del juego";
    this.score = data.score || 0;
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    this.add.text(400, 200, this.message, {
      fontSize: "48px",
      fill: this.message.includes("Ganaste") ? "#0f0" : "#f00",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(400, 300, `Puntuación: ${this.score}`, {
      fontSize: "36px",
      fill: "#fff"
    }).setOrigin(0.5);

    this.add.text(400, 400, "Presiona ESPACIO para reiniciar", {
      fontSize: "28px",
      fill: "#fff"
    }).setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("hello-world");
    });
  }
}
