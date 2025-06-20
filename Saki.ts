/// <reference path="./.config/vc.d.ts" />
import { KeyCode } from './.config/enums';

class Saki {
    private static readonly VEHICLES = {
        INFERNUS: { modelId: 141, message: "Saki酱: 刷出了一辆跑车!", key: KeyCode.F5 },
        RHINO: { modelId: 162, message: "Saki酱: 刷出了一辆坦克!", key: KeyCode.F6 }
    };

    private player: Player;
    private isRunning: boolean;

    constructor() {
        log("===== Saki酱●█▀█▄Saki酱●█▀█▄Saki酱●█▀█▄ =====");
        this.player = new Player(0);
        this.isRunning = true;
        this.init();
    }

    private init(): void {
        try {
            log("开始主循环监听");
            while (this.isRunning) {
                wait(250);
                
                this.checkSaveKey();
                this.checkVehicleSpawn();
            }
        } catch (e) {
            log("Saki酱严重错误: ", e);
            exit("Saki酱异常终止");
        } finally {
            log("Saki酱已停止运行");
        }
    }

    private exitScript(): void {
        log("正在退出Saki酱...");
        this.isRunning = false;
        exit("Saki酱已正常退出");
    }

    // Save 功能相关方法
    private checkSaveKey(): void {
        if (Pad.IsKeyPressed(KeyCode.F4)) {
            log("检测到F4按键，激活保存菜单");
            Game.ActivateSaveMenu();
            log("保存菜单已激活");
            wait(1000);
        }
    }

    // VehicleSpawner 功能相关方法
    private checkVehicleSpawn(): void {
        if (!this.player.isPlaying()) {
            return;
        }

        if (Pad.IsKeyPressed(KeyCode.F4)) {
            log("检测到F4按键，准备退出脚本");
            this.exitScript();
            return;
        }

        if (Pad.IsKeyPressed(Saki.VEHICLES.INFERNUS.key)) {
            log("检测到F5按键，准备生成跑车");
            this.spawnVehicle(
                Saki.VEHICLES.INFERNUS.modelId,
                Saki.VEHICLES.INFERNUS.message
            );
        }

        if (Pad.IsKeyPressed(Saki.VEHICLES.RHINO.key)) {
            log("检测到F6按键，准备生成坦克");
            this.spawnVehicle(
                Saki.VEHICLES.RHINO.modelId,
                Saki.VEHICLES.RHINO.message
            );
        }
    }

    private spawnVehicle(modelId: number, message: string): void {
        log(`开始加载车辆模型: ${modelId}`);
        this.loadModel(modelId);

        const pos = this.getSpawnPosition();
        log(`车辆将在位置 x:${pos.x.toFixed(2)}, y:${pos.y.toFixed(2)}, z:${pos.z.toFixed(2)} 生成`);

        const vehicle = Car.Create(modelId, pos.x, pos.y, pos.z);
        const blip = Blip.AddForCar(vehicle);
        log(`车辆已生成，ID: ${vehicle}`);

        this.setupVehicle(vehicle);
        this.showNotification(message);
        this.cleanup(vehicle, modelId, blip);
    }

    private getSpawnPosition(): { x: number; y: number; z: number } {
        const playerPos = this.player.getChar().getCoordinates();
        log(`玩家当前位置: x:${playerPos.x.toFixed(2)}, y:${playerPos.y.toFixed(2)}, z:${playerPos.z.toFixed(2)}`);
        return this.addVec(playerPos, { x: 2.0, y: -2.0, z: 0 });
    }

    private setupVehicle(vehicle: Car): void {
        vehicle.lockDoors(0);
        vehicle.closeAllDoors();
        log("车辆门锁已设置");
    }

    private showNotification(message: string): void {
        showTextBox(message);
        log(`显示通知: ${message}`);
    }

    private cleanup(vehicle: Car, modelId: number, blip: Blip): void {
        vehicle.markAsNoLongerNeeded();
        Streaming.MarkModelAsNoLongerNeeded(modelId);
        log(`车辆 ${modelId} 标记为不再需要`);

        wait(2000);
        blip.remove();
        log("车辆雷达标记已移除");
    }

    private loadModel(modelId: number): void {
        log(`请求加载模型: ${modelId}`);
        Streaming.RequestModel(modelId);

        let attempts = 0;
        while (!Streaming.HasModelLoaded(modelId)) {
            attempts++;
            log(`等待模型加载: ${modelId}... (尝试 ${attempts})`);
            if (attempts > 20) {
                log(`模型加载超时: ${modelId}`);
                throw new Error(`无法加载模型: ${modelId}`);
            }
            wait(250);
        }
        log(`模型加载完成: ${modelId}`);
    }

    private addVec(v1: { x: number; y: number; z: number }, v2: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
        const result = { 
            x: v1.x + v2.x, 
            y: v1.y + v2.y, 
            z: v1.z + v2.z 
        };
        log(`向量相加结果: x:${result.x.toFixed(2)}, y:${result.y.toFixed(2)}, z:${result.z.toFixed(2)}`);
        return result;
    }
}

log("===== Saki酱初始化 =====");
try {
    new Saki();
    log("Saki酱已成功启动");
} catch (e) {
    log("Saki酱初始化失败: ", e);
    exit("Saki酱初始化异常");
}
