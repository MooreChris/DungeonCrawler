import Player from "CrimsonDungeon/img/Player_01.png";

type AnimConfig = {
    key: string;
    frames: Phaser.Types.Animations.GenerateFrameNumbers;
    defaultTextureKey?: string;
    frameRate?: integer;
    duration?: integer;
    skipMissedFrames?: boolean;
    delay?: integer;
    repeat?: integer;
    repeatDelay?: integer;
    yoyo?: boolean;
    showOnStart?: boolean;
    hideOnComplete?: boolean;
};

type GraphicSet = {
    name: string;
    width: number;
    height: number;
    file: string;
    margin?: number;
    spacing?: number;
};

type AnimSet = GraphicSet & {
    animations: { [k: string]: AnimConfig };
};

const player: AnimSet = {
    name: "player",
    width: 64,
    height: 64,
    file: Player,
    animations: {
        idle: {
            key: "playerIdle",
            frames: { start: 0x01, end: 0x07 },
            frameRate: 6,
            repeat: -1
        },
        idleBack: {
            key: "playerIdleBack",
            frames: { start: 0x0a, end: 0x11 },
            frameRate: 6,
            repeat: -1
        },
        walk: {
            key: "playerWalk",
            frames: { start: 0x14, end: 0x19 },
            frameRate: 10,
            repeat: -1
        },
        walkBack: {
            key: "playerWalkBack",
            frames: { start: 0x1e, end: 0x23 },
            frameRate: 10,
            repeat: -1
        },
        // Ideally attacks should be five frames at 30fps to
        // align with the attack duration of 165ms
        slash: {
            key: "playerSlash",
            frames: { frames: [0x1a, 0x1a, 0x1a, 0x1b, 0x1c] },
            frameRate: 30
        },
        slashUp: {
            key: "playerSlashUp",
            frames: { frames: [0x2e, 0x2e, 0x2e, 0x2f, 0x30] },
            frameRate: 30
        },
        slashDown: {
            key: "playerSlashDown",
            frames: { frames: [0x24, 0x24, 0x24, 0x25, 0x26] },
            frameRate: 30
        },
        stagger: {
            key: "playerStagger",
            frames: { frames: [0x38, 0x38, 0x39, 0x3a] },
            frameRate: 30
        }
    }
};