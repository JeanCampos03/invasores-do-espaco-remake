class CollisionSystem {
    checkShootInvaders(grid, playerProjectiles, onHit) {
        grid.invaders.forEach((invader, invaderIndex) => {
            playerProjectiles.some((projectile, projectileIndex) => {
                if (invader.hit(projectile)) {
                    onHit(invader, invaderIndex, projectileIndex);
                    return true;
                }

                return false;
            });
        });
    }

    checkShootPlayer(player, invadersProjectiles, onHit) {
        invadersProjectiles.some((projectile, index) => {
            if (player.hit(projectile)) {
                onHit(index);
                return true;
            }

            return false;
        });
    }

    checkShootObstacles(obstacles, playerProjectiles, invadersProjectiles) {
        obstacles.forEach((obstacle) => {
            playerProjectiles.some((projectile, index) => {
                if (obstacle.hit(projectile)) {
                    playerProjectiles.splice(index, 1);
                    return true;
                }

                return false;
            });

            invadersProjectiles.some((projectile, index) => {
                if (obstacle.hit(projectile)) {
                    invadersProjectiles.splice(index, 1);
                    return true;
                }

                return false;
            });
        });
    }

    checkInvadersCollidedObstacles(grid, obstacles) {
        obstacles.forEach((obstacle, index) => {
            grid.invaders.some((invader) => {
                if (invader.collided(obstacle)) {
                    obstacles.splice(index, 1);
                    return true;
                }

                return false;
            });
        });
    }

    checkPlayerCollidedInvaders(player, grid, onCollision) {
        grid.invaders.some((invader) => {
            if (
                invader.position.x >= player.position.x &&
                invader.position.x <= player.position.x + player.width &&
                invader.position.y >= player.position.y
            ) {
                onCollision();
                return true;
            }

            return false;
        });
    }
}

export default CollisionSystem;
