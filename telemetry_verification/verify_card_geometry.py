import asyncio
import os
import sys
import math
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Listen for console errors to ensure pure JS execution without exceptions
        page.on("console", lambda msg: print(f"Browser Console [{msg.type}]: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser Error: {err}"))

        # Construct URL to load locally
        current_dir = os.path.dirname(os.path.abspath(__file__))
        index_path = os.path.abspath(os.path.join(current_dir, "..", "code", "index.html"))
        file_url = f"file://{index_path}?condition=ai"

        # Intercept network requests to prevent hang on external resources
        async def handle_route(route):
            url = route.request.url
            if url.startswith("file://") or url.startswith("data:"):
                await route.continue_()
            else:
                await route.abort()

        await page.route("**/*", handle_route)

        print(f"Loading {file_url}")
        await page.goto(file_url, wait_until='domcontentloaded')

        # Navigate through the initial screens to reach the trial grid
        print("Navigating to first trial...")
        # Screen 1: Click consent button
        consent_btn = page.locator("#btn-consent")
        await consent_btn.wait_for(state="visible")
        await consent_btn.click()

        # Screen 2: Click familiarity button (e.g., value "3")
        familiarity_btn = page.locator(".btn-familiarity[data-val='3']")
        await familiarity_btn.wait_for(state="visible")
        await familiarity_btn.click()

        # Wait for the trial grid to be populated
        trial_grid = page.locator("#trial-grid")
        await trial_grid.wait_for(state="visible")

        # Verify Choice Cards
        print("Auditing Choice Card Geometry...")
        cards = page.locator(".bento-choice-card")

        # Wait until exactly 2 cards are in the DOM and visible
        await cards.nth(1).wait_for(state="visible")

        count = await cards.count()
        assert count == 2, f"Expected 2 choice cards, found {count}"

        card_l = cards.nth(0)
        card_r = cards.nth(1)

        box_l = await card_l.bounding_box()
        box_r = await card_r.bounding_box()

        print(f"Card L Box: {box_l}")
        print(f"Card R Box: {box_r}")

        # Assert Visual Equivalence using math.isclose to account for pixel fraction rendering differences
        assert math.isclose(box_l['width'], box_r['width'], abs_tol=1.0), f"Card widths are not equal: {box_l['width']} vs {box_r['width']}"
        assert math.isclose(box_l['height'], box_r['height'], abs_tol=1.0), f"Card heights are not equal: {box_l['height']} vs {box_r['height']}"

        # The Straitjacket Constraint
        print("Checking AI Badge injection...")
        badge = page.locator(".ai-recommendation-badge")
        badge_count = await badge.count()
        assert badge_count == 1, f"Expected exactly 1 AI badge, found {badge_count}"

        # Find which card has the badge
        card_l_has_badge = await card_l.locator(".ai-recommendation-badge").count() > 0

        target_card = card_l if card_l_has_badge else card_r
        control_card = card_r if card_l_has_badge else card_l

        target_box = await target_card.bounding_box()
        control_box = await control_card.bounding_box()

        print(f"Target Card Box (with badge): {target_box}")
        print(f"Control Card Box (without badge): {control_box}")

        assert math.isclose(target_box['width'], control_box['width'], abs_tol=1.0), f"AI Badge altered width: {target_box['width']} vs {control_box['width']}"
        assert math.isclose(target_box['height'], control_box['height'], abs_tol=1.0), f"AI Badge altered height: {target_box['height']} vs {control_box['height']}"

        # Interaction Surface
        print("Simulating User Selection...")
        # Simulate pointerdown since createChoiceCard uses pointerdown instead of click
        await control_card.dispatch_event("pointerdown")

        # Check if the class 'selected' was added
        is_selected = await control_card.evaluate("node => node.classList.contains('selected')")
        assert is_selected, "Card did not receive 'selected' class upon interaction"

        print("Waiting for next trial transition...")
        # Since transition happens after a 200ms timeout
        await page.wait_for_timeout(300)

        # Ensure we advanced to the next trial
        trial_counter = page.locator("#trial-counter")
        counter_text = await trial_counter.inner_text()
        print(f"Current Trial Status: {counter_text}")
        assert "2/6" in counter_text, "Failed to transition to the next trial"

        print("Geometric Audit Passed Successfully!")

        await browser.close()

if __name__ == "__main__":
    try:
        asyncio.run(run())
    except Exception as e:
        print(f"Test failed with exception: {e}")
        sys.exit(1)
