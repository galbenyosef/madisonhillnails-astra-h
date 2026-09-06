import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("home is accessible, responsive, and has verified local SEO details", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/Madison Hill Nails/);
  await expect(page.locator("h1")).toHaveText(/Good nails.*Great energy/);
  const schema = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  );
  expect(schema.address.streetAddress).toBe("349 Main St");
  expect(schema.aggregateRating).toBeUndefined();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  if (info.project.name === "desktop") {
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const title = await page.locator("h1").boundingBox();
      expect(title!.x + title!.width).toBeLessThanOrEqual(width);
      const lettering = await page.locator("h1 em").evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return range.getBoundingClientRect().right;
      });
      expect(lettering).toBeLessThanOrEqual(width);
    }
  }
  await page.screenshot({
    path: `test-results/design-${info.project.name}.png`,
    fullPage: false,
    style: "nextjs-portal { display: none; }",
  });
  await page.screenshot({
    path: `test-results/home-${info.project.name}.png`,
    fullPage: true,
    style: "nextjs-portal { display: none; }",
  });
});
test("color selection and navigation work with reduced motion", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Lilac daydream" }).click();
  await expect(
    page.getByRole("heading", { name: "Lilac daydream" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Lilac daydream" }),
  ).toHaveAttribute("aria-pressed", "true");
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }),
    ).toBeVisible();
  }
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Visit us" })
    .click();
  await expect(page.locator("#visit")).toBeInViewport();
  expect(
    await page
      .locator("[data-depth]")
      .first()
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");
});
test("parallax moves separate layers and can be paused", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".editorial-home")).toHaveAttribute(
    "data-motion",
    "running",
  );
  const layers = page.locator(".edit-hero [data-depth]");
  const offsets = () =>
    layers.evaluateAll((items) =>
      items.map(
        (item) => new DOMMatrixReadOnly(getComputedStyle(item).transform).m42,
      ),
    );
  const before = await offsets();
  await page.evaluate(() => window.scrollTo({ top: 350, behavior: "instant" }));
  await expect
    .poll(async () => Math.abs((await offsets())[0] - before[0]))
    .toBeGreaterThan(15);
  const after = await offsets();
  expect((after[0] - before[0]) * (after[1] - before[1])).toBeLessThan(0);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.locator(".editorial-home")).toHaveAttribute(
    "data-motion",
    "still",
  );
  await expect.poll(offsets).toEqual([0, 0]);
  await page.getByRole("button", { name: "Resume motion" }).click();
  await expect(page.locator(".editorial-home")).toHaveAttribute(
    "data-motion",
    "running",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(offsets).toEqual([0, 0]);
});
test("unconfigured booking is honest and protected pages redirect", async ({
  page,
  request,
}) => {
  await page.goto("/book");
  await expect(
    page.getByRole("heading", { name: "Online booking is coming soon." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Confirm my appointment" }),
  ).toHaveCount(0);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByText("Online accounts and appointments are getting ready.", {
      exact: false,
    }),
  ).toBeVisible();
  const response = await request.post("/api/booking", {
    data: { action: "settings", payload: { online_booking_enabled: true } },
  });
  expect(response.status()).toBe(403);
});
test("policy and missing pages remain accessible", async ({ page }) => {
  for (const route of ["/privacy", "/policies", "/missing-page"]) {
    await page.goto(route);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations.map((v) => v.id),
    ).toEqual([]);
    await expect(page.locator("h1")).toHaveCount(1);
  }
});
