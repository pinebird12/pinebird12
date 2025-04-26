console.log('!!!');
console.log('A secret!')

// Set the theme on startup
let prefersDark = matchMedia('(prefers-color-scheme: dark)')['matches'];
if (prefersDark) {
  document.documentElement.dataset['theme'] = 'dark';
} else {
  document.documentElement.dataset['theme'] = 'light';
}
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
};


// Configure the navigation bar
let navLinks = $$("nav a");

let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname,
);

if (currentLink) {
  currentLink.classList.add('current');
};

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'curriculumVitae.html', title: 'CV' },
  { url: 'https://github.com/mawks12', title: 'GitHub (Student)'},
  { url: 'https://github.com/pinebird12', title: 'GitHub (Personal)'}
];

let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
  let url = p.url;
  let title = p.title;
  let a = document.createElement('a');
  const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/102l1/";         // GitHub Pages repo name
  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }
  a.href = url;
  a.textContent = title;
  nav.append(a);


  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  if (a.host != location.host) {
    a.target = "_blank"
  }
}

// Set up theme switching
document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="light dark">Automatic</option>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	</label>`,
);
if ('colorScheme' in localStorage) {
  let scheme = localStorage.colorScheme;
  document.documentElement.dataset['theme'] = scheme;
  document.querySelector('label.color-scheme select').value = scheme;
}


let select = document.querySelector(".color-scheme")

select.addEventListener('input', function (event) {
  if (event.target.value === 'light dark') {
    let prefersDark = matchMedia('(prefers-color-scheme: dark)')['matches'];
    if (prefersDark) {
      document.documentElement.dataset['theme'] = 'dark';
      localStorage.colorScheme = 'dark';
    } else {
      document.documentElement.dataset['theme'] = 'light';
      localStorage.colorScheme = 'light';
    }
  } else {
    document.documentElement.dataset['theme'] = event.target.value;
      localStorage.colorScheme = event.target.value;
  }
});


// Improve the mail form
let form = document.querySelector('form.contact')
if (form !== null) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    let data = new FormData(form);
    let url = form.action + '?'
    for (let [name, value] of data) {
      url = url + name;
      url = url + '=';
      url = url + encodeURIComponent(value);
      url = url + '&';
    }
    location.href = url;
  });
}

// Project page importing from json

export function renderProjects(projects, container) {
  if (container === null) {
    return null;
  } else {
      container.innerHTML = '';
      for (let project of projects) {
        const article = document.createElement('article');
        if (project['title'] === undefined
            || project['description'] === undefined
            || project['link'] === undefined) {  // Check for key components
          console.log("Found Project with missing data, ignoring...");
          console.log(project);
          continue;
        }

        const heading = document.createElement('h2');
        heading.textContent = project['title'];
        const desc = document.createElement('p');
        desc.textContent = project['description'];
        const link = document.createElement('a');
        link.setAttribute('href', project['link']);
        link.textContent = "Project Information"
        article.appendChild(heading);

        if (!(project['image'] === null)) {
          const image = document.createElement('img');
          image.setAttribute('src', project['image']);
          article.appendChild(image);
        }
        article.appendChild(desc);
        article.appendChild(link);
        container.appendChild(article);
    }
  }
}

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`failed to fetch Projects: ${response.statusText}`);
    } else {
      const data = await response.json();
      return data
    }
  } catch (error) {
    console.error("error fetching or parsing the JSON data:\n", error);
  }
}


export async function fetchGithubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
