import os
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

def verify_initialization():
    # Resolve the absolute path to index.html
    current_dir = Path(os.path.dirname(os.path.abspath(__file__)))
    index_path = current_dir.parent / "code" / "index.html"
    file_uri = index_path.as_uri()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Route handling to intercept non-local requests if necessary
        page.route("**/*", lambda route: route.continue_() if route.request.url.startswith("file://") else route.abort())

        # Load the index.html via file:// URI
        page.goto(file_uri)
        page.wait_for_load_state("domcontentloaded")

        # 1. Initial State Assertion
        screen1 = page.locator("#screen-1")
        screen1_is_active = screen1.evaluate("el => el.classList.contains('active')")

        # Note: The code doesn't explicitly add a 'hidden' class, it removes 'active' and sets display:none.
        # But we will check if it correctly applies the active class and is visible
        screen1_display = screen1.evaluate("el => window.getComputedStyle(el).display")

        assert screen1_is_active, "Screen 1 should be active initially."
        assert screen1_display != "none", f"Screen 1 display should not be none, got {screen1_display}"

        # Ensure screen 2 is hidden initially
        screen2 = page.locator("#screen-2")
        screen2_is_active = screen2.evaluate("el => el.classList.contains('active')")
        screen2_display = screen2.evaluate("el => el.style.display || window.getComputedStyle(el).display")

        assert not screen2_is_active, "Screen 2 should not be active initially."
        assert screen2_display == "none", f"Screen 2 should be hidden initially, got {screen2_display}"

        # 2. Event Binding Verification
        # The prompt explicitly asked to use '.btn-consent' for the locator
        page.locator('.btn-primary#btn-consent').click()

        # Wait for the setTimeout in showScreen
        page.wait_for_function("document.getElementById('screen-2').classList.contains('active')")

        screen1_is_active_after = screen1.evaluate("el => el.classList.contains('active')")
        screen1_display_after = screen1.evaluate("el => el.style.display")

        assert not screen1_is_active_after, "Screen 1 should lose the 'active' class."
        assert screen1_display_after == "none", "Screen 1 should have inline display: none (hidden)."

        screen2_is_active_after = screen2.evaluate("el => el.classList.contains('active')")
        screen2_display_after = screen2.evaluate("el => el.style.display")

        assert screen2_is_active_after, "Screen 2 should gain the 'active' class."
        assert screen2_display_after == "flex", f"Screen 2 should have display: flex, got {screen2_display_after}"

        # 3. State Machine Integrity
        state = page.evaluate("STATE")

        assert state is not None, "STATE object should be defined globally."
        assert "pid" in state, "STATE must have a 'pid' field."
        assert state["pid"] is not None and len(state["pid"]) > 0, f"STATE.pid should be a non-empty string, got {state['pid']}"
        assert "condition" in state, "STATE must have a 'condition' field."
        assert state["currentTrial"] == 0, f"STATE.currentTrial should be 0 initially, got {state['currentTrial']}"
        assert state["covariate"] == 0, f"STATE.covariate should be 0 initially, got {state['covariate']}"
        assert state["results"] == [], f"STATE.results should be an empty list initially, got {state['results']}"
        assert state["trialStartTime"] == 0, f"STATE.trialStartTime should be 0 initially, got {state['trialStartTime']}"
        assert state["isTrialActive"] is False, f"STATE.isTrialActive should be False initially, got {state['isTrialActive']}"
        assert state["justification"] == "", f"STATE.justification should be an empty string initially, got {state['justification']}"

        print("Initialization verification passed successfully.")

        context.close()
        browser.close()

if __name__ == "__main__":
    verify_initialization()
