import gnosisProposals from "../data/gnosisProposals.json" assert { type: "json" };
import mainnetProposals from "../data/mainnetProposals.json" assert { type: "json" };
import ipfsDataFile from "../ipfsData.json" assert { type: "json" };
import fs from "fs";

/*
 *
 * To run this script, change the "type" of package.json to "module"
 *
 */

const IPFS_URLS = [
  "https://ipfs.io/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://gateway.ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://ipfs.runfission.com/ipfs/",
  "https://hardbin.com/ipfs/",
];

const checkNumberOfProposals = () => {
  // read JSON file
  const data = ipfsDataFile;
  const numberOfProposals = Object.keys(data).length;
  return numberOfProposals;
};

const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Status not 200");
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => reject(error));
  });
};

const fetchFromIpfs = async (hash) => {
  // Create an array of fetch promises, one for each IPFS URL
  const fetchPromises = IPFS_URLS.map((url) => fetchUrl(url + hash));
  const result = await Promise.any(fetchPromises);
  return result;
};

const main = async (chain) => {
  const data = chain === "mainnet" ? mainnetProposals : gnosisProposals;
  const ipfsHashes = data.ipfsHashes;

  // load ipfsData.json
  const result = JSON.parse(JSON.stringify(ipfsDataFile));
  let fetchCounter = 0;

  for (const element of ipfsHashes) {
    const hash = element.hash;
    const proposalId = element.name;
    if (result[proposalId]) continue;

    try {
      const ipfsData = await fetchFromIpfs(hash);
      console.log("title: ", ipfsData.title);

      // add to result
      result[proposalId] = {
        description: ipfsData.description,
        title: ipfsData.title,
        hash,
      };

      // save every 10 requests
      fetchCounter++;
      if (fetchCounter % 10 === 0) {
        try {
          const numberOfProposalsInFile = checkNumberOfProposals();
          const newNumberOfProposals = Object.keys(result).length;

          if (newNumberOfProposals < numberOfProposalsInFile) {
            throw new Error(
              "ERROR! We are going to save less proposals than currently fetched"
            );
          }
        } catch (error) {
          console.error("Error writing file: ", error);
        }
      }
    } catch (error) {
      console.log(`could not fetch ${proposalId}`);
      continue;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  await fs.promises.writeFile("ipfsData.json", JSON.stringify(result));
  console.log("------");
  console.log("Saved!");
  console.log("------");
  return;
};

main("gnosis");
