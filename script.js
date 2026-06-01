// ===== Stopwatch Controller =====
class StopwatchController {
    constructor() {
        // DOM Elements
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.millisecondsDisplay = document.getElementById('milliseconds');
        this.lapsList = document.getElementById('lapsList');

        // Buttons
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');

        // State variables
        this.elapsedTime = 0; // Total elapsed time in milliseconds
        this.isRunning = false;
        this.intervalId = null;
        this.lapTimes = [];
        this.lastLapTime = 0; // For calculating lap differences

        // Initialize
        this.init();
    }

    /**
     * Initialize event listeners
     */
    init() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());

        this.updateDisplay();
        this.updateButtonStates();
    }

    /**
     * Start or resume the timer
     */
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            const startTime = Date.now() - this.elapsedTime;

            this.intervalId = setInterval(() => {
                this.elapsedTime = Date.now() - startTime;
                this.updateDisplay();
            }, 10); // Update every 10ms for smooth display

            this.updateButtonStates();
        }
    }

    /**
     * Pause the timer
     */
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.intervalId);
            this.updateButtonStates();
        }
    }

    /**
     * Reset the timer and clear lap times
     */
    reset() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.elapsedTime = 0;
        this.lapTimes = [];
        this.lastLapTime = 0;

        this.updateDisplay();
        this.renderLapTimes();
        this.updateButtonStates();
    }

    /**
     * Record the current lap time
     */
    recordLap() {
        if (this.elapsedTime > 0) {
            const lapTime = this.elapsedTime - this.lastLapTime;
            this.lapTimes.push({
                totalTime: this.elapsedTime,
                lapTime: lapTime,
                lapNumber: this.lapTimes.length + 1
            });

            this.lastLapTime = this.elapsedTime;
            this.renderLapTimes();
        }
    }

    /**
     * Update the time display (MM:SS:MS)
     */
    updateDisplay() {
        const totalMilliseconds = Math.floor(this.elapsedTime);
        const centiseconds = Math.floor((totalMilliseconds % 1000) / 10);
        const seconds = Math.floor((totalMilliseconds / 1000) % 60);
        const minutes = Math.floor((totalMilliseconds / 60000) % 60);

        this.minutesDisplay.textContent = this.padZero(minutes);
        this.secondsDisplay.textContent = this.padZero(seconds);
        this.millisecondsDisplay.textContent = this.padZero(centiseconds);
    }

    /**
     * Render lap times in the UI
     */
    renderLapTimes() {
        this.lapsList.innerHTML = '';

        if (this.lapTimes.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-state';
            emptyMessage.textContent = 'No laps recorded yet';
            this.lapsList.parentElement.appendChild(emptyMessage);
            return;
        }

        // Remove any existing empty state message
        const emptyState = this.lapsList.parentElement.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        // Render laps in reverse order (newest first)
        this.lapTimes.slice().reverse().forEach((lap) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="lap-number">Lap ${lap.lapNumber}</span>
                <span class="lap-time">${this.formatTime(lap.lapTime)}</span>
            `;
            this.lapsList.appendChild(listItem);
        });
    }

    /**
     * Format time for display (MM:SS:MS)
     */
    formatTime(milliseconds) {
        const centiseconds = Math.floor((milliseconds % 1000) / 10);
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / 60000) % 60);

        return `${this.padZero(minutes)}:${this.padZero(seconds)}:${this.padZero(centiseconds)}`;
    }

    /**
     * Pad single digit numbers with zero
     */
    padZero(num) {
        return num < 10 ? '0' + num : num;
    }

    /**
     * Update button states based on running status
     */
    updateButtonStates() {
        if (this.isRunning) {
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.lapBtn.disabled = false;
            this.resetBtn.disabled = false;
        } else {
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.lapBtn.disabled = true; // FIX: Disable the lap button when paused
            this.resetBtn.disabled = this.elapsedTime === 0;
        }
    }
}

// ===== Initialize Stopwatch on DOM Load =====
document.addEventListener('DOMContentLoaded', () => {
    new StopwatchController();
});
