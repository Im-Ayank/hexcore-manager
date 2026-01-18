const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  client.commands = new Map();

  const commandsPath = path.join(__dirname, "../commands");

  const loadCommands = (dir) => {
    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file);

      if (fs.statSync(fullPath).isDirectory()) {
        loadCommands(fullPath);
      } else if (file.endsWith(".js")) {
        const command = require(fullPath);
        client.commands.set(command.name, command);
      }
    }
  };

  loadCommands(commandsPath);
};
