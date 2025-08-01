export const performance = {
  // Medir tempo de execução
  timeStart: (label) => {
    console.time(label);
  },
  
  timeEnd: (label) => {
    console.timeEnd(label);
  },
  
  // Log de memória (apenas em desenvolvimento)
  logMemory: () => {
    if (__DEV__ && console.memory) {
      console.log('Memory usage:', {
        used: Math.round(console.memory.usedJSHeapSize / 1048576) + 'MB',
        total: Math.round(console.memory.totalJSHeapSize / 1048576) + 'MB',
        limit: Math.round(console.memory.jsHeapSizeLimit / 1048576) + 'MB'
      });
    }
  },
  
  // Debounce para evitar chamadas excessivas
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle para limitar frequência
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};