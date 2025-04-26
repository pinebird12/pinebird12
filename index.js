import {fetchJSON, renderProjects, fetchGithubData} from './global.js'

const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.project');

renderProjects(latestProjects, projectsContainer, 'h2');

const gitData = await fetchGithubData('pinebird12');
const gitElem = document.querySelector('.github-stats');

if (gitElem) {
  gitElem.innerHTML = `
        <dl class="stat-info">
          <dt>Public Repos:</dt><dd>${gitData.public_repos}</dd>
          <dt>Public Gists:</dt><dd>${gitData.public_gists}</dd>
          <dt>Followers:</dt><dd>${gitData.followers}</dd>
          <dt>Following:</dt><dd>${gitData.following}</dd>
        </dl>
    `;
}
