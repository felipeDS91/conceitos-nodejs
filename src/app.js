const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepository = repositories.find(repository => repository.id === id);

  if (!findRepository) {
    return response.status(400).send();
  }

  const repositoryUpdated = { ...findRepository, title, url, techs};

  repositories = repositories.map(repository => {
    return (repository.id === id ? repositoryUpdated : repository)
  });

  return response.json(repositoryUpdated);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repository = repositories.filter(item => item.id === id);

  if (repository.length === 0) {
    return response.status(400).send();
  }

  repositories = repositories.filter(repository => repository.id !== id);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).send();
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
