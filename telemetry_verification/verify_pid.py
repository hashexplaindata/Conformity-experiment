from playwright.sync_api import sync_playwright
import time
import subprocess
import os
import re

def run_verification():
    # Start the server
    port = 8081
    server_process = subprocess.Popen(["python3", "-m", "http.server", str(port)])
    time.sleep(5) # Wait for server to start

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            # Listen for console messages
            page.on("console", lambda msg: print(f"PAGE CONSOLE: {msg.text}"))

            # Navigate to the experiment
            print(f"Navigating to http://localhost:{port}/code/index.html")
            page.goto(f"http://localhost:{port}/code/index.html")

            # 1. Capture initial PID
            print("Waiting for STATE.pid...")
            # Instead of wait_for_function which seems to hang if there are load issues,
            # let's try a retry loop in evaluate
            pid = None
            for _ in range(30):
                try:
                    pid = page.evaluate("typeof STATE !== 'undefined' ? STATE.pid : null")
                    if pid:
                        break
                except:
                    pass
                time.sleep(1)

            print(f"Initial PID: {pid}")
            if not pid:
                # Fallback: check if script is even there
                scripts = page.evaluate("Array.from(document.scripts).map(s => s.src)")
                print(f"Loaded scripts: {scripts}")
                raise Exception("PID not found in STATE after timeout")

            # 2. Click Consent
            page.wait_for_selector("#btn-consent")
            page.click("#btn-consent")
            print("Clicked consent")

            # 3. Select Familiarity
            page.wait_for_selector(".btn-familiarity")
            page.click(".btn-familiarity")
            print("Selected familiarity")

            # 4. Complete 6 trials
            for i in range(6):
                print(f"Trial {i+1}")
                page.wait_for_selector(".bento-choice-card")
                page.click(".bento-choice-card")
                time.sleep(0.5) # Transition time

            # 5. Justification
            page.wait_for_selector("#semantic-justification")
            page.fill("#semantic-justification", "This is a security verification test justification.")
            print("Filled justification")

            # 6. Finalize
            page.wait_for_function("!document.getElementById('btn-finalize').disabled")
            page.click("#btn-finalize")
            print("Clicked finalize")

            # 7. Final Screen
            page.wait_for_selector("#display-pid", timeout=10000)
            displayed_pid = page.inner_text("#display-pid")
            print(f"Displayed PID: {displayed_pid}")

            if pid != displayed_pid:
                raise Exception(f"PID mismatch! Initial: {pid}, Displayed: {displayed_pid}")

            # Check UUID format
            uuid_regex = r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
            if not re.match(uuid_regex, pid, re.IGNORECASE):
                raise Exception(f"PID {pid} is not a valid UUID v4")
            print("Verified PID is a valid UUID v4")

            # Take a screenshot
            screenshot_dir = os.path.join(os.path.dirname(__file__), "screenshots")
            os.makedirs(screenshot_dir, exist_ok=True)
            page.screenshot(path=os.path.join(screenshot_dir, "verification.png"))
            print("Verification successful, screenshot saved.")

    finally:
        server_process.terminate()

if __name__ == "__main__":
    run_verification()
