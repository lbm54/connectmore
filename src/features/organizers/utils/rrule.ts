// RRULE utilities for recurring events
export interface RecurrenceOptions {
  pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc.
}

export function createRRule(options: RecurrenceOptions): string {
  const { pattern, interval, endDate, daysOfWeek } = options;
  
  let rrule = `FREQ=${pattern.toUpperCase()}`;
  
  if (interval > 1) {
    rrule += `;INTERVAL=${interval}`;
  }
  
  if (pattern === 'weekly' && daysOfWeek && daysOfWeek.length > 0) {
    const dayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const days = daysOfWeek.map(day => dayMap[day]).join(',');
    rrule += `;BYDAY=${days}`;
  }
  
  if (endDate) {
    // Convert to UTC format for RRULE
    const until = new Date(endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    rrule += `;UNTIL=${until}`;
  }
  
  return rrule;
}

export function parseRRule(rrule: string): RecurrenceOptions | null {
  if (!rrule) return null;
  
  const parts = rrule.split(';');
  const options: Partial<RecurrenceOptions> = {};
  
  for (const part of parts) {
    const [key, value] = part.split('=');
    
    switch (key) {
      case 'FREQ':
        options.pattern = value.toLowerCase() as RecurrenceOptions['pattern'];
        break;
      case 'INTERVAL':
        options.interval = parseInt(value);
        break;
      case 'UNTIL':
        // Convert from RRULE format back to ISO date
        const year = value.slice(0, 4);
        const month = value.slice(4, 6);
        const day = value.slice(6, 8);
        options.endDate = `${year}-${month}-${day}`;
        break;
      case 'BYDAY':
        const dayMap: Record<string, number> = {
          'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6
        };
        options.daysOfWeek = value.split(',').map(day => dayMap[day]).filter(d => d !== undefined);
        break;
    }
  }
  
  return options as RecurrenceOptions;
}

// Generate event instances from RRULE
export function generateInstancesFromRRule(
  baseEvent: {
    startDateTime: string;
    endDateTime?: string;
    rrule: string;
  },
  maxInstances: number = 90 // Generate up to 90 days worth
): Array<{ startDateTime: string; endDateTime?: string }> {
  const instances: Array<{ startDateTime: string; endDateTime?: string }> = [];
  const recurrence = parseRRule(baseEvent.rrule);
  
  if (!recurrence) return instances;
  
  const startDate = new Date(baseEvent.startDateTime);
  const endDate = baseEvent.endDateTime ? new Date(baseEvent.endDateTime) : null;
  const eventDuration = endDate ? endDate.getTime() - startDate.getTime() : 2 * 60 * 60 * 1000; // Default 2 hours
  
  const maxDate = recurrence.endDate ? new Date(recurrence.endDate) : new Date(Date.now() + maxInstances * 24 * 60 * 60 * 1000);
  
  let currentDate = new Date(startDate);
  let count = 0;
  
  while (currentDate <= maxDate && count < maxInstances) {
    // For weekly recurrence, check if current day matches specified days
    if (recurrence.pattern === 'weekly' && recurrence.daysOfWeek) {
      const dayOfWeek = currentDate.getDay();
      if (!recurrence.daysOfWeek.includes(dayOfWeek)) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
    }
    
    const instanceStart = new Date(currentDate);
    const instanceEnd = new Date(instanceStart.getTime() + eventDuration);
    
    instances.push({
      startDateTime: instanceStart.toISOString(),
      endDateTime: instanceEnd.toISOString(),
    });
    
    count++;
    
    // Move to next occurrence
    switch (recurrence.pattern) {
      case 'daily':
        currentDate = new Date(currentDate.getTime() + (recurrence.interval || 1) * 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
          currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        } else {
          currentDate = new Date(currentDate.getTime() + 7 * (recurrence.interval || 1) * 24 * 60 * 60 * 1000);
        }
        break;
      case 'monthly':
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + (recurrence.interval || 1), currentDate.getDate());
        break;
      case 'yearly':
        currentDate = new Date(currentDate.getFullYear() + (recurrence.interval || 1), currentDate.getMonth(), currentDate.getDate());
        break;
    }
  }
  
  return instances;
} 