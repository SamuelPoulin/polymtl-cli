import config from "./config";

import fs from "fs";
import pdf from "pdf-parse";
import { BrowserContext } from "playwright";

export const fetchNewGrades = async (context: BrowserContext) => {
  try {
    const page = await context.newPage();

    await page.goto(
      "https://dossieretudiant.polymtl.ca/WebEtudiant7/poly.html"
    );

    // Username
    await page.locator("#code").click();
    await page.locator("#code").fill(config.dossierEtudiantUsername);

    // Password
    await page.locator("#code").press("Tab");
    await page.locator("#nip").fill(config.dossierEtudiantPassword);

    // Birthday
    await page.locator("#nip").press("Tab");
    await page.locator("#naissance").fill(config.dossierEtudiantBirthday);

    await page.getByRole("button", { name: "Connexion" }).click();

    const downloadPromise = page.waitForEvent("download");

    await page
      .getByRole("button", {
        name: "Bulletin cumulatif / notes du trimestre courant",
      })
      .click();

    const download = await downloadPromise;

    await download.path();

    await download.saveAs("output/grades-new.pdf");
  } catch (e) {
    console.error(e);
  }
};

export const compareGrades = async () => {
  try {
    const oldGradesExist = fs.existsSync("output/grades-old.pdf");
    const newGradesExist = fs.existsSync("output/grades-new.pdf");

    if (newGradesExist && !oldGradesExist) {
      fs.renameSync(
        "output/grades-new.pdf",
        "output/grades-old.pdf"
      );

      return false;
    }

    const oldGrades = fs.readFileSync("output/grades-old.pdf");
    const newGrades = fs.readFileSync("output/grades-new.pdf");

    const oldPDF = await pdf(oldGrades);
    const newPDF = await pdf(newGrades);

    if (oldPDF.text !== newPDF.text) {
      fs.copyFileSync(
        "output/grades-new.pdf",
        "output/grades-old.pdf"
      );

      return true;
    }

    return false;
  } catch (e) {
    console.error(e);
  }
};
