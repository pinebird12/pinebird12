import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


// D3 code for generating the plot in the projects page
let arcGenerator = d3.arc().innerRadius(15).outerRadius(50);
const projects = await fetchJSON('../lib/projects.json');

let selectedIndex = -1;
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
let visProj = projects;
let data = projFormat(projects);
function makePlot(data) {
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

  // coloring the arcs
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  arcs.forEach((arc, idx) => {
    d3
      .select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx));
  });

  let legend = d3.select('.legend');
  console.log(legend);
  legend.html(null);
  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
      .attr('class', 'legend-elem')
      .html(`<span class="swatch"></span>${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
  });


  let svg = d3.select('svg');
  svg.selectAll('path').remove();
  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg
          .selectAll('path')
          .attr('class', (_, idx) => (
            idx === selectedIndex ? 'selected' : null
          ));

        legend
          .selectAll('li')
          .attr('class', (_, idx) => (
            idx === selectedIndex ? 'selected legend-elem' : 'legend-elem'
          ));

        if (selectedIndex === -1) {
          visProj = projects;
        } else {
          visProj = projects.filter((obj) =>
            obj.year === legend.selectAll('li')
              .filter((d, i) =>
                i === selectedIndex).text().split(/(\s+)/)[0]
          );
        console.log(visProj);
        }
        renderProjects(visProj, projectsContainer, 'h2');
    });
  });
}

const projectsContainer = document.querySelector('.project');

makePlot(data);

// add a search bar
let query = '';

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  // update query value
  query = event.target.value.toLowerCase();
  visProj = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  renderProjects(visProj, projectsContainer);
  let projInfo = projFormat(visProj);
  makePlot(projInfo);
});

renderProjects(visProj, projectsContainer, 'h2');
