#!/usr/bin/env node
// the above line is a shebang line that tells the operating system to run this file with node purpose is to make the file executable
const { program } = require("commander"); // for command line interface
const { createProject } = require("../generators/createProject"); // for creating the project

program
  .name("create-architex-app")
  .description("Architex Scaffolding CLI")
  .argument("<project-name>")
  .action((name) => {
    createProject(name); // call the createProject function
  });

program.parse();