import { Devvit, Post } from '@devvit/public-api';
import { postConfigNew } from '../server/core/post';

Devvit.configure({
  redis: true,
  redditAPI: true,
});

export const Preview: Devvit.BlockComponent<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <zstack width={'100%'} height={'100%'} alignment="center middle">
      <vstack width={'100%'} height={'100%'} alignment="center middle">
        <image
          url="loading.gif"
          description="Loading..."
          height={'140px'}
          width={'140px'}
          imageHeight={'240px'}
          imageWidth={'240px'}
        />
        <spacer size="small" />
        <text maxWidth={`80%`} size="large" weight="bold" alignment="center middle" wrap>
          {text}
        </text>
      </vstack>
    </zstack>
  );
};

// TODO: Remove this when defineConfig allows webhooks before post creation
Devvit.addMenuItem({
  // Please update as you work on your idea!
  label: '[Bolt Word Guesser]: New Post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;

    let post: Post | undefined;
    try {
      const subreddit = await reddit.getCurrentSubreddit();
      post = await reddit.submitPost({
        // Title of the post. You'll want to update!
        title: 'Word Guesser',
        subredditName: subreddit.name,
        preview: <Preview />,
      });
      await postConfigNew({
        redis: context.redis,
        postId: post.id,
      });
      ui.showToast({ text: 'Created post!' });
      ui.navigateTo(post.url);
    } catch (error) {
      if (post) {
        await post.remove(false);
      }
      if (error instanceof Error) {
        ui.showToast({ text: `Error creating post: ${error.message}` });
      } else {
        ui.showToast({ text: 'Error creating post!' });
      }
    }
  },
});

export default Devvit;
