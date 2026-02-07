# 🚀 How to Deploy Your Portfolio to GitHub Pages

Here is the exact step-by-step guide to get your new portfolio online for free.

## Phase 1: Create the Repository (Do this on GitHub.com)
1.  Log in to your GitHub account.
2.  Click the **+** icon in the top right and select **New repository**.
3.  **Repository name**: Enter `portfolio` (or `prisha-portfolio`).
4.  **Description**: "My personal portfolio website".
5.  **Public/Private**: Select **Public** (Required for free GitHub Pages).
6.  **Initialize this repository with**: DO NOT check any boxes here (no README, no .gitignore).
7.  Click **Create repository**.

## Phase 2: Connect Your Code (Run these in Terminal)
I have already prepared your local files. Now run these commands in your terminal to send them to GitHub.

**1. Copy the URL of your new repository** (it will look like `https://github.com/your-username/portfolio.git`).

**2. Link your local folder to GitHub:**
*(Run this command, pointing to your new repo)*
```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

## Phase 3: Go Live! (Enable GitHub Pages)
1.  Go back to your repository page on GitHub.
2.  Click on the **Settings** tab (gear icon).
3.  In the left sidebar, click **Pages**.
4.  Under **Build and deployment** > **Source**, select **Deploy from a branch**.
5.  Under **Branch**, select **main** and folder **/(root)**.
6.  Click **Save**.

**Wait about 1-2 minutes.** Refresh the page. You will see a bar at the top saying:
> "Your site is live at https://your-username.github.io/portfolio/"

**Click that link and share it with the world!** 🌍✨
