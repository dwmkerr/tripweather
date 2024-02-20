export function calculateAge(eventDate: Date, dateOfBirth: Date): string {
  const dob = new Date(dateOfBirth).getTime();
  const event = new Date(eventDate).getTime();
  const ageInMilliseconds = event - dob;
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // Approximate years

  if (ageInYears < 0) {
    const ageInMonths = Math.abs(ageInYears) * 12;
    const roundedMonths = Math.floor(ageInMonths);
    if (roundedMonths < 12) {
      return `-${roundedMonths} month${roundedMonths !== 1 ? "s" : ""}`;
    } else {
      const roundedYears = Math.floor(roundedMonths / 12);
      return `-${roundedYears} year${roundedYears !== 1 ? "s" : ""}`;
    }
  } else if (ageInYears < 1) {
    const ageInMonths = ageInYears * 12;
    const roundedMonths = Math.floor(ageInMonths);
    return `${roundedMonths} month${roundedMonths !== 1 ? "s" : ""}`;
  } else {
    const roundedYears = Math.floor(ageInYears);
    return `${roundedYears} year${roundedYears !== 1 ? "s" : ""}`;
  }
}
