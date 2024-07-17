import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://m.cafe.naver.com/ca-fe/2pl");

  const targetArticleHandle = await page.evaluateHandle(() => {
    const $articles = document.getElementsByClassName("ArticleListItem");

    for (let $article of $articles) {
      const span = $article.getElementsByClassName("tit typo_title-large")[0];
      if (span && span.textContent.includes("정겨운맛풍경")) {
        return $article;
      }
    }

    return null;
  });

  if (!targetArticleHandle) {
    console.log("올라온 식단표가 없습니다.");
    await browser.close();
    return;
  }

  const $targetArticle = targetArticleHandle.asElement();
  if ($targetArticle) {
    await $targetArticle.click();
    await page.waitForNavigation();
    await page.waitForSelector(".se-main-container", { visible: true });
  }

  const imgSrc = await page.evaluate(() => {
    const $container = document.getElementsByClassName("se-main-container")[0];
    if ($container) {
      const $img = $container.querySelector("img");
      return $img.src;
    }
    return [];
  });

  await page.goto(imgSrc);

  // await browser.close();
})();
