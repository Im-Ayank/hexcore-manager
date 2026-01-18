const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const eventsPath = path.join(__dirname, "../events");

  for (const folder of fs.readdirSync(eventsPath)) {
    const folderPath = path.join(eventsPath, folder);

    for (const file of fs.readdirSync(folderPath)) {
      if (!file.endsWith(".js")) continue;

      const event = require(path.join(folderPath, file));
      const eventName = file.split(".")[0];

      client.on(eventName, event.bind(null, client));
    }
  }
};
