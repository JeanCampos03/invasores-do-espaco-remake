import Grid from "../enemies/Grid.js";
import Obstacle from "../obstacles/Obstacle.js";
import Particle from "../effects/Particle.js";
import Player from "../player/Player.js";
import SoundEffects from "../effects/SoundEffects.js";
import Star from "../effects/Star.js";
import { NUMBER_STARS } from "../configs/constants.js";
import { GameState } from "./GameState.js";
import ScoreManager from "./ScoreManager.js";
import InputHandler from "./InputHandler.js";
import CollisionSystem from "./CollisionSystem.js";
import ShopService from "../services/ShopService.js";
import StoreCatalog from "../store/StoreCatalog.js";

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.soundEffects = new SoundEffects();
        this.scoreManager = new ScoreManager();
        this.inputHandler = new InputHandler();
        this.collisionSystem = new CollisionSystem();

        this.currentState = GameState.START;
        this.invaderShootInterval = null;
        this.availableSkins = StoreCatalog.getSkins();
        this.ownedSkins = new Set(["skin-default"]);
        this.selectedSkinId = "skin-default";

        this.startScreen = document.querySelector(".start-screen");
        this.storeScreen = document.querySelector(".store-screen");
        this.storeItems = document.querySelector(".store-items");
        this.skinOptions = document.querySelector(".skin-options");
        this.selectedSkinName = document.querySelector(".selected-skin-name");
        this.gameOverScreen = document.querySelector(".game-over");
        this.scoreUi = document.querySelector(".score-ui");
        this.scoreElement = this.scoreUi.querySelector(".score > span");
        this.levelElement = this.scoreUi.querySelector(".level > span");
        this.highElement = this.scoreUi.querySelector(".high > span");
        this.buttonPlay = document.querySelector(".button-play");
        this.buttonRestart = document.querySelector(".button-restart");
        this.buttonHome = document.querySelector(".button-home");
        this.buttonBuy = document.querySelector(".button-buy");
        this.buttonCloseStore = document.querySelector(".button-close-store");

        this.gameOverScreen.remove();

        this.setupCanvas();
        this.setupEntities();
        this.bindUiEvents();
        this.generateStars();
        this.loadStoreData();
        this.gameLoop();
    }

    setupCanvas() {
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        this.ctx.imageSmoothingEnabled = false;
    }

    setupEntities() {
        this.player = new Player(
            this.canvas.width,
            this.canvas.height,
            this.getSelectedSkin()
        );
        this.stars = [];
        this.playerProjectiles = [];
        this.invadersProjectiles = [];
        this.particles = [];
        this.obstacles = [];

        this.initObstacles();

        this.grid = new Grid(
            Math.round(Math.random() * 9 + 1),
            Math.round(Math.random() * 9 + 1)
        );
    }

    initObstacles() {
        const x = this.canvas.width / 2 - 50;
        const y = this.canvas.height - 250;
        const offset = this.canvas.width * 0.15;
        const color = "crimson";

        this.obstacles.push(new Obstacle({ x: x - offset, y }, 100, 20, color));
        this.obstacles.push(new Obstacle({ x: x + offset, y }, 100, 20, color));
    }

    bindUiEvents() {
        this.buttonPlay.addEventListener("click", () => this.start());
        this.buttonRestart.addEventListener("click", () => this.restart());
        this.buttonHome.addEventListener("click", () => this.backToMenu());
        this.buttonBuy.addEventListener("click", () => this.openStore());
        this.buttonCloseStore.addEventListener("click", () => this.closeStore());
    }

    async loadStoreData() {
        try {
            const skins = await ShopService.getCatalog();
            this.availableSkins = Array.isArray(skins) ? skins : skins.catalog || [];
        } catch (error) {
            console.warn("Falha ao carregar catálogo da loja, usando skins locais.", error);
            this.availableSkins = StoreCatalog.getSkins();
        }

        this.selectedSkinId = this.selectedSkinId || this.availableSkins[0]?.id;
        this.player.setSkin(this.getSelectedSkin());
        this.renderSkinOptions();
        this.renderStoreItems();
        this.updateSelectedSkinPreview();
    }

    getSelectedSkin() {
        const skin = this.availableSkins.find((item) => item.id === this.selectedSkinId);
        return skin || this.availableSkins[0] || StoreCatalog.getSkins()[0];
    }

    renderSkinOptions() {
        if (!this.skinOptions) {
            return;
        }

        this.skinOptions.innerHTML = "";

        this.availableSkins.forEach((skin) => {
            const option = document.createElement("div");
            option.className = "skin-option";
            if (skin.id === this.selectedSkinId) {
                option.classList.add("selected");
            }

const previewImage = document.createElement("img");
        previewImage.src = skin.image || "src/assets/images/spaceship.png";
        previewImage.alt = `${skin.name} preview`;
        previewImage.className = "skin-preview-image";
        option.appendChild(previewImage);

        const title = document.createElement("strong");
            title.textContent = skin.name;
            option.appendChild(title);

            const descriptionText = document.createElement("span");
            descriptionText.textContent = skin.description;
            option.appendChild(descriptionText);

            const priceText = document.createElement("span");
            priceText.textContent = skin.price === 0 ? "Grátis" : `Preço: ${skin.price}`;
            option.appendChild(priceText);

            option.addEventListener("click", () => this.onSkinSelect(skin.id));
            this.skinOptions.append(option);
        });
    }

    renderStoreItems() {
        if (!this.storeItems) {
            return;
        }

        this.storeItems.innerHTML = "";

        this.availableSkins.forEach((skin) => {
            const owned = this.isSkinOwned(skin.id);
            const selected = skin.id === this.selectedSkinId;
            const item = document.createElement("div");
            item.className = "store-item";

            const preview = document.createElement("img");
            preview.src = skin.image || "src/assets/images/spaceship.png";
            preview.alt = `${skin.name} preview`;
            preview.className = "store-skin-preview";
            item.appendChild(preview);

            const title = document.createElement("h3");
            title.textContent = skin.name;
            item.appendChild(title);

            const description = document.createElement("p");
            description.textContent = skin.description;
            item.appendChild(description);

            const price = document.createElement("p");
            price.className = "item-price";
            price.textContent = skin.price === 0 ? "Grátis" : `Preço: ${skin.price}`;
            item.appendChild(price);

            const button = document.createElement("button");
            if (owned) {
                button.textContent = selected ? "Selecionado" : "Usar";
                button.addEventListener("click", () => this.onSkinSelect(skin.id));
            } else {
                button.textContent = `Comprar ${skin.price}`;
                button.addEventListener("click", () => this.purchaseSkin(skin.id));
            }

            item.appendChild(button);
            this.storeItems.appendChild(item);
        });
    }

    updateSelectedSkinPreview() {
        if (!this.selectedSkinName) {
            return;
        }

        const selectedSkin = this.getSelectedSkin();
        this.selectedSkinName.textContent = selectedSkin?.name || "Padrão";
    }

    openStore() {
        this.storeScreen.classList.remove("hidden");
    }

    closeStore() {
        this.storeScreen.classList.add("hidden");
    }

    isSkinOwned(skinId) {
        return this.ownedSkins.has(skinId);
    }

    onSkinSelect(skinId) {
        if (!this.isSkinOwned(skinId)) {
            alert("Você precisa comprar esta skin na loja antes de selecioná-la.");
            return;
        }

        this.selectedSkinId = skinId;
        this.player.setSkin(this.getSelectedSkin());
        this.updateSelectedSkinPreview();
        this.renderSkinOptions();
        this.renderStoreItems();
    }

    async purchaseSkin(skinId) {
        const skin = this.availableSkins.find((item) => item.id === skinId);
        if (!skin) {
            alert("Skin não encontrada.");
            return;
        }

        try {
            await ShopService.purchaseItem(skinId, "coins");
            this.ownedSkins.add(skinId);
            this.renderSkinOptions();
            this.renderStoreItems();
            alert(`Skin ${skin.name} comprada com sucesso!`);
        } catch (error) {
            alert(`Erro ao comprar skin: ${error.message}`);
            console.error(error);
        }
    }

    showGameData() {
        this.scoreElement.textContent = this.scoreManager.score;
        this.levelElement.textContent = this.scoreManager.level;
        this.highElement.textContent = this.scoreManager.high;
    }

    generateStars() {
        for (let i = 0; i < NUMBER_STARS; i += 1) {
            this.stars.push(new Star(this.canvas.width, this.canvas.height));
        }
    }

    drawStars() {
        this.stars.forEach((star) => {
            star.draw(this.ctx);
            star.update();
        });
    }

    drawProjectiles() {
        const projectiles = [
            ...this.playerProjectiles,
            ...this.invadersProjectiles,
        ];

        projectiles.forEach((projectile) => {
            projectile.draw(this.ctx);
            projectile.update();
        });
    }

    drawParticles() {
        this.particles.forEach((particle) => {
            particle.draw(this.ctx);
            particle.update();
        });
    }

    drawObstacles() {
        this.obstacles.forEach((obstacle) => obstacle.draw(this.ctx));
    }

    clearProjectiles() {
        this.playerProjectiles.forEach((projectile, index) => {
            if (projectile.position.y <= 0) {
                this.playerProjectiles.splice(index, 1);
            }
        });

        this.invadersProjectiles.forEach((projectile, index) => {
            if (projectile.position.y > this.canvas.height) {
                this.invadersProjectiles.splice(index, 1);
            }
        });
    }

    clearParticles() {
        this.particles.forEach((particle, index) => {
            if (particle.opacity <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }

    createExplosion(position, size, color) {
        for (let i = 0; i < size; i += 1) {
            const particle = new Particle(
                { x: position.x, y: position.y },
                {
                    x: (Math.random() - 0.5) * 1.5,
                    y: (Math.random() - 0.5) * 1.5,
                },
                2,
                color
            );

            this.particles.push(particle);
        }
    }

    onInvaderHit(invader, invaderIndex, projectileIndex) {
        this.soundEffects.playHitSound();

        this.createExplosion(
            {
                x: invader.position.x + invader.width / 2,
                y: invader.position.y + invader.height / 2,
            },
            10,
            "#941CFF"
        );

        this.scoreManager.incrementScore(10);
        this.grid.invaders.splice(invaderIndex, 1);
        this.playerProjectiles.splice(projectileIndex, 1);
    }

    showGameOverScreen() {
        document.body.append(this.gameOverScreen);
        this.gameOverScreen.classList.add("zoom-animation");
    }

    gameOver() {
        if (this.invaderShootInterval) {
            clearInterval(this.invaderShootInterval);
            this.invaderShootInterval = null;
        }

        this.createExplosion(
            {
                x: this.player.position.x + this.player.width / 2,
                y: this.player.position.y + this.player.height / 2,
            },
            10,
            "white"
        );

        this.createExplosion(
            {
                x: this.player.position.x + this.player.width / 2,
                y: this.player.position.y + this.player.height / 2,
            },
            5,
            "#4D9BE6"
        );

        this.createExplosion(
            {
                x: this.player.position.x + this.player.width / 2,
                y: this.player.position.y + this.player.height / 2,
            },
            5,
            "crimson"
        );

        this.player.alive = false;
        this.currentState = GameState.GAME_OVER;
        this.showGameOverScreen();
    }

    backToMenu() {
        if (this.invaderShootInterval) {
            clearInterval(this.invaderShootInterval);
            this.invaderShootInterval = null;
        }

        this.currentState = GameState.START;
        this.player.alive = false;
        this.gameOverScreen.remove();
        document.body.append(this.startScreen);
        this.scoreUi.style.display = "none";

        this.grid.invaders.length = 0;
        this.grid.invadersVelocity = 1;
        this.invadersProjectiles.length = 0;
        this.playerProjectiles.length = 0;
        this.particles.length = 0;
        this.scoreManager.reset();

        this.player = new Player(
            this.canvas.width,
            this.canvas.height,
            this.getSelectedSkin()
        );
    }

    spawnGrid() {
        if (this.grid.invaders.length === 0) {
            this.soundEffects.playNextLevelSound();

            this.grid.rows = Math.round(Math.random() * 9 + 1);
            this.grid.cols = Math.round(Math.random() * 9 + 1);
            this.grid.restart();

            this.scoreManager.incrementLevel();

            if (this.obstacles.length === 0) {
                this.initObstacles();
            }
        }
    }

    updateCollisions() {
        this.collisionSystem.checkShootInvaders(
            this.grid,
            this.playerProjectiles,
            (invader, invaderIndex, projectileIndex) =>
                this.onInvaderHit(invader, invaderIndex, projectileIndex)
        );

        this.collisionSystem.checkShootPlayer(
            this.player,
            this.invadersProjectiles,
            (index) => {
                this.soundEffects.playExplosionSound();
                this.invadersProjectiles.splice(index, 1);
                this.gameOver();
            }
        );

        this.collisionSystem.checkShootObstacles(
            this.obstacles,
            this.playerProjectiles,
            this.invadersProjectiles
        );

        this.collisionSystem.checkInvadersCollidedObstacles(
            this.grid,
            this.obstacles
        );

        this.collisionSystem.checkPlayerCollidedInvaders(
            this.player,
            this.grid,
            () => this.gameOver()
        );
    }

    updatePlayer() {
        const { keys } = this.inputHandler;

        this.ctx.save();

        this.ctx.translate(
            this.player.position.x + this.player.width / 2,
            this.player.position.y + this.player.height / 2
        );

        if (keys.shoot.pressed && keys.shoot.released) {
            this.soundEffects.playShootSound();
            this.player.shoot(this.playerProjectiles);
            keys.shoot.released = false;
        }

        if (keys.left && this.player.position.x >= 0) {
            this.player.moveLeft();
            this.ctx.rotate(-0.15);
        }

        if (
            keys.right &&
            this.player.position.x <= this.canvas.width - this.player.width
        ) {
            this.player.moveRight();
            this.ctx.rotate(0.15);
        }

        this.ctx.translate(
            -this.player.position.x - this.player.width / 2,
            -this.player.position.y - this.player.height / 2
        );

        this.player.draw(this.ctx);
        this.ctx.restore();
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawStars();

        if (this.currentState === GameState.PLAYING) {
            this.showGameData();
            this.spawnGrid();

            this.drawProjectiles();
            this.drawParticles();
            this.drawObstacles();

            this.clearProjectiles();
            this.clearParticles();

            this.updateCollisions();

            this.grid.draw(this.ctx);
            this.grid.update(this.player.alive);

            this.updatePlayer();
        }

        if (this.currentState === GameState.GAME_OVER) {
            this.collisionSystem.checkShootObstacles(
                this.obstacles,
                this.playerProjectiles,
                this.invadersProjectiles
            );

            this.drawProjectiles();
            this.drawParticles();
            this.drawObstacles();

            this.clearProjectiles();
            this.clearParticles();

            this.grid.draw(this.ctx);
            this.grid.update(this.player.alive);
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        this.startScreen.remove();
        this.scoreUi.style.display = "block";
        this.currentState = GameState.PLAYING;

        this.invaderShootInterval = setInterval(() => {
            const invader = this.grid.getRandomInvader();

            if (invader) {
                invader.shoot(this.invadersProjectiles);
            }
        }, 1000);
    }

    restart() {
        this.currentState = GameState.PLAYING;
        this.player.alive = true;

        this.grid.invaders.length = 0;
        this.grid.invadersVelocity = 1;

        this.invadersProjectiles.length = 0;
        this.scoreManager.reset();

        this.gameOverScreen.remove();
    }
}

export default Game;
