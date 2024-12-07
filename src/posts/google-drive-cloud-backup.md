---
title: Godot 4 on Raspberry Pi - Easy Steps to Play Your Games on a Tiny Computer
description: A detailed guide on how to build and deploy Godot 4 games to the Raspberry Pi. Perfect for developers with little to moderate experience.
date: 2024-04-08
banner: /images/posts/godot-on-pi/raspberry-pi-export-header.png
bannerAlt: Preview of Candy Wrapper playing on a Raspberry Pi with a raspberry frame.
tags:
  - software
  - google-cloud
---

For the past few years I've been keeping track of my life with markdown notebooks to record my daily tasks, journals, and note-taking for furthering my education. This journey initially started with Joplin (insert link) using WebDAV to sync between devices, till I eventually jumped to Obsidian (insert link) with Syncthing to sync between devices, until I simplified my life by using Google Drive to back up. One downside of moving to Google Drive was it became difficult to create versioned archives of my notebook with many previous days of backups stored for each day. I grew scared of the possibility that I do something dumb to my notebook and lose the ability to recover my notes, so I decided to automate the process of archiving my notebook every day. To keep things simple, I decided to do everything in the cloud, so I could set and forget this process. This post goes into how I set up the backup process, so you too can generate archives on a regular basis to avoid catastrophic data loss.

The reason I chose Google Cloud Run to manage this backup process was due to a couple of factors:

1. I am familiar with Google Cloud, so it was easy to start.
2. Google Cloud has Drive APIs on the platform, making it easy to handle communication and security with Drive.
3. Low cost to run Cloud Run Jobs. All Google Cloud accounts come with 240,000 free Cloud Run vCPU-seconds per month, which is ~66.66 hours. More than enough for my purposes.

## Requirements

For this archiving service there were a few things I wanted it to accomplish:

- Bundle multiple folders to backup to one archive.
- Select output directory on Drive and pick the name of the archive.
- Specify the number of backups to retain.
- Change all there parameters without making code changes, so I could repurpose the code for different jobs.

My goal is to a have a general purpose script for archiving, that could be configured for multiple jobs to backup different folders to independent archives on different cadences. This tutorial will include the script to accomplish this, along with instructions on setting up the environment for you.

## Instructions

### Set up your Google Cloud Project

1. If you haven't already, set up a new Google Cloud project in the Google Cloud Console (insert link). Feel free to re-use an existing project if you'd prefer.
2. Enable the Cloud Run API and Drive API in your project. (Link to enable APIs page)

### Create a service account

1. In the Cloud Console, go to the "Service Accounts" page. (Insert link)
2. Create a new service account with a descriptive name (e.g. "drive-backup-sa").
3. Grant the service account the following roles:
    1. "Cloud Run Invoker" - to allow it to run Cloud Run services.
    2. "Drive API Client" - to allow it to access Google Drive.

Note: Don't download your service account key file, `service_account.json`, the Cloud Run Job is authenticated with your chosen service account.

### Prepare your code

We'll be using Google Cloud Console's built-in Cloud Shell Editor for all our work, so you won't need to install any applications on your machine to get this running.

1. In the Google Cloud Console, open Cloud Shell by clicking on this icon in the upper-right corner then click to "Open Editor". (Insert screenshot)
2. From here, open your home directory and create a new folder named `drive-backup`.
3. Now let's start by adding the code files to this folder.

requirements.txt

```python
{% githubRaw "/mblackman/gdrive-cloud-sync/blob/main/requirements.txt" %}
```

<span>main.py</span>

```python
{% githubRaw "/mblackman/gdrive-cloud-sync/blob/main/main.py" %}
```

