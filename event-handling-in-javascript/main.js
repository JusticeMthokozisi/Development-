// main.js

import Project from './Project.js';

const projects = [
  new Project('Software Development', 'Software development is the process of designing.', 'images.jpg', '3 months'),
  new Project('Networking', 'Networking refers to the practice of connecting computers and other devices to share data and resources.  ', 'download (1).jpg', '6 months'),
  new Project('Ethical hacking', 'Ethical hacking, also known as "white-hat" hacking, is the practice of testing and securing computer systems, networks, and applications .', 'download.jpg', '2 months'),
];

// Display all projects using console.log
projects.forEach(project => {
  console.log('Project Name:', project.name);
  console.log('Description:', project.description);
  console.log('Image URL:', project.imageUrl);
  console.log('Duration:', project.duration);
  console.log('---');
});
