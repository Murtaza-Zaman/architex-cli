// main brain of the generator, this is where we will call all the other functions to create the project structure and files

const { execSync } = require("child_process"); // for running shell commands (like npx, npm, etc)
const { installDeps } = require("./installDeps"); // to install dependencies
const { setupStructure } = require("./setupStructure"); // to setup the project structure
const path = require("path"); // for working with file paths

function createProject(projectName) {
  console.log("🚀 Creating Architex project...");

  // 1. Create Vite project
  execSync(
    `npm create vite@latest ${projectName} -- --template react --no-interactive`,
    { stdio: "inherit" }
  );

  // 2. Absolute project path (IMPORTANT FIX)
  // process.cwd() gives us the current working directory (where we ran the command) example E:\create-architex-studio 
  // path.join() joins the current working directory with the project name to create the absolute path example E:\create-architex-studio\my-architex-app
  const projectPath = path.join(process.cwd(), projectName);

  console.log("📁 Project Path:", projectPath);

  // 3. Install dependencies inside project folder
  installDeps(projectPath);

  // 5. Setup structure (PASS PATH)
  setupStructure(projectPath);

  console.log("✅ Architex project ready!");
}

module.exports = { createProject };