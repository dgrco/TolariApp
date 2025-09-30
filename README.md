# Tolari
Tolari is a new app for studying and productivity. It blends three useful study/productivity techniques to maximize study efficiency, leading to better results with less time studied.

The three techniques are: **Spaced-Repetition**, a **Kanban Planning Board**, and a **Pomodoro Timer**. 

# Installation Guide ⚙️

First, find the correct file to download from "Releases".

## Windows

Tolari can be installed on Windows by simply running the `-installer.exe` file.

### Important Information For Windows Users

When installing on Windows, it will show a warning that "Windows Protected Your PC" or "Unknown Publisher" (or some other variant). This is because code signing certificates are prohibitively expensive and I am currently independently developing this app without funding. This does not mean the file is malicious (the code is open source for inspection!). I encourage everyone to run the installer through services like VirusTotal as an additional safety check.

## Linux

This guide will walk you through the necessary steps to install and run the application on your Linux system. You can run the application directly as an **AppImage** or install it using the provided script.

---

## 1. Prerequisites 🧱

Before you begin, you need to ensure that your system has the required libraries installed. These are essential for the application to function correctly.

Please install **FUSE 2**, **GTK3**, and **WebKit2GTK** using the appropriate command for your Linux distribution below:

| Distribution | Command |
| :--- | :--- |
| **Debian / Ubuntu / Linux Mint** | `sudo apt-get update` <br> `sudo apt-get install libfuse2 libgtk-3-0 libwebkit2gtk-4.0-37 -y` |
| **Fedora / CentOS / RHEL** | `sudo dnf install fuse-libs gtk3 webkit2gtk3 -y` |
| **Arch Linux / Manjaro** | `sudo pacman -Syu --noconfirm` <br> `sudo pacman -S fuse2 gtk3 webkit2gtk --noconfirm` |
| **openSUSE** | `sudo zypper refresh` <br> `sudo zypper install libfuse2 libgtk-3-0 libwebkit2gtk-4_0-37 -y` |

---

## 2. Installation and Execution 🚀

You have two options for running the application. Choose the one that best suits your needs.

### Option A: Run the AppImage (Recommended for Portability) 💾

This is the simplest way to get started. The **AppImage** is a single file that contains the application and all its dependencies, which can be run without installation.


1.  **Make the AppImage executable:**
    * **GUI Method:** Right-click the AppImage file, go to "Properties," then the "Permissions" tab, and check the box that says **"Allow executing file as program."**
    * **Terminal Method:**
        ```bash
        chmod +x Tolari-x86_64.AppImage
        ```
2.  **Run the application:**
    * **GUI Method:** Double-click the AppImage file.
    * **Terminal Method:**
        ```bash
        ./Tolari-x86_64.AppImage
        ```

---

### Option B: Use the Installation Script (For System Integration) 🖥️

If you prefer to install the application so it appears in your system's application menu, use the `install.sh` script.

1.  **Extract the Archive:**
    Open your terminal, navigate to the directory where you downloaded the file, and extract the `.tar.gz` archive:
    ```bash
    tar -xvzf Tolari.tar.gz
    ```
2.  **Navigate into the Directory:**
    ```bash
    cd Tolari/
    ```
3.  **Run the Installer:**
    Execute the installation script. You may be prompted for your password as it will install files to system directories.
    ```bash
    chmod +x install.sh
    ./install.sh
    ```
The script will copy the necessary files and create a `.desktop` entry, so you can find it in your application launcher.

---

# How to Uninstall 🗑️

## Windows

1. Select **Start** > **Settings** > **Apps** > **Installed apps**.
2. Search for "Tolari" and select "**More** (...)" > **Uninstall**

## Linux

### For Script Installation (Option B)

If you used the `install.sh` script and wish to remove the application, you can run the `uninstall.sh` script which is located in the extracted folder.

1.  **Navigate into the Directory:**
    ```bash
    cd Tolari/
    ```
2.  **Run the Uninstaller:**
    ```bash
    chmod +x uninstall.sh
    ./uninstall.sh
    ```
This will remove the application files and the `.desktop` entry from your system.

### For AppImage (Option A)

If you only used the AppImage, simply **delete the `Tolari-x86_64.AppImage` file**.

---

## Troubleshooting 🩹

* **"App does not start"**: Ensure all **prerequisites** listed in section 1 are installed correctly for your specific distribution.
* **Permission Denied (AppImage)**: Make sure you have made the AppImage **executable** by following step 1 of Option A.
* **Installation script fails**: Try running the script with `sudo` as it may require **root permissions** to create system files.

If you encounter any other issues, please feel free to open an issue on our GitHub page (if applicable).

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

## Building

To build a redistributable, production mode package, use `wails build`.
