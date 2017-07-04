import { Callback, Context } from 'aws-lambda';
import * as Lyricist from 'lyricist/node6';
import * as SpotifyWebApi from 'spotify-web-api-node';

import MuzoEvent from './MuzoEvent';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const lyricist = new Lyricist(process.env.GENIUS_ACCESS_TOKEN);

// TODO: Return appropriate typed LexResponse
// TODO: Handle failed states
// TODO: Improve error handing
export async function handler(event: MuzoEvent, context: Context, callback: Callback) {
  console.log('handler');
  console.log(event);

  try {
    let response = {};

    const authData = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(authData.body['access_token']);

    if (event.currentIntent.name === 'GetSuggestions') {
      // TODO: Get track, genre and artist ids via Spotify API after each response from user
      // TODO: Send getRecommendations request to Spotify API using track, genre and artist ids
      // TODO: Refine min_popularity
      const trackData = await spotifyApi.searchTracks(event.currentIntent.slots.track);
      // const recommendations = await spotifyApi.getRecommendations({
      //   seed_tracks: [''],
      //   seed_genres: [''],
      //   seed_artists: [''],
      //   min_popularity: 50,
      // });

      console.log(JSON.stringify(trackData.body));

      response = {
        dialogAction: {
          type: 'Close',
          fulfillmentState: 'Fulfilled',
          message: {
            contentType: 'PlainText',
            content: JSON.stringify(trackData.body),
          },
        },
      };
    }

    if (event.currentIntent.name === 'GetLyricData') {
      const geniusSongs = await lyricist.search(event.currentIntent.slots.lyric);
      const fullGeniusSong = await lyricist.song(geniusSongs[0].id);
      const spotifyMedia = (fullGeniusSong.media || []).find((media: any) => media.provider === 'spotify');

      let audioFeatures = {};

      if (spotifyMedia !== undefined) {
        const spotifyNativeUriParts = spotifyMedia.native_uri.split(':');
        const spotifyTrackId = spotifyNativeUriParts[spotifyNativeUriParts.length - 1];
        
        audioFeatures = await spotifyApi.getAudioFeaturesForTrack(spotifyTrackId);
      }

      console.log(JSON.stringify(geniusSongs));
      console.log(JSON.stringify(fullGeniusSong));
      console.log(JSON.stringify(audioFeatures));

      // TODO: Add data from audioFeatures to responseMessage
      // TODO: Add data from fullGeniusSong to responseMessage
      // - Samples: song_relationships[type === "samples"].songs
      // - Sampled by: song_relationships[type === "sampled_in"].songs
      // - YouTube link: media[provider === "youtube"].url

      const responseMessage = {
        Title: fullGeniusSong.title, // TODO: link to url if possible
        Artist: fullGeniusSong.primary_artist.name, // TODO: link to primary_artist.url if possible
        Album: fullGeniusSong.album !== null ?
          fullGeniusSong.album.name : // TODO: link to album.url if possible
          undefined,
        'Release date': fullGeniusSong.release_date,
        Producers: fullGeniusSong.producer_artists !== null ?
          fullGeniusSong.producer_artists.map((producer: any) => producer.name).join(', ') :
          undefined,
        Writers: fullGeniusSong.writer_artists !== null ?
          fullGeniusSong.writer_artists.map((writer: any) => writer.name).join(', ') :
          undefined, 
      };

      response = {
        dialogAction: {
          type: 'Close',
          fulfillmentState: 'Fulfilled',
          message: {
            contentType: 'PlainText',
            content: JSON.stringify(responseMessage), // TODO: Format data nicely (link to Genius and Spotify)
          },
          responseCard: {
            contentType: 'application/vnd.amazonaws.card.generic',
            version: 1,
            genericAttachments: [{
              title: fullGeniusSong.title_with_featured,
              subTitle: fullGeniusSong.primary_artist.name,
              imageUrl: fullGeniusSong.song_art_image_thumbnail_url,
              attachmentLinkUrl: fullGeniusSong.url,
            }],
          },
        },
      };
    }

    return callback(undefined, response);
  } catch (err) {
    console.log(err);

    return callback(err);
  }
}
