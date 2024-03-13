import puppeteer from "puppeteer";

async function getPageContent(
  url,
  selectors = ["li.wrap-tabs__item", ".discription_with_icons"],
  name
) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(selectors[0]);
    await page.waitForSelector(selectors[1]);

    const data = await page.evaluate(() => {
      const TABS = ["Описание", "Характеристики", "Нормы браковки"];

      let htmlData = {};

      let regexSrc = /(src=")([^"]*")/gi;
      let regexHref = /(href=")([^"]*")/gi;

      const mainDesc = document
        .querySelector(".discription_with_icons")
        .innerHTML.trim()
        .replace(/\n/g, "")
        .replace(regexSrc, "$1https://samson-td.ru/$2")
        .replace(regexHref, "$1https://samson-td.ru/$2");

      htmlData = { "Главное описание": mainDesc };

      for (
        let i = 1;
        i <= Array.from(document.querySelectorAll("li.wrap-tabs__item")).length;
        i++
      ) {
        const currentTab = document.querySelector(
          `li.wrap-tabs__item:nth-of-type(${i})`
        );

        if (!TABS.includes(currentTab.textContent)) continue;

        currentTab.click();

        const dataDesc = document.querySelector(
          ".wrap-item-tabs .wrap-description__item.active"
        );

        let regexSrc = /(src=")([^"]*")/gi;
        let regexHref = /(href=")([^"]*")/gi;

        htmlData = {
          ...htmlData,
          [currentTab.textContent === "Описание"
            ? "Описание"
            : currentTab.textContent === "Характеристики"
            ? "Характеристики"
            : currentTab.textContent === "Нормы браковки"
            ? "Нормы браковки"
            : "Другое"]: dataDesc.innerHTML
            .trim()
            .replace(/\n/g, "")
            .replace(regexSrc, "$1https://samson-td.ru/$2")
            .replace(regexHref, "$1https://samson-td.ru/$2"),
        };
      }

      return htmlData;
    });

    await browser.close();

    return { Название: name, ...data };
  } catch (err) {
    console.log("The error: ", err);
  }
}

async function getMSKPageContent(url, selectors = [".localtext"], name) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(selectors[0]);

    const data = await page.evaluate(() => {
      let htmlData = {};

      let regexSrc = /(src=")([^"]*")/gi;
      let regexHref = /(href=")([^"]*")/gi;

      const mainDesc = document
        .querySelector(".localtext")
        .innerHTML.trim()
        .replace(/\n/g, "")
        .replace(regexSrc, "$1https://mosstalkanat.uz/$2")
        .replace(regexHref, "$1https://mosstalkanat.uz/$2");

      htmlData = { "Главное описание": mainDesc };

      return htmlData;
    });

    await browser.close();

    return { Название: name, ...data };
  } catch (err) {
    console.log("The error: ", err);
  }
}

export { getPageContent, getMSKPageContent };
