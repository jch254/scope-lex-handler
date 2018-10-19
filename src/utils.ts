import fetch, { Headers } from 'node-fetch';
import { LexBot } from './LexEvent';
import UserProfile, { defaultUserProfile } from './UserProfile';

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

// TODO: Check with AWS why bot.alias is always null
export async function getUserProfile(userId: string, bot: LexBot): Promise<UserProfile> {
  const isMessengerUser = /^\d+$/.test(userId) && bot.version !== '$LATEST'; // TODO: bot.alias === 'prod'

  if (!isMessengerUser) {
    return defaultUserProfile;
  }

  try {
    const url = `https://graph.facebook.com/v2.8/${userId}?access_token=${process.env.PAGE_ACCESS_TOKEN}`;

    const requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');

    console.log(`Fetching Messenger profile for user ${userId}...`);

    const response = await fetch(url, { method: 'GET', headers: requestHeaders });

    if (response.ok) {
      const profile: UserProfile = await response.json();

      console.log(`Successfully fetched Messenger profile for user ${userId}`);

      return profile;
    }

    console.log(`Error fetching Messenger profile for user ${userId}`);

    return defaultUserProfile;

  } catch (err) {
    console.log(err);
    console.log(`Error fetching Messenger profile for user ${userId}`);

    return defaultUserProfile;
  }
}
