
let themes = ["making bad art on mspaint",
"playing my guitar",
"analog video effects",
"liquid lights", 
"CRT glitch",
"I used to play piano", 
"picking up guitar",
"go outside with friends",
"cooking",
"cooking without a recipe",
"playing musical instruments",
"sewing",
"painting",
"Fried Calamari",
"singing and dancing",
"making my own halloween costumes",
"being a soccer fan",
"watching the euros",
"theater related stuff like acting/directing",
"Baseball",
"blåhaj",
"basketball",
"loving music more than anything else",
"Music Production (EDM)",
"working in a veterinary hospital",
"photography",
"basketball",
"vlogs",
"making videos",
"playing trumpet",
"the UCSC Wind ensemble",
"I LOVE seafood!",
"I love anime and animals",
"I like doing handcrafts",
"I like car stuff",
"I like reading manga and watching anime",
"Listening to music is my therapy",
"playing sports",
"biking",
"Art is my main hobby",
"I'm watching Twin Peaks",
"I enjoy doing digital art",
"I like listening and playing music",
"I love motorcycles",
"I love cafe racers",
"working out",
"I like to make comics",
"sports/gym",
"Origami!",
"I do really enjoy anime",
"3d printing",
"I recently got into mixology",
"I can play the drum set"];

themes = [
"Surprise",
"Repair",
"Growth",
"Lost and found",
"Signal Lost",
"You Really Shouldn't Mix Those",
"Limited Energy",
"Mirror"];


class Spin extends Phaser.Scene {
    constructor() {
        super("spinScene");
        this.spin = 0.00001;
        this.max_spin = 0.2;
        this.min_spin = 0.0006;
        this.spin_position = 0.3;
        this.pointerStart = 0.5;
        this.pointerEnd = 0.5;
        this.spin_cutoff = 0.000021;
        
    }

    preload() {
        //
    }

    create() {
        // this.hitZone = this.add.sprite(game.config.width / 2.0, game.config.height / 2.0, 'spritesheet', 'invisible-box').setInteractive().setOrigin(0.5, 0.5);;
        // this.hitZone.width = game.config.width;
        // this.hitZone.height = game.config.height;

        this.themes = Phaser.Math.RND.shuffle(themes);
        this.textWheel = [];
        let prompt_step = 1.0 / themes.length;
        let current_step = 0.0;
        this.textConfig = {
            fontFamily: 'Courier',
            fontWeight: 'bold',
            fontSize: '16px',
            //backgroundColor: '#221104',
            color: '#ccccFF',
            align: 'center',
            padding: {
                top: 5, bottom: 5
            }
        }
        this.textConfigBig = {
            fontFamily: 'Courier',
            fontStyle: 'bold',
            fontSize: '32px',
            backgroundColor: '#330000',
            color: '#F0F0F0',
            align: 'center',
            blendMode: Phaser.BlendModes.ADD,
            shadowBlur: 5,
            shadowFill: true,
            strokeThickness: 10,
            stroke: "#300",
            padding: {
                top: 5, bottom: 5,
                left: 15, right: 15
            }
        }
        
        for(let tval of this.themes) {
            let promptText = this.add.text(game.config.width / 2.0, game.config.height / 2.0, tval, this.textConfig).setOrigin(0.5, 0.5);
            promptText._interpolation = current_step;
            current_step += prompt_step;
            this.textWheel.push(promptText);
        }
        this.primeText = this.add.text(game.config.width / 2.0, game.config.height / 2.0, "Prompt", this.textConfigBig).setOrigin(0.5, 0.5);

        
        //this.input.setDraggable(this.hitZone);

        this.input.on('pointerdown', (pointer) => {
            this.cameras.main.setBackgroundColor("#770000");
            this.pointerStart = pointer.y / game.config.height;
        });
        this.input.on('pointerup', (pointer) => {
            this.cameras.main.setBackgroundColor("#000000");
            this.pointerEnd = pointer.y / game.config.height;
            this.spin += this.min_spin + (Math.abs(this.pointerStart - this.pointerEnd) * 0.005);
            this.pointerStart = 0.5;
            this.pointerEnd = 0.5;
        });

        // this.input.on('dragstart', function (pointer, gameObject) {
        //     gameObject.setTint(0x55ff55);
        //     console.log('dragstart');
        //     this.cameras.main.setBackgroundColor("#770000");
        // });
        // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        //     gameObject.setTint(0x55ff55);
        //     console.log('drag');
        // });
        // this.input.on('dragend', function (pointer, gameObject) {
        //     gameObject.clearTint();
        //     console.log('dragend');
        //     this.cameras.main.setBackgroundColor("#000000");
        // });

    }

    update(time, delta) {
        // let pointer = scene.input.activePointer;
        // if(pointer.isDown) {
        //     scene.cameras.main.setBackgroundColor("#770000");
        // }
        
        if (Math.abs(this.pointerStart - this.pointerEnd) > 0.1) {
            this.spin = 1.0 * (this.pointerStart - this.pointerEnd) * 0.003;
        }

        this.spin_position += delta * this.spin;

        if (this.spin_position < 0.0) {
            this.spin_position += 10.0;
        }
        this.spin_position %= 1.0;

        this.spin *= 0.99; // friction, decay over time
        if (Math.abs(this.spin) < this.spin_cutoff) {
            this.spin = 0; // stop if we get too low
            this.primeText.setAlpha(1.0);
            this.cameras.main.setBackgroundColor("#000000");
        } else {
            this.primeText.setAlpha(0.8 - (Math.abs(this.spin) * 0.8));
            this.cameras.main.setBackgroundColor("#770000");
        }
        let center_count = 0;
        if(this.spin > 0.0) {
            for(let txt of this.textWheel) {
                let offset = (txt._interpolation + this.spin_position) % 1.0;
                offset = Phaser.Math.Interpolation.SmoothStep(offset, -0.1, 1.1);
                let brightness = 1.0 - Math.abs(offset - 0.5);
                txt.y = game.config.height * offset;
                txt.setAlpha(brightness);
                
                
                if(brightness > 0.99) {
                    this.primeText.text = txt.text;
                    center_count += 1;
                }
            }
        }
    }
}

let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 360,
    scene: [Spin],
    numberOfPrompts: 5
}

let game = new Phaser.Game(config);
