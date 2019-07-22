/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import * as path from "path";
import { RpcInterfaceDefinition, ElectronRpcManager } from "@bentley/imodeljs-common";
import { IModelJsElectronManager } from "@bentley/electron-manager";
import * as electron from "electron";
import * as configurationData from "../../common/settings.json";
import * as electronFs from "fs";

/** Method to change the iModelName stored in the config.json
 * @param iModelName string wsgId of the new iModel
 */
export const changeiModel = (iModelName: string) => {
  const newConfig = {
    imodel_name: iModelName,
    project_name: configurationData.project_name,
    drawing_name: configurationData.drawing_name,
  };
  const stringifiedConfig = JSON.stringify(newConfig);
  electronFs.writeFileSync(path.join(__dirname, "../../common/settings.json"), stringifiedConfig);
};

/**
 *  This method reads the config, parses it into a JSON object, and returns it back to the renderer
 * @param event The event sent by the renderer processes back to the main
 */
export const readData = (event?: electron.Event, arg?: string) => {
  const configObject: any = "";
  electronFs.readFile(path.join(__dirname, "../../common/settings.json"), (error: Error | null, data: any) => {
    if (error) {
      // tslint:disable-next-line:no-console
      console.log("error " + error);
    }
    const jsonObject = JSON.parse(data);
    if (event) {
      if (arg === "imodel") {
        event.sender.send("readConfigResultsIModel", jsonObject);
      } else {
        event.sender.send("readConfigResults", jsonObject);
      }
    }
  });
  return configObject;
};

/**
 * This method sets the project name in the settings.json
 * @param projectName The name of the desired project
 */
export const changeProject = (projectName: string) => {
  const newConfig = {
    imodel_name: configurationData.imodel_name,
    project_name: projectName,
    drawing_name: configurationData.drawing_name,
  };
  const stringifiedConfig = JSON.stringify(newConfig);
  electronFs.writeFileSync(path.join(__dirname, "../../common/settings.json"), stringifiedConfig);
};

/** Method to change the iModelName stored in the config.json
 * @param drawingName string wsgId of the new drawing
 */
export const changeDrawingName = (drawingName: string) => {
  const newConfig = {
    imodel_name: configurationData.imodel_name,
    project_name: configurationData.project_name,
    drawing_name: drawingName,
  };
  const stringifiedConfig = JSON.stringify(newConfig);
  electronFs.writeFileSync(path.join(__dirname, "../../common/config.json"), stringifiedConfig);
};

// The following four variables are bound to functions, and serve as getters and settings for backend-frontend communication
// This is because external components that require data gathered in App.tsx, are unable to import that file, due to security reasons.
// Thus the data must travel App.tsx -> main.ts (backend) -> component that needs the data

/**
 * Initializes Electron backend
 */
const manager = new IModelJsElectronManager(path.join(__dirname, "..", "..", "webresources"));
export default function initialize(rpcs: RpcInterfaceDefinition[]) {

  // Much of electron and iModelJS's functionality is wrapped in promises, so this nested async function is needed to avoid unhandled promise exceptions
  (async () => { // tslint:disable-line:no-floating-promises
    await manager.initialize({
      width: 1280,
      height: 800,
      title: "Plant Viewer",

      // Web preferences deal with the paths the main electron window will use
      webPreferences: {
        preload: path.resolve("preload.js"),
        experimentalFeatures: true, // Needed for CSS Grid support
      },
      autoHideMenuBar: false,
      show: false,
    });
    // tell ElectronRpcManager which RPC interfaces to handle
    ElectronRpcManager.initializeImpl({}, rpcs);
    if (manager.mainWindow) {
      manager.mainWindow.show();
      const menuBar: electron.Menu = electron.Menu.getApplicationMenu() as electron.Menu;
      function refreshButtonClick(menuItem: electron.MenuItem, browserWindow: electron.BrowserWindow, event: Event): void {
        menuItem;
        browserWindow;
        event;
        return;
      }
      const refreshButtonOptions: MenuBarOptions = new MenuBarOptions("Refresh", undefined, refreshButtonClick);
      const refreshButton: electron.MenuItem = new electron.MenuItem(refreshButtonOptions);
      menuBar.append(refreshButton);
      const drawingsButtonOptionsSubmenu0: MenuBarOptions = new MenuBarOptions("drawing0", undefined);
      const drawingsButtonOptionsSubmenu1: MenuBarOptions = new MenuBarOptions("drawing1", undefined);
      const drawingsButtonOptionsSubmenu2: MenuBarOptions = new MenuBarOptions("drawing2", undefined);
      const drawingsButtonOptionsSubmenu: MenuBarOptions[] = [drawingsButtonOptionsSubmenu0, drawingsButtonOptionsSubmenu1, drawingsButtonOptionsSubmenu2];
      const drawingsButtonOptions: MenuBarOptions = new MenuBarOptions("Drawings", drawingsButtonOptionsSubmenu);
      const drawingsMenu: electron.MenuItem = new electron.MenuItem(drawingsButtonOptions);
      menuBar.append(drawingsMenu);
      manager.mainWindow.setMenu(menuBar);
    }
  })();
}

class MenuBarOptions implements electron.MenuItemConstructorOptions {
  public label: string;
  public submenu?: MenuBarOptions[];
  public click?: (menuItem: electron.MenuItem, browserWindow: electron.BrowserWindow, event: Event) => void;
  constructor(label: string, submenu?: MenuBarOptions[], click?: (menuItem: electron.MenuItem, browserWindow: electron.BrowserWindow, event: Event) => void) {
    this.label = label;
    this.submenu = submenu;
    this.click = click;
  }
}

export function newWindow() {
  if (manager.mainWindow) {
  electron.dialog.showOpenDialog(manager.mainWindow, {
    title: "Select configuration File",
    properties: ["openFile", "multiSelections"],

  }, (filePaths) => {
    if (!filePaths) {
      electron.app.quit();
    }
  });
  }
}

export function popupWarning(typeOfError?: string) {
  const errorMessage = "Warning! The " + typeOfError + " is missing from the settings file!";
  if (manager.mainWindow) {
    electron.dialog.showMessageBox(manager.mainWindow, {type: "error", message: errorMessage, title: "Error"});
  }
}
