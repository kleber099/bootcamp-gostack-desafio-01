const express = require('express');

const server = express();
server.use(express.json());

let countRequest = 0;
const projects = [];

function checkIdProject(req, res, next) {
  const { id } = req.params; 

  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' })
  }

  return next();
}

function logRequests(req, res, next) {
  countRequest++;
  console.log(`Count Request: ${countRequest}`);

  return next();
}

server.use(logRequests);

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.get('/projects/:id', checkIdProject, (req, res) => {
  const { id } = req.params;

  const project = projects.find(p => p.id === id);

  return res.json(project);
});

server.post('/projects', (req, res) => {
  const project = req.body;

  project.tasks = [];
  projects.push(project);

  return res.json(projects);
});

server.put('/projects/:id', checkIdProject,(req, res) => {
  const { body, params } = req;
  const { title } = body;
  const { id } = params;
  
  const project = projects.find(p => p.id === id);
  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkIdProject, (req, res) => {
  const { id } = req.param;
  
  const index = projects.findIndex(p => p.id === id);
  projects.splice(index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkIdProject, (req, res) => {
  const { body, params } = req;
  const { title } = body;
  const { id } = params;
  
  const project = projects.find(p => p.id === id);
  project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
