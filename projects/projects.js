import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// D3 code for generating the plot in the projects page
let arcGenerator = d3.arc().innerRadius(9).outerRadius(50);
const projects = await fetchJSON('../lib/projects.json');

function projFormat(data) {

  let rolledData = d3.rollups( // load relavent parts of the data
    data,
    (v) => v.length,
    (d) => d.year,
  );
  let formated = rolledData.map(([year, count]) => {
    return { value: count, label: year }; // reformat for plotting
  });
  return formated
}

let data = projFormat(projects);

let total = 0;

for (let d of data) {
  total += d;
}

// Plotting graphics
let angle = 0;
let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));


// generating the plot
for (let d of data) {
  let endAngle = angle + (d / total) * 2 * Math.PI;
  arcData.push({ startAngle: angle, endAngle });
  angle = endAngle;
}
let colors = d3.scaleOrdinal(d3.schemeTableau10);
arcs.forEach((arc, idx) => {
  d3
    .select('svg')
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(idx));
});

let legend = d3.select('.legend');
data.forEach((d, idx) => {
  legend
    .append('li')
    .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
    .attr('class', 'legend-elem')
    .html(`<span class="swatch"></span>${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
});


// add a search bar
let query = '';


const projectsContainer = document.querySelector('.project');

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  // update query value
  query = event.target.value.toLowerCase();
  // TODO: filter the projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  renderProjects(filteredProjects, projectsContainer);
});

renderProjects(projects, projectsContainer, 'h2');

const headingElem = document.querySelector('.project-title');

const heading = headingElem.textContent;
const numProj = projects.length;
headingElem.textContent = heading.concat(' (', numProj, ')');
