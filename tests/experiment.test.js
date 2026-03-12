const { STATE, handleUserSelection } = require('../code/experiment.js');

// Minimal assertion helper
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

async function runTests() {
    console.log("Running handleUserSelection tests...");

    // Mock performance.now
    global.performance = {
        now: () => 1000 // Fixed time
    };

    // Mock Date.now
    const fixedDate = Date.now();
    const originalDateNow = Date.now;
    Date.now = () => fixedDate;

    // Mock setTimeout
    const originalSetTimeout = global.setTimeout;
    global.setTimeout = (fn) => {}; // Do nothing to prevent loadNextTrial

    try {
        // Test Case 1: Standard selection in control condition
        STATE.pid = "test-pid";
        STATE.condition = "control";
        STATE.covariate = 3;
        STATE.currentTrial = 0;
        STATE.results = [];
        STATE.trialStartTime = 500;
        STATE.isTrialActive = true;

        const mockTrial = {
            domain: "Test Domain",
            target: "A"
        };

        handleUserSelection("A", mockTrial);

        assert(STATE.isTrialActive === false, "Trial should be inactive after selection");
        assert(STATE.currentTrial === 1, "currentTrial should increment");
        assert(STATE.results.length === 1, "Results should have one entry");

        const result = STATE.results[0];
        assert(result.participant_id === "test-pid", "Incorrect participant_id");
        assert(result.experimental_condition === "control", "Incorrect condition");
        assert(result.ai_familiarity_covariate === 3, "Incorrect covariate");
        assert(result.trial_sequence === 1, "Incorrect trial_sequence");
        assert(result.ui_domain === "Test Domain", "Incorrect ui_domain");
        assert(result.ai_badge_position === "none", "Incorrect ai_badge_position for control");
        assert(result.user_selection === "Layout A", "Incorrect user_selection");
        assert(result.chose_target_layout === true, "Should have chose_target_layout: true");
        assert(result.reaction_time_ms === 500, `Incorrect reaction_time_ms: expected 500, got ${result.reaction_time_ms}`);
        assert(result.timestamp === fixedDate, "Incorrect timestamp");

        console.log("✅ Test Case 1 Passed");

        // Test Case 2: Selection in AI condition (mismatch)
        STATE.condition = "ai_labeled";
        STATE.currentTrial = 5;
        STATE.trialStartTime = 800;
        STATE.isTrialActive = true;

        const mockTrial2 = {
            domain: "Another Domain",
            target: "B"
        };

        handleUserSelection("A", mockTrial2);

        assert(STATE.results.length === 2, "Results should have two entries");
        const result2 = STATE.results[1];
        assert(result2.trial_sequence === 6, "Incorrect trial_sequence for trial 2");
        assert(result2.ai_badge_position === "Layout B", "Incorrect ai_badge_position for AI condition");
        assert(result2.user_selection === "Layout A", "Incorrect user_selection for trial 2");
        assert(result2.chose_target_layout === false, "Should have chose_target_layout: false");
        assert(result2.reaction_time_ms === 200, "Incorrect reaction_time_ms for trial 2");

        console.log("✅ Test Case 2 Passed");

    } catch (error) {
        console.error("❌ Test Failed:");
        console.error(error.message);
        process.exit(1);
    } finally {
        // Restore mocks
        Date.now = originalDateNow;
        global.setTimeout = originalSetTimeout;
    }

    console.log("\nAll tests passed successfully!");
}

runTests();
