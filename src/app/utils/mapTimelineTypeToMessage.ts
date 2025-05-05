export const mapTimelineTypeToMessage = (type: string, plural: boolean = false) => {
const str = type.toLocaleLowerCase();
  switch (str) {
    case 'daily':
      return plural ? 'Days' : 'Day';
    case 'week':
      return plural ? 'Weeks' : 'Week';
    case 'monthly':
      return plural ? 'Months' : 'Month';
    case 'yearly':
      return plural ? 'Years' : 'Year';
  }
};

