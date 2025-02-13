const express = require("express");
const fs = require("fs");
const app = express.Router();

app.get("/fortnite/api/game/v2/voice/*", (req, res) => {
  res.status(204);
  res.end();
});

app.get("/eulatracking/api/shared/agreements/fn*", async (req, res) => {
  res.json({});
});

app.get("/api/voicechat", (req, res) => {
  const Id = req.body.machine_id;
  res.json({ machine_id: Id });
});

app.post("/api/voicechat", (req, res) => {
  const Id = req.body.machine_id;
  res.json({ machine_id: Id });
});

app.post("/fortnite/api/game/v2/chat/*/*/*/*", (req, res) => {
  const config = JSON.parse(fs.readFileSync("./Config/config.json").toString());
  let resp = config.chat.EnableGlobalChat
    ? { GlobalChatRooms: [{ roomName: "lawinserverglobal" }] }
    : {};

  res.json(resp);
});

app.post("/fortnite/api/game/v2/tryPlayOnPlatform/account/*", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(true);
});

app.get("/launcher/api/public/distributionpoints/", (req, res) => {
  res.json({
    distributions: [
      "https://download.epicgames.com/",
      "https://download2.epicgames.com/",
      "https://download3.epicgames.com/",
      "https://download4.epicgames.com/",
      "https://epicgames-download1.akamaized.net/",
    ],
  });
});

app.get("/waitingroom/api/waitingroom", (req, res) => {
  res.status(204);
  res.end();
});

app.get("/socialban/api/public/v1/*", (req, res) => {
  res.json({
    bans: [],
    warnings: [],
  });
});

app.get(
  "/fortnite/api/game/v2/events/tournamentandhistory/*/EU/WindowsClient",
  (req, res) => {
    res.json({});
  }
);

app.get("/fortnite/api/statsv2/account/:accountId", (req, res) => {
  res.json({
    startTime: 0,
    endTime: 0,
    stats: {},
    accountId: req.params.accountId,
  });
});

app.get("/statsproxy/api/statsv2/account/:accountId", (req, res) => {
  res.json({
    startTime: 0,
    endTime: 0,
    stats: {},
    accountId: req.params.accountId,
  });
});

app.get(
  "/fortnite/api/stats/accountId/:accountId/bulk/window/alltime",
  (req, res) => {
    res.json({
      startTime: 0,
      endTime: 0,
      stats: {},
      accountId: req.params.accountId,
    });
  }
);

app.post("/fortnite/api/feedback/*", (req, res) => {
  res.status(200);
  res.end();
});

app.post("/fortnite/api/statsv2/query", (req, res) => {
  res.json([]);
});

app.post("/statsproxy/api/statsv2/query", (req, res) => {
  res.json([]);
});

app.post("/fortnite/api/game/v2/events/v2/setSubgroup/*", (req, res) => {
  res.status(204);
  res.end();
});

app.get("/fortnite/api/game/v2/enabled_features", (req, res) => {
  res.json([]);
});

app.get("/api/v1/events/Fortnite/download/*", (req, res) => {
  res.json({});
});

app.get("/fortnite/api/game/v2/twitch/*", (req, res) => {
  res.status(200);
  res.end();
});

app.get("/fortnite/api/game/v2/world/info", (req, res) => {
  res.json({});
});

app.post(
  "/fortnite/api/game/v2/chat/*/recommendGeneralChatRooms/pc",
  (req, res) => {
    res.json({});
  }
);

app.get("/fortnite/api/receipts/v1/account/*/receipts", (req, res) => {
  res.json([]);
});

app.get("/fortnite/api/game/v2/leaderboards/cohort/*", (req, res) => {
  res.json([]);
});

app.post("/datarouter/api/v1/public/data", async (req, res) => {
  res.status(204);
  res.end();
});

app.post("/telemetry/data/datarouter/api/v1/public/data", (req, res) => {
  res.status(204);
  res.end();
});

module.exports = app;
