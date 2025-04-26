import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.project');

renderProjects(projects, projectsContainer, 'h2');

const headingElem = document.querySelector('.project-title');

const heading = headingElem.textContent;
const numProj = projects.length;
headingElem.textContent = heading.concat(' (', numProj, ')');
