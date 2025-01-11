---
title: Automated Google Drive Archiving with Google Cloud Run
description: Instructions and resources to help you set up a scheduled backup that archives multiple folders in Google Drive. A set and forget process to help protect your vital data.
date: 2025-01-11
banner: /images/posts/google-drive-cloud-backup/banner.png
bannerAlt: Old man yelling at Google Cloud and Google Drive. It's a mood you might avoid with this guide.
tags:
  - software
  - google-cloud
  - python
---

Have you ever worried about losing your valuable Google Drive data?  This guide will show you how to set up automatic backups of your important folders, so you can have peace of mind knowing your data is safe. We'll use Google Cloud Run, a service that makes it easy to run code in the cloud without having to manage servers.

## Why Google Cloud Run?

- **Simplicity**: Google Cloud Run is easy to use, especially if you're already familiar with Google Cloud.
- **Integration**: It works seamlessly with Google Drive's APIs, making it simple to connect to your files and manage security.
- **Cost-effective**: Google Cloud offers a generous free tier for Cloud Run, making it a budget-friendly option for this project. This runs at no cost to me for my backups of ~100MB.

## What You'll Need

- A Google Cloud Project (you can create one for free)
- A Service Account with appropriate permissions
- A Destination Folder in Google Drive to store your backups
- The Source Folders in Google Drive that you want to back up
- Basic familiarity with the command line

## Let's Get Started!

### Set up your Google Cloud Project

- **Create a Project**: If you don't have one already, head over to the [Google Cloud Console](https://www.google.com/url?sa=E&source=gmail&q=https://console.cloud.google.com/) and create a new project.
- **Enable APIs**:  We'll need to enable a few APIs for this project.  In your Cloud Console, search for and enable the following APIs:
  - Cloud Run API
  - Cloud Scheduler API
  - Drive API

- **Open the Cloud Terminal**: Click on this icon in the upper-right corner. We'll be using this terminal to run our commands.

![Cloud Terminal Icon](/images/posts/google-drive-cloud-backup/cloud-console-indicator.png "Cloud Terminal Icon")

- **Enable necessary APIs**: Enable these APIs with the following command in your terminal:

```bash
gcloud services enable run.googleapis.com cloudscheduler.googleapis.com drive.googleapis.com
```

- **Find Your Project ID**: You'll need your Project ID for later steps. You can find it in the project dashboard of your Cloud Console.

![Cloud Projects Ids](/images/posts/google-drive-cloud-backup/cloud-project-id.png "Cloud Projects Ids")

### Create a service account

A service account is like a special user account that our automated process will use to access your Google Drive.

- **Create the account**: Run this command in the console to create a new service account:

```bash
gcloud iam service-accounts create drive-backup-service-account \
   --display-name "Drive Backup Service Account"
```

- **Grant permissions**: Grant the service account roles to invoke cloud run functions:

```bash
gcloud projects add-iam-policy-binding <your-project-id> \
  --member "serviceAccount:drive-backup-service-account@<your-project-id>.iam.gserviceaccount.com" \
  --role "roles/run.invoker"
```

- Replace `<your-project-id>` with the Project ID you recorded earlier.

### Prepare Drive Folders

- **Create a Destination Folder**: In your Google Drive, create a new folder where you want to store your backups. Make a note of the folder's ID (you can find it in the URL of the folder).
- **Identify Source Folders**: Locate the folders you want to back up and note their IDs as well.
- **Share with Service Account**: Share both the destination folder and the source folders with the email address of your service account. Remember to grant the appropriate permissions ("Editor" for the destination, "Reader" for the sources).

### Prepare your code

We'll be using Google Cloud Console's built-in Cloud Shell Editor for all our work, so you won't need to install any applications on your machine to get this running.

