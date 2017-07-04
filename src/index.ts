import { Callback, Context } from 'aws-lambda';
import * as Lyricist from 'lyricist/node6';
import * as SpotifyWebApi from 'spotify-web-api-node';

// TODO: Type handler event parameter as LexInputEvent
// TODO: Send request to Spotify API based on event params using spotify-web-api-node
// TODO: Return appropriate LexResponse
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const lyricist = new Lyricist(process.env.GENIUS_ACCESS_TOKEN);

export async function handler(event: any, context: Context, callback: Callback) {
  console.log('handler');

  try {
    const authData = await spotifyApi.clientCredentialsGrant();
    
    spotifyApi.setAccessToken(authData.body['access_token']);
    
    const trackData = await spotifyApi.searchTracks('artist:Kanye West');

    console.log(JSON.stringify(trackData.body));

    const song = await lyricist.search('No good blood sucker');

    console.log(song);

    return callback();
  } catch (err) {
    console.log(err);

    return callback(err);
  }
}
