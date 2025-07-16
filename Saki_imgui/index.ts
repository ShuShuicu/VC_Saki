/**
 * Saki GUI菜单
 * @link https://github.com/YuiNijika
 * 
 * 致敬传奇跑路王XMDS(github.com/XMDS)
 * 等他什么时候不装死了还钱后就删掉
 */

/// <reference path="../.config/vc.d.ts" />
import { KeyCode } from '../.config/enums';
import { FPSOverlay } from './src/Saki_FPSOverlay';
import { VehiclesTab } from './src/Saki_Vehicles';

const baseDri = 'CLEO/Saki_imgui/';

class Saki_ImGui {
    private showWindow = false;
    private vehiclesTab = new VehiclesTab(); // 车辆Tab实例

    constructor() {
        log("===== Saki酱●█▀█▄Saki酱●█▀█▄Saki酱●█▀█▄ =====");
    }

    private renderAnonTab() {
        ImGui.Spacing();
        ImGui.Text(`FPS: ${Game.GetFramerate()}`);
    }

    private renderAboutTab() {
        // 这猪鼻LoadImage会导致崩溃, 阿米诺斯
        // ImGui.ButtonImage(
        //     "Tommy",
        //     ImGui.LoadImage(`${baseDri}assets/Tommy.jpg`),
        //     480,
        //     270
        // );
        ImGui.Spacing();
        ImGui.Text("Saki Script by Tomori");
        ImGui.Text("GTAMOD: www.gtamodx.com");
    }


    public main() {
        wait(0);
        ImGui.BeginFrame("Saki ImGui");

        FPSOverlay.render();

        ImGui.SetCursorVisible(this.showWindow);
        if (this.showWindow) {
            ImGui.SetNextWindowSize(460.0, 600.0, 2);
            this.showWindow = ImGui.Begin("Saki Script", this.showWindow, false, false, false, false);

            ImGui.BeginChild("WindowChild");
            let tab = ImGui.Tabs("TabBar", "Anon,Vehicles,About");
            switch (tab) {
                case 0:
                    this.renderAnonTab();
                    break;
                case 1:
                    this.vehiclesTab.render();
                    break;
                case 2:
                    this.renderAboutTab();
                    break;
            }
            ImGui.EndChild();
            ImGui.End();
        }
        ImGui.EndFrame();

        // 触发Gui
        if (Pad.IsKeyDown(KeyCode.F5)) {
            log(`窗口显示状态切换为: ${!this.showWindow}`);
            this.showWindow = !this.showWindow;
        }

        // 保存菜单
        if (Pad.IsKeyPressed(KeyCode.F6)) {
            Game.ActivateSaveMenu();
            log("保存菜单已激活");
            wait(0);
        }
    }
}

log("===== 启动 Saki GUI =====");
const Saki = new Saki_ImGui();
while (true) {
    Saki.main();
}