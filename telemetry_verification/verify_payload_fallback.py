import asyncio
from playwright.async_api import async_playwright
import subprocess
import time
import sys
import json

async def run_test():
    server = subprocess.Popen(["python3", "-m", "http.server", "8000"])
    # Wait for the server to start
    time.sleep(2)

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context()
            page = await context.new_page()

            console_messages = []

            # Listen to console events
            page.on("console", lambda msg: console_messages.append(msg.text))

            print("Navigating to the experiment...")
            await page.goto("http://localhost:8000/code/index.html?condition=control")

            print("Starting the trials...")
            # Screen 1 -> 2
            await page.click("#btn-consent")

            # Screen 2 -> trial
            await page.click(".btn-familiarity[data-val='2']")

            print("Completing trials...")
            # 6 Trials
            for i in range(6):
                await asyncio.sleep(0.5) # Wait for debounce and DOM updates
                # Click the first card
                await page.click(".bento-choice-card:first-child")

            print("Providing justification...")
            # Screen 9 (Justification)
            await page.fill("#semantic-justification", "This is a valid semantic justification.")

            print("Simulating offline environment...")
            # Set context to offline before clicking finalize to simulate network error for Firebase
            await context.set_offline(True)

            print("Finalizing...")
            # Click Finalize -> Screen 10 (executeBatchPayload)
            await page.click("#btn-finalize")

            await asyncio.sleep(1) # wait for the failure catch block to execute

            print("Verifying text content...")
            # Check DOM update
            sync_status_text = await page.inner_text("#sync-status")
            assert "Diagnostic Complete. A network timeout occurred. You may safely close this tab." in sync_status_text, "Status text does not match expected deception message."

            print("Verifying localStorage backup...")
            # Check localStorage
            local_storage = await page.evaluate("() => Object.entries(localStorage)")

            backup_key = None
            backup_value = None
            for key, val in local_storage:
                if key.startswith("telemetry_backup_"):
                    backup_key = key
                    backup_value = val
                    break

            assert backup_key is not None, "Backup key not found in localStorage"

            # Verify backup content
            data = json.loads(backup_value)
            assert len(data) == 6, f"Expected 6 rows in Tidy Data schema, got {len(data)}"
            assert "semantic_justification" in data[0], "Semantic justification not appended."
            assert data[0]["semantic_justification"] == "This is a valid semantic justification.", "Semantic justification incorrect."

            print("Verifying console silence...")
            # Verify console
            # Ignore the 404 for firebase-config.js as it's missing from repo
            # We are verifying that experiment.js doesn't log errors
            errors_or_warnings = [msg for msg in console_messages if ("error" in msg.lower() or "warn" in msg.lower()) and "404" not in msg]
            assert len(errors_or_warnings) == 0, f"Found console errors/warnings: {errors_or_warnings}"

            print("All assertions passed. Fallback logic verified successfully.")

    except Exception as e:
        print(f"Test Failed: {e}")
        sys.exit(1)
    finally:
        server.terminate()

if __name__ == "__main__":
    asyncio.run(run_test())
