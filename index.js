import puppeteer from "puppeteer";

async function findArticleHandle(page, keywords) {
  return await page.evaluateHandle((keywords) => {
    const $articles = document.getElementsByClassName("ArticleListItem");

    for (let $article of $articles) {
      const span = $article.getElementsByClassName("tit typo_title-large")[0];
      if (span && span.textContent.includes(keywords)) {
        return $article;
      }
    }

    return null;
  }, keywords);
}

async function navigateToArticle(page, $targetElement) {
  if ($targetElement) {
    await $targetElement.click();
    await page.waitForNavigation();
    await page.waitForSelector(".se-main-container", { visible: true });
  }
}

async function getImageSrc(page) {
  return await page.evaluate(() => {
    const $container = document.getElementsByClassName("se-main-container")[0];
    if ($container) {
      const $img = $container.querySelector("img");
      return $img.src;
    }
    return [];
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://m.cafe.naver.com/ca-fe/2pl");

  const targetArticleHandle = await findArticleHandle(page, "정겨운맛풍경");

  if (!targetArticleHandle) {
    console.log("올라온 식단표가 없습니다.");
    await browser.close();
    return;
  }

  const $targetArticle = targetArticleHandle.asElement();
  await navigateToArticle(page, $targetArticle);

  await getImageSrc(page);

  await page.goto(imgSrc);
})();
