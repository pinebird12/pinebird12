console.log('!!!');
console.log('A secret!')

// Set the theme initialy:
let prefersDark = matchMedia('(prefers-color-scheme: dark)')['matches'];
if (prefersDark) {
  document.documentElement.dataset['theme'] = 'dark';
} else {
  document.documentElement.dataset['theme'] = 'light';
}

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
};

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
  { url: 'https://github.com/mawks12', title: 'GitHub'},
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

let select = document.querySelector(".color-scheme")

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  if (event.target.value === 'light dark') {
    let prefersDark = matchMedia('(prefers-color-scheme: dark)')['matches'];
    if (prefersDark) {
      document.documentElement.dataset['theme'] = 'dark';
    } else {
      document.documentElement.dataset['theme'] = 'light';
    }
  } else {
    document.documentElement.dataset['theme'] = event.target.value;
  }
});
