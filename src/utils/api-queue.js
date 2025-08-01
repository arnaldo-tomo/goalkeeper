class ApiQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        request,
        resolve,
        reject,
        timestamp: Date.now()
      });

      if (!this.processing) {
        this.process();
      }
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      
      try {
        const result = await item.request();
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }

      // Pequeno delay entre requests para evitar spam
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.processing = false;
  }

  clear() {
    this.queue = [];
  }

  getQueueSize() {
    return this.queue.length;
  }
}

export const apiQueue = new ApiQueue();