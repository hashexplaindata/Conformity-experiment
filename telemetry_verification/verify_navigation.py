import asyncio
from playwright.async_api import async_playwright
import time
import subprocess
import os
import signal

async def main():
    # Start the local server
    server_process = subprocess.Popen(['python3', '-m', 'http.server', '8000'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Wait a bit for the server to start
    await asyncio.sleep(1)

    try:
        async with async_playwright() as p:
            # Setup browser
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context()
            page = await context.new_page()

            # Intercept and abort external requests to prevent hanging
            await page.route("**/*", lambda route: route.abort() if route.request.url.startswith("http") and not route.request.url.startswith("http://localhost") else route.continue_())

            # Navigate to the experiment
            print("Navigating to the experiment...")
            await page.goto("http://localhost:8000/code/index.html?condition=control", wait_until="commit")

            # Wait for the initial screen to be ready
            await page.wait_for_selector('#screen-1', state="attached")

            print("Testing initial state...")
            # 1. Visibility Assertion: Screen 1 should be visible, others hidden
            screen1 = page.locator('#screen-1')
            screen2 = page.locator('#screen-2')

            # Check classes
            screen1_classes = await screen1.get_attribute('class')
            assert 'active' in screen1_classes, "Screen 1 should have 'active' class initially"

            # Check actual visibility
            assert await screen1.is_visible(), "Screen 1 should be visible initially"
            assert not await screen2.is_visible(), "Screen 2 should be hidden initially"

            print("Testing transition to Screen 2...")
            # 2. Transition Assertion: Click consent button
            await page.click('#btn-consent')

            # Wait for the setTimeout in showScreen to complete (50ms)
            await asyncio.sleep(0.1)

            # 3. State Verification: Screen 1 hidden, Screen 2 visible
            # Check classes
            screen1_classes = await screen1.get_attribute('class')
            screen2_classes = await screen2.get_attribute('class')

            assert 'active' not in screen1_classes, "Screen 1 should NOT have 'active' class after transition"
            assert 'active' in screen2_classes, "Screen 2 should have 'active' class after transition"

            # Check actual visibility
            assert not await screen1.is_visible(), "Screen 1 should be hidden after transition"
            assert await screen2.is_visible(), "Screen 2 should be visible after transition"

            print("Testing programmatic transition to Screen 'trial'...")
            # 4. Trigger a programmatic transition to 'trial'
            await page.evaluate("showScreen('trial')")

            # Wait for the setTimeout in showScreen to complete
            await asyncio.sleep(0.1)

            screen_trial = page.locator('#screen-trial')

            # Check classes
            screen2_classes = await screen2.get_attribute('class')
            screen_trial_classes = await screen_trial.get_attribute('class')

            assert 'active' not in screen2_classes, "Screen 2 should NOT have 'active' class after transition to trial"
            assert 'active' in screen_trial_classes, "Screen trial should have 'active' class after transition"

            # Check actual visibility
            assert not await screen2.is_visible(), "Screen 2 should be hidden after transition to trial"
            assert await screen_trial.is_visible(), "Screen trial should be visible after transition to trial"

            print("✅ All navigation and visibility assertions passed successfully.")

            await browser.close()

    finally:
        # Clean up the server process
        server_process.terminate()
        server_process.wait()

if __name__ == "__main__":
    asyncio.run(main())
