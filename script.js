const { Octokit } = require('octokit');

const octokit = new Octokit({ auth: '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' });

const dependedResources = {
  'trial-test2': ['depended']
  //and other depended organizations and repos
}
const newVersion = process.argv[2]
async function updateDependency(dependedResources, newVersion) {
  try {
    console.log(newVersion);

    for (const [organization, repos] of Object.entries(dependedResources)) {
      for (const repo of repos) {
        try {
          const { data: packageB } = await octokit.request(`GET /repos/${organization}/${repo}/contents/package.json`);
          const packageBContent = Buffer.from(packageB.content, 'base64').toString('utf-8');
          const packageBJSON = JSON.parse(packageBContent);

          packageBJSON.devDependencies['test-a'] = newVersion;

          const updatedPackageBContent = JSON.stringify(packageBJSON);
          console.log(JSON.parse(packageBContent).devDependencies['test-a']);

          console.log(process.argv);
          await octokit.request(`PUT /repos/${organization}/${repo}/contents/package.json`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer YOUR_GITHUB_TOKEN`,
            },
            content: Buffer.from(updatedPackageBContent).toString('base64'),
            sha: packageB.sha,
            message: 'Update projectA dependency in projectB',
            committer: {
              name: 'Arsen Kozariv',
              email: 'arik912@gmail.com',
            },
          });

          console.log(`Dependency updated successfully for ${organization}/${repo}`);
        } catch (error) {
          console.error(`Error updating dependency for ${organization}/${repo}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('Error updating dependency:', error.message);
  }
}



updateDependency(dependedResources, newVersion);
