## Devvit Bolt Starter Experimental

An experimental starter that explores a new way to build applications on Reddit's developer platform.

## Video Tutorial

[![Video Tutorial](docs-img/video-preview.png)](https://www.youtube.com/watch?v=uI85NRCoQNU)

## Getting Started

This template is made specifically to work with **Bolt.new**.
Click the button below to open this template directly in Bolt:

<a href="https://bolt.new/github.com/reddit/devvit-bolt-starter-experimental"><img src="docs-img/open-in-bolt-2x.png" heigh="36px" width="199px" alt="Open in Bolt"></a>

As soon as the project is checked out you will get the following errors.
**This is expected**!

```
❌  Authentication: Please run `npm run login` to authenticate with Reddit
❌  App initialization: Please run `npm run devvit:init` to setup your app remotely
❌  Playtest subreddit: Please update YOUR_SUBREDDIT_NAME in the dev:devvit script in package.json
```

### Step 1: Login

In bolt terminal, run

```
npm run login
```

This will authenticate with Reddit. You will be prompted to follow a link and paste an authentication code.
Paste that authentication code in your **terminal window** in Bolt, then press `<Enter>`.

### Step 2: App Initialization

In bolt terminal, run

```
npm run devvit:init
```

This will get your app set up with Devvit. You will be prompted to follow a link and paste an authentication code. Paste that authentication code in your **terminal window** in Bolt, then press `<Enter>`.

### Step 3: Playtest subreddit

For this step, you will need to go to Reddit and create an empty subreddit for you to test your app.

You can do this by following going to [Reddit](https://www.reddit.com) and clicking the **"Create a Community"** button in the left-side navigation. Once you create your community, paste the name of the subreddit (for example if you community is reddit.com/r/my_test_subreddit, you will paste `my_test_subreddit`) into the `package.json` file, replacing the string `YOUR_SUBREDDIT_NAME`.

After that, if you run `npm run dev` again, all checks should pass and you should be able to test your application on Reddit.

### Step 4: Testing your app

Once the initial configuration is done, you can test your application by navigating to your test subreddit, clicking the three dots icon on the top-right. The command will be called `[Bolt Word Guesser] New Post`. Once you create a new post you can go back and forth with Bolt by prompting your way to making your app and testing it on Reddit.

Now vibe code away!

### Known limitations

- **Only test on your subreddit:** Your app's backend requests will not work on Bolt's preview window. You need to continue to test your app running in your subreddit, where your backend code will work.

- **Use Reddit's backend:** Devvit provides a free of charge scalable backend. Bolt will be able to help you use Reddit's Redis database for key-value storage. You are not going to be able to use other tools such as Supabase for your backend.

- **This is experimental:** While the Devvit team is working to make it as easy as possible to use Bolt for authoring Reddit apps, this is all still in an experimental phase. If you run into issues, please [join our Discord](https://discord.com/invite/Cd43ExtEFS) and ask your questions in **#devvit-vibe-coding**
