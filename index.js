const core = require('@actions/core');
const github = require('@actions/github');
const { WebClient } = require('@slack/web-api');

try {  
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);
  
  const channel = core.getInput('channel');
  const token = process.env.SLACK_BOT_TOKEN;
  const slack = new WebClient(token);

  const { payload, actor } = github.context;
  const { owner, repo } = github.context.repo;
  
  const repoName = `<https://github.com/${owner}/${repo} | ${owner}/${repo}>`;
  const title = payload.pull_request.title;
  
  if(title.startsWith('Release')) {
    return;
  }

  
  const linearMatches = title.match(/(ENG-\d+,?)/g) || [];
  const linearMatchesString = linearMatches.map(ticketId => `<https://linear.app/drivetrain/issue/${ticketId} | ${ticketId}>`).join('\n');
  

  slack.chat.postMessage({
      channel: channel,
      text: 'new hotfix PR alert',
      blocks: [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "🚒 Hotfix Pull Request Alert!"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `🔍  *Repository*: \n\t    ${repoName}`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `🔗  *Pull Request*: \n\t    <${payload.pull_request.html_url} | ${payload.pull_request.title}>`,
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `👤  *Author*: \n\t    ${actor}`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `🎟️  *Linear*: \n\t    ${linearMatchesString}`
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
