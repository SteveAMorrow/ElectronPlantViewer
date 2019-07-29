# **OpenPlant iModel Viewer**

## **User Guide**

### **About**

- This is an electron application to view P&ID drawings of iModels.
- Provide the credentials of the iModel to view.
- An electron application opens up and presents the iModel.

### **Install**

1. Use the git commands to clone (See github.com)
2. Use your favorite editor, such as Visual Studio Code.

### **Build**

1. Open src/common/configuration.json, scroll down to the very bottom, and comment/uncomment the lines for your client (Production or QA).
2. Open the src/common/settings.json, and put the names of the project, iModel, and drawing (optional).
3. Save your changes.
4. Type **[CTRL+`]** to open the terminal in Visual Studio Code.
5. Type the following command in the terminal to install the dependencies (may take a few minutes).
   - **`npm install`**
   - **_This only has to be done once even if you make changes and build again!_**
6. Type the following command in the terminal to build the applicaiton (should only take a few seconds).
   - **`npm run build`**

### **Run**

1. Type the following command in the terminal to run the application. An electron window will open within seconds.
   - **`npm run electron`**
2. View the **Help** section below to see how to use the application.
3. Close the electron window to stop running the application.
4. If you want to re-run the application without any changes to the program files, go back to step 1.
5. If you want to re-run the application and make changes to the program files, go back to the **Build** section above to re-build the application.

### **Help**

1. When prompted, **log-in** with your credentials. This grants access to the backend servers that contain the iModel information.
2. When a blue button that reads "**Open iModel**" comes up, click on it. This will pull the iModel information from the web and display it.
3. Click on "**Expand Menu**" (top-right of screen) to see options and properties, as well as the Tree. This can be collapsed by clicking on the same button.
4. Click on "**Reload iModel**" (top-right of screen) to refresh the iModel you are viewing if it was updated on the cloud after you opened it in the viewer.
5. To switch drawings, click on a **drawing** under the **Tree** (top-right of screen). This will update the viewer.
6. To select a **graphic** in a drawing, either click on it in the viewer, or expand the drawing under **Tree** and select one under **PID Drawing Categories**. When a graphic is selected, it will be highlighted in the viewer and will have its information displayed in **Properties** (bottom of screen).
