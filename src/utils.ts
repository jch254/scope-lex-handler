export const mapPitchClassToKey = (pitchClass: number): string => {
  switch (pitchClass) {
    case 0:
      return 'C';
    case 1:
      return 'C♯/D♭';
    case 2:
      return 'D';
    case 3:
      return 'D♯/E♭';
    case 4:
      return 'E';
    case 5:
      return 'F';
    case 6:
      return 'F♯/G♭';
    case 7:
      return 'G';
    case 8:
      return 'G♯/A♭';
    case 9:
      return 'A';
    case 10:
      return 'A♯/B♭';
    case 11:
      return 'B';
    default:
      return 'UNKNOWN';
  }
};

export const mapMode = (mode: number): string => (mode === 1 ? 'major' : 'minor');
