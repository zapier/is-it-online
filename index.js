#!/usr/bin/env node
"use strict";

const path = require("path");
const EventEmitter = require("events");
const program = require("commander");
const notifier = require("node-notifier");
const opn = require("opn");
const Wreck = require("wreck");

const pkg = require("./package.json");

const log = (...args) => console.log(...args);
const error = (...args) => console.error(...args);

const URL = "url";

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)
  .arguments("<url>")
  .option("-i, --interval [seconds]", "Set the polling interval in seconds")
  .parse(process.argv);

const pollingInterval = (program.interval || 5) * 1000;
const urls = (program.args || []).filter(arg => arg !== pkg.main);

notifier.on("click", (instance, options) => {
  try {
    opn(options[URL], { wait: false });
  } catch (err) {
    error(`Error in notification click handler`, err);
  }
});

notifier.on("timeout", (instance, options) => {
  log(`Notification did not receive user input. That's ok.`);
});

log(`Polling interval ${pollingInterval}s`);

const performLivenessCheck = theUrl =>
  new Promise((resolve, reject) => {
    const runLivenessCheck = async () => {
      try {
        log(`Polling URL ${theUrl}`);

        const { res, payload } = await Wreck.get(theUrl);

        try {
          const message = `${theUrl} responded with ${res.statusCode}`;
          log(`Notification`, message);
          notifier.notify(
            {
              title: "Ping Me",
              message,
              icon: path.join(__dirname, `./assets/img/noun_sonar_924176.png`),
              [URL]: theUrl
            },
            (err, response) => {
              if (err) {
                error(`Failed to display notification`, err);
                reject(err);
              } else {
                resolve();
              }
            }
          );
        } catch (err) {
          error(`Error in notification`, err);
          reject(err);
        }
      } catch (err) {
        setTimeout(runLivenessCheck, pollingInterval);
      }
    };

    runLivenessCheck();
  });

const quit = (() => {
  const eventBus = new EventEmitter();
  eventBus.on("finish", ({ code }) => {
    process.exit(code);
  });

  return code => eventBus.emit("finish", { code });
})();

if (urls.length) {
  // TODO maybe handle multiple urls
  performLivenessCheck(urls[0]).then(() => quit(0), () => quit(1));
} else {
  program.outputHelp();
}
