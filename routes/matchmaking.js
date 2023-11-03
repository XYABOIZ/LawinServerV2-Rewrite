const express = require("express");
const app = express.Router();
const dns = require("dns");
const functions = require("../structs/functions.js");

const { verifyToken, verifyClient } = require("../tokenManager/tokenVerify.js");
const log = require("../structs/log.js");

let buildUniqueId = {};
let server;
let ip; // dont remove this (ik it looks like its not needed but it really is)

if (typeof serverPort === undefined) {
  serverPort = 7777;
}

app.get("/fortnite/api/matchmaking/session/findPlayer/*", (req, res) => {
  res.status(200).end();
});

app.get(
  "/fortnite/api/game/v2/matchmakingservice/ticket/player/*",
  verifyToken,
  (req, res) => {
    if (req.query["player.option.customKey"] !== undefined) {
      // check if IP is undefined
      server = req.query["player.option.customKey"].toString(); // getting stuff (IP, PORT)
    }
    if (typeof req.query.bucketId != "string") return res.status(400).end();
    if (req.query.bucketId.split(":").length != 4) return res.status(400).end();

    buildUniqueId[req.user.accountId] = req.query.bucketId.split(":")[0];

    res.json({
      serviceUrl: "ws://127.0.0.1",
      ticketType: "mms-player",
      payload: "69=",
      signature: "420=",
    });
    res.end();
  }
);

app.get(
  "/fortnite/api/game/v2/matchmaking/account/:accountId/session/:sessionId",
  (req, res) => {
    res.json({
      accountId: req.params.accountId,
      sessionId: req.params.sessionId,
      key: "none",
    });
  }
);

app.get(
  "/fortnite/api/matchmaking/session/:sessionId",
  verifyToken,
  (req, res) => {
    DoNotStartJoiningPart = false;
    serverIp = server.split(":")[0];
    serverPort = server.split(":")[1];

    if (typeof server.split(":")[0] === "undefined") {
      serverIp = "secrets-server.xyz";
    }
    if (typeof server.split(":")[1] === "undefined") {
      serverPort = 7777;
    }
    try {
      dns.lookup(serverIp, (err, address, family) => {
        if (err) {
          log.matchmaking_error("Server cannot convert IP of: " + serverIp);
          DoNotStartJoiningPart = true;
        }
        serverIp = address;
      });
    } catch {
      log.matchmaking_error("Server cannot convert IP of: " + serverIp);
    }

    log.matchmaking("Client will join a gameserver in 5 seconds!");

    setTimeout(() => {
      if (DoNotStartJoiningPart == false) {
        // domain convertion to ip takes 5 seconds so we need to wait for this..
        log.matchmaking(
          `Client is joining a gameserver, connecting to: ${serverIp}:${serverPort}`
        );
        res.json({
          id: req.params.sessionId,
          ownerId: functions.MakeID().replace(/-/gi, "").toUpperCase(),
          ownerName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
          serverName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
          serverAddress: serverIp,
          serverPort: serverPort,
          maxPublicPlayers: 220,
          openPublicPlayers: 175,
          maxPrivatePlayers: 0,
          openPrivatePlayers: 0,
          attributes: {
            REGION_s: "EU",
            GAMEMODE_s: "FORTATHENA",
            ALLOWBROADCASTING_b: true,
            SUBREGION_s: "GB",
            DCID_s: "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
            tenant_s: "Fortnite",
            MATCHMAKINGPOOL_s: "Any",
            STORMSHIELDDEFENSETYPE_i: 0,
            HOTFIXVERSION_i: 0,
            PLAYLISTNAME_s: "Playlist_DefaultSolo",
            SESSIONKEY_s: functions.MakeID().replace(/-/gi, "").toUpperCase(),
            TENANT_s: "Fortnite",
            BEACONPORT_i: 15009,
          },
          publicPlayers: [],
          privatePlayers: [],
          totalPlayers: 45,
          allowJoinInProgress: false,
          shouldAdvertise: false,
          isDedicated: false,
          usesStats: false,
          allowInvites: false,
          usesPresence: false,
          allowJoinViaPresence: true,
          allowJoinViaPresenceFriendsOnly: false,
          buildUniqueId: buildUniqueId[req.user.accountId] || "0",
          lastUpdated: new Date().toISOString(),
          started: false,
        });
      } else {
        res.status(404); // if domain convertion fails
        res.end();
      }
    }, 5000);
  }
);

app.post("/fortnite/api/matchmaking/session/*/join", (req, res) => {
  res.status(204).end();
});

app.post("/fortnite/api/matchmaking/session/matchMakingRequest", (req, res) => {
  res.json([]);
});

module.exports = app;
