---
title: Godot 4 on Raspberry Pi - Easy Steps to Play Your Games on a Tiny Computer
description: A detailed guide on how to build and deploy Godot 4 games to the Raspberry Pi. Perfect for developers with little to moderate experience.
date: 2024-04-08
banner: /images/posts/godot-on-pi/raspberry-pi-export-header.png
bannerAlt: Preview of Candy Wrapper playing on a Raspberry Pi with a raspberry frame.
tags:
  - software
  - game-dev
  - godot
---

Turn your Raspberry Pi into a tiny arcade machine to show off your 2D game creations! This guide will walk you through exporting your Godot 4 projects to the Raspberry Pi, a small and affordable computer perfect for game development and play. We'll focus on exporting a simple 2D game,

## What are Godot and Raspberry Pi?

- **Godot 4**: A free and open-source game engine known for its user-friendly interface and cross-platform capabilities. It's a great choice for both beginners and experienced developers.
- **Raspberry Pi**: A series of credit card-sized computers that are surprisingly powerful and versatile. They're often used for DIY projects, learning to code, and even building retro gaming consoles.

## Why Raspberry Pi for Game Development?

The Raspberry Pi is a fantastic platform for game development due to its affordability, portability, and the large community of developers who create tutorials and resources. It's a fun way to learn about game development and see your creations come to life on a dedicated device.

## Prerequisites

- Raspberry Pi 4B. I tested on the Raspberry Pi 4B with 4GB, which was more than enough to run a small, 2D game.
- MicroSD Card
- Godot 4
- [Recommended] Separate development machine: While not strictly necessary, having a separate computer for development can make the process easier.

## Setting up your Raspberry Pi

I use Raspberry OS due to its ease of use and support on the Raspberry Pi. If you prefer a different Linux flavor, then go ahead and use that.

