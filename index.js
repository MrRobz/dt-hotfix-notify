const core = require('@actions/core');
const github = require('@actions/github');
const { WebClient } = require('@slack/web-api');

try {
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);
  
  const channel = core.getInput('channel');
  const slack = new WebClient(token);

  const { payload, ref, workflow, eventName } = github.context;
  const { owner, repo } = github.context.repo;
  const repoName = `<https://github.com/${owner}/${repo} | ${owner}/${repo}>`,

  const response = await slack.chat.postMessage({
      channel: channel,
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "🧑‍🚒 New *Hotfix Pull Request* Alert!"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `🔍 *Repository*: \n\t   ${repoName}`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `🔗 *Pull Request*: \n\t   <${payload.pull_request.html_url} | ${payload.pull_request.title}>`,
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "👤 *Author*: \n\t   [Author's Name]"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "🎟️ *Linear*: \n\t   [Linear Id]"
          }
        },
        {
          "type": "divider"
        }
      ]
  });

} catch (error) {
  core.setFailed(error.message);
}
