const { execSync } = require("child_process"); // for running shell commands (like npm install) 

function installDeps(projectPath) {
  console.log("📦 Installing dependencies...");

  execSync("npm install", {
    stdio: "inherit", // allows us to see the output of the command in the terminal
    cwd: projectPath // tells the command to run inside the project folder
  });

  execSync(
    "npm install react-router-dom axios @tanstack/react-query react-hook-form zod @hookform/resolvers lucide-react i18next react-i18next react-toastify",
    {
      stdio: "inherit",
      cwd: projectPath
    }
  );
}

module.exports = { installDeps };