1. **Open Cloud Shell Editor**: In your Cloud Console, click the Cloud Shell icon in the top right corner. Then, click "Open Editor."
2. **Create a Project Folder**: In the Cloud Shell Editor, create a new folder named drive-backup in your home directory.
3. **Download the Code**: Download the code files from this GitHub repository: <https://github.com/mblackman/gdrive-cloud-sync>. You'll need the requirements.txt, main.py, and DOCKERFILE files. Place these files in the drive-backup folder you created.

### Build the Docker Image

A Docker image is like a container that holds all the code and dependencies needed to run our backup process.

- **Open Cloud Shell Terminal**: In the Cloud Shell Editor, open the terminal.
- **Build the Image**: Navigate to your project directory (`cd drive-backup`) and run the following command:

```bash
docker build -t drive-backup <your-project-id>:drive-backup:latest .
```

- Replace `<your-project-id>` with your actual Project ID. This command builds the Docker image.

- **Tag the Image**:  We need to tag the image so that Google Cloud knows where to find it. Run the following command:

```bash
docker tag <your-project-id>/drive-backup:latest gcr.io/<your-project-id>/drive-backup:latest
```

- **Authenticate Docker**: This allows Docker to push the image to your Google Cloud account.

```bash
gcloud auth configure-docker
```

- **Push the Image**:  Now, let's push the image to Google Container Registry, where it will be stored.

```bash
docker push gcr.io/<your-project-id>/drive-backup:latest
```

### Deploy to Cloud Run

- **Deploy the Job**:  This command deploys the Docker image to Cloud Run as a job.

```bash
gcloud run jobs deploy drive-backup \
  --image gcr.io/<your-project-id>/drive-backup:latest \
  --region <your-region> \
  --set-env-vars SOURCE_FOLDER_IDS="<source-folder-id>", \ 
                 DEST_FOLDER_ID=<dest_folder_id>, \
                 BACKUP_NAME=<backup_name>, \
                 VERSIONS_TO_KEEP=<number_of_versions_to_keep>
```

- Replace the placeholders with your actual values.
- You can specify multiple source folder IDs by separating them with spaces within the quotes.
- Choose a region for your Cloud Run job (e.g., `us-central1`). Remember this setting.
- `BACKUP_NAME` is the name your archive will have.
- `VERSIONS_TO_KEEP` is the number of backups you want to retain. Older backups will be automatically deleted.

### Set Up a Schedule

Finally, let's schedule our backup job to run automatically.

- **Create a Scheduled Job**: This command creates a scheduled job that will run our backup every day at 2 AM.

```bash
gcloud scheduler jobs create http drive-backup-daily \
  --location <your-region> \
  --schedule="0 2 * * *" \
  --uri="https://<your-region>-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/<you-project-id>/jobs/drive-backup:run" \
  --http-method POST \
  --oauth-service-account-email "drive-backup-service-account@<your-project-id>.iam.gserviceaccount.com"
```

- Replace the placeholders with your values.
- The schedule field uses cron syntax. `"0 2 * * *"` means "run every day at 2 AM." I like [this site](https://crontab.guru/#0_2_*_*_*) for testing out scheduling configurations.

**That's it!** You've successfully set up automated backups for your Google Drive folders.  Now you can rest easy knowing your data is safe and sound.

This setup provides a solid foundation for your Google Drive backup strategy.  But why stop here?  Here are some ideas for customizing and enhancing your system:

- **Experiment with the Code**: Dive into the main.py script and explore different options. You can modify the compression type, add more sophisticated error handling, or even integrate with other Google Cloud services.
- **Explore Advanced Scheduling**: The Cloud Scheduler offers more advanced scheduling options. You can set up your backups to run at specific intervals, on certain days of the week, or even in response to events.
- **Add Notifications**: Configure email or Slack notifications to be informed about successful backups or any potential errors.
- **Version Control Your Code**: Store your code in a Git repository (like GitHub or GitLab) to track changes and collaborate with others.

With a little creativity and exploration, you can tailor this solution to perfectly fit your needs and create a robust and reliable backup system for your valuable data.
