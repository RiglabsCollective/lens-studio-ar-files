export class Event<T = unknown> {
    private listeners: Array<(data: T) => void> = [];
    private onceListeners: Array<(data: T) => void> = [];
    private enabled: boolean = true;

    /**
     * Adds a listener function to the list of listeners for this event.
     * @param listener The listener function that processes the event.
     */
    add(listener: (data: T) => void): void {
        this.listeners.push(listener);
    }

    /**
     * Adds a listener function that will be removed after its first invocation.
     * @param listener The listener function to invoke only once.
     */
    addOnce(listener: (data: T) => void): void {
        this.onceListeners.push(listener);
    }

    /**
     * Removes a specific listener from the list of listeners for this event.
     * @param listener The listener function to remove.
     */
    remove(listener: (data: T) => void): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        } else {
            const onceIndex = this.onceListeners.indexOf(listener);
            if (onceIndex > -1) {
                this.onceListeners.splice(onceIndex, 1);
            }
        }
    }

    /**
     * Removes all listeners and once listeners for this event.
     */
    clear(): void {
        this.listeners = [];
        this.onceListeners = [];
    }

    /**
     * Triggers the event, calling all registered listeners in the order they were added.
     * Errors in listeners do not prevent subsequent listeners from being called.
     * @param data The data to pass to each listener function.
     */
    trigger(data?: T): void {
        if (!this.enabled) return;

        [...this.listeners].forEach(listener => {
            try {
                listener(data);
            } catch (error) {
                print('Event listener error at listener ' + listener + '\n' + error + '.\nPassed data: ' + JSON.stringify(data) + '.');
            }
        });

        this.onceListeners.forEach(listener => {
            try {
                listener(data);
            } catch (error) {
                print('Event listener error at listener ' + listener + ':  ' + error + '.\nPassed data: ' + JSON.stringify(data) + '.');
            }
        });
        this.onceListeners = []; // Clear once listeners after being called
    }

    /**
     * Disables triggering of the event.
     */
    disable(): void {
        this.enabled = false;
    }

    /**
     * Enables triggering of the event.
     */
    enable(): void {
        this.enabled = true;
    }

    /**
     * Returns the number of attached listeners.
     */
    listenerCount(): number {
        return this.listeners.length + this.onceListeners.length;
    }
}
