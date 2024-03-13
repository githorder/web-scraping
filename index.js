import { getPageContent, getMSKPageContent } from "./utils/puppeteer.util.js";
import { readExcelFile, writeExcelFile } from "./utils/xlsx.util.js";

async function fetchContents(startIndex) {
  try {
    const excelData = (await readExcelFile("./data/msk.xlsx", "Самсон")).slice(
      startIndex,
      startIndex + 3
    );

    if (excelData.length === 0) return [];

    const pageContents = await Promise.all(
      excelData.map((row) => {
        return row["Сылка"].length > 1
          ? getPageContent(
              row["Сылка"],
              ["li.wrap-tabs__item", ".discription_with_icons"],
              row["Название"]
            )
          : { Название: row["Название"] };
      })
    );

    // console.log(pageContents);

    return [...pageContents, ...(await fetchContents(startIndex + 3))];
  } catch (err) {
    console.log("The error: ", err);
  }
}

async function fetchMSKContents(startIndex) {
  try {
    const excelData = (await readExcelFile("./data/msk.xlsx", "МСК")).slice(
      startIndex,
      startIndex + 3
    );

    // if (excelData.length === 0) return [];
    if (startIndex === 3) return [];

    const pageContents = await Promise.all(
      excelData.map((row) => {
        return row["Ссылка"].length > 1
          ? getMSKPageContent(row["Ссылка"], [".localtext"], row["Название"])
          : { Название: row["Название"] };
      })
    );

    // console.log(pageContents);

    return [...pageContents, ...(await fetchMSKContents(startIndex + 3))];
  } catch (err) {
    console.log("The error: ", err);
  }
}

async function start() {
  try {
    const content = await fetchMSKContents(0);
    console.log(content);

    // writeExcelFile("./data/msk-new.xlsx", "MSK продукты (new)", content);
  } catch (err) {
    console.log("The error: ", err);
  }
}

start();
