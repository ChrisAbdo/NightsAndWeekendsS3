const ipfsClient = require("ipfs-http-client");

const projectId = "2OFayY3iAT7Lm9zEBMn1lqqo61V";
const projectSecret = "60a65fa9c0e0527140baae1bb8cbeb17";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default client;