Start by installing the [Official Raspberry Pi Imager](https://www.raspberrypi.com/software/) to easily install Raspberry OS. I recommend using the 32 bit version as it's what I used in my testing.

Once it's finished, plug your MicroSD card into the Raspberry Pi. You'll want to plug your Raspberry Pi into a monitor with a mouse and keyboard, so you can set up your Pi and later play your game. Once you get everything plugged in, power up your Pi by plugging it in. After you boot up the Pi, go through the initial configuration until you make it to your desktop.

Once you're logged in, connect to the internet and update your Raspberry Pi by running the following command:

```zsh
sudo apt update -y && sudo apt upgrade -y
```

Enable SSH by opening the menu at the top left and go to _Preferences -> Raspberry Pi Configuration_ then go to the Interfaces tab, enable SSH, and hit **OK**. Now you can access your Pi over your network!

## Installing Godot 4

Get the latest Godot 4 release from the official site from their [Official Download Site](https://godotengine.org/download). Download the .NET version if you plan on writing C# code. If you want to use the .NET version, ensure to install the .NET SDK [from Microsoft](https://dotnet.microsoft.com/en-us/download).

Godot doesn't use an installer to get the engine running on your device. Just unzip the folder and run the executable.

## Project Setup

For this example, I am using the sample project [Candy Wrapper - Looping Arcade Platformer Game](https://godotengine.org/asset-library/asset/1939) to export to our Raspberry Pi. Candy Wrapper is a Arcade game that's a perfect starting point to your own project.

Grab this template by going to the "Asset Library Project" tab and search for `Candy Wrapper`, tap on the asset, and hit download.

![Candy Wrapper Project Screenshot](/images/posts/godot-on-pi/asset-library-candy-wrapper.png "Candy Wrapper Project Screenshot")

Once the asset has downloaded, you'll be prompted to install the template. Pick a folder to place the project and hit `Install & Edit`. Godot should open the project once it's installed.

![Screenshot of Godot 4's Project Manager Window on Linux](/images/posts/godot-on-pi/godot-pm-screenshot.png "Godot 4's Project Manager")

![Candy Wrapper in Godot](/images/posts/godot-on-pi/candy-wrapper-project.png "Candy Wrapper in Godot")

Try playing the game to test out that everything works. Hit the play button in the top-right corner to start it.

## Configuring the Project

Given that the Raspberry Pi does not have on onboard GPU, all the rendering is done on the CPU. This will restrict the kinds of effects you can use in your game. The intricacies of Raspberry Pi's capabilities are beyond the scope of this blog post. Thankfully, Candy Wrapper is a simple game that the Pi has no troubles running.

One setting we will be changing is the renderer for our project. By default, your project should be set to `Forward+`. Tap on `Forward+` and set it to `Mobile`. The Mobile renderer uses Vulkan, which the Raspberry Pi supports out-of-the-box.

![Godot render settings](/images/posts/godot-on-pi/godot-render-settings.png "Godot render settings")

## Exporting for the Raspberry Pi

Now our project is almost ready to ship and test on our Pi. Now is a good time to play the game in the editor to double-check everything is working.

![Candy Wrapper In Action](/images/posts/godot-on-pi/candy-wrapper-in-action.png "Candy Wrapper In Action")

If everything is looking right, let's export it for the Raspberry Pi!

Open the export settings from the menu bar by going to `Project -> Export`, where you should see the export configurations inherited from the project.

We're going to adding a new export config by tapping on `Add` and selected `Linux/X11`. We're going to keep the config simple and change the following settings:

- Name: Raspberry Pi
- Export Path: /your/dir/candy-wrapper.arm32
- Debug -> Debug Export Wrapper: No
- Binary Format -> Architecture: arm32
- [If you're using the .NET version] Dotnet -> Include Debug Symbols: Off

No other settings need to be changed for this tutorial.

With these settings, you can run the executable on the Raspberry Pi. These settings also disable any debug symbols and code from the build, which will help with performance on the Pi.

![Export Settings](/images/posts/godot-on-pi/export-settings.png "Export Settings")

## Let's Get Exported

From the export window with the "Raspberry Pi" config we just created selected, click on the "Export" button. The dialog will bring up a file explorer pointed at the "Export Path" you set in the last step. Hit save, and wait for your project to build. After the process finished, we are ready to deploy and play our game on the Raspberry Pi.

Now, let's get that game transferred to your Raspberry Pi. There are many ways to transfer files between your computer and the Raspberry Pi, and the method you choose is up to you. My preference is to transfer the files over the network using SSH, as it's quick and easy to do. Nothing is stopping you from plugging a USB drive into your Raspberry Pi and transferring the files that way. But for this tutorial, we'll use SSH.

First, you'll want to get the IP address of your Raspberry Pi in order to connect with it. You'll need to physically access your Pi, login, and run the following command:

```zsh
hostname -I
```

You should see output like `192.168.50.74 2601:283:5081:4b9d:aaab:b120:501a:6b68`.

The IP address is the value like `192.168.50.74`. Your's will most likely be different from mine.

### Transferring Files via SSH on Ubuntu 22.04

I am developing on Ubuntu, which makes it easy for me to mount my Raspberry Pi as a network drive from the file explorer, so files can be transferred as though you were copy and pasting between folders on your computer.

Open up the Files app and go to the "Other Locations" in the sidebar to open the screen below.

![File Explorer with SSH config](/images/posts/godot-on-pi/ssh-file-explorer.png "File Explorer with SSH config")

Inside the input for `Connect to Server`, enter your Raspberry Pi's IP address formatted like `ssh://192.168.50.75`. Remember to enter the IP address your recorded earlier. Then hit `Connect` and enter your credentials.

Copy the folder containing your game files (candy-wrapper.arm32 and candy-wrapper.pck) and copy them to a new folder in your home directory, `~/CandyWrapper`.

### Transferring Files via SSH on Windows

If you're on Windows, you will need to use an external tool to transfer files via SSH. I recommend the popular tool [WinSCP](https://winscp.net/).

## Testing Your Game

We're in the final stretch now! All that's left is running our game on the Raspberry Pi and testing it out. This step is by far the easiest and most fun.

To run the game, open a terminal and run the following commands:

```zsh
cd ~/CandyWrapper
./candy-wrapper.arm32
```

Wait a few seconds ands your game should launch!

![Candy Wrapper running on the Pi](/images/posts/godot-on-pi/raspberry-pi-game-screenshot.png)

Hopefully, this will help get you started on your next project. Build on this and see what you can create!
