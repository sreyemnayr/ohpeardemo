export function extractEmailDate(emailText: string): Date | null {
    const datePattern = /([A-Z][a-z]{2},\s\d{1,2}\s[A-Z][a-z]{2}\s\d{4})/;
    const matches = emailText.match(datePattern);
  
    if (matches && matches.length > 0) {
      const dateString = matches[0];
      const parsedDate = new Date(dateString);
  
      // Check if the date is valid
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  
    return null;
  }