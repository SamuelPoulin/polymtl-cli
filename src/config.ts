import * as dotenv from "dotenv";
dotenv.config();

const config = {
  discordToken: process.env.DISCORD_TOKEN ?? "",
  discordChannel: process.env.DISCORD_CHANNEL ?? "",
  dossierEtudiantUsername: process.env.DOSSIER_ETUDIANT_USERNAME ?? "",
  dossierEtudiantBirthday: process.env.DOSSIER_ETUDIANT_BIRTHDAY ?? "",
  dossierEtudiantPassword: process.env.DOSSIER_ETUDIANT_PASSWORD ?? "",
  fetchInterval: process.env.FETCH_INTERVAL ?? "",
};

if (Object.values(config).includes("")) {
    throw new Error("Some environment variables are missing." + JSON.stringify(config));
}

export default config;