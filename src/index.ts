import { Callback, Context } from 'aws-lambda';
import * as Lyricist from 'lyricist/node6';
import * as SpotifyWebApi from 'spotify-web-api-node';

import MuzoEvent from './MuzoEvent';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const lyricist = new Lyricist(process.env.GENIUS_ACCESS_TOKEN);

const mapPitchClassToKey = (pitchClass: number): string => {
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

const mapMode = (mode: number): string => (mode === 1 ? 'major' : 'minor');

// TODO: Handle error/failed states
// TODO: Improve types/remove any types
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
      const fullGeniusSong = await lyricist.song(geniusSongs[0].id, { fetchLyrics: false });

      const spotifyMedia = fullGeniusSong.media.find((media: any) => media.provider === 'spotify');
      const youtubeMedia = fullGeniusSong.media.find((media: any) => media.provider === 'youtube');
      const soundcloudMedia = fullGeniusSong.media.find((media: any) => media.provider === 'soundcloud');
      const samples = fullGeniusSong.song_relationships.find((r: any) => r.type === 'samples').songs;
      
      let audioFeatures;
      if (spotifyMedia !== undefined) {
        const spotifyNativeUriParts = spotifyMedia.native_uri.split(':');
        const spotifyTrackId = spotifyNativeUriParts[spotifyNativeUriParts.length - 1];
        
        const audioFeaturesResponse = await spotifyApi.getAudioFeaturesForTrack(spotifyTrackId);
        audioFeatures = audioFeaturesResponse.body;
      }

      console.log(JSON.stringify(geniusSongs));
      console.log(JSON.stringify(fullGeniusSong));
      console.log(JSON.stringify(audioFeatures));
    
      let responseMessage = `Title: ${fullGeniusSong.title}
Artist: ${fullGeniusSong.primary_artist.name}`;

      if (fullGeniusSong.album !== null) {
        responseMessage += `
Album: ${fullGeniusSong.album.name}`;
      }

      responseMessage += `
Release date: ${fullGeniusSong.release_date}`;

      if (audioFeatures !== undefined) {
        responseMessage += `
BPM: ${audioFeatures.tempo}`;
      }

      if (audioFeatures !== undefined) {
        responseMessage += `
Key: ${mapPitchClassToKey(audioFeatures.key)} ${mapMode(audioFeatures.mode)}`;
      }

      if (samples.length > 0) {
        responseMessage += `

Sample${samples.length === 1 ? '' : 's'}
${samples.map((s: any) => `- ${s.full_title}`).join('\n')}`;
      }

      if (fullGeniusSong.producer_artists.length > 0) {
        responseMessage += `

Producer${fullGeniusSong.producer_artists.length === 1 ? '' : 's'}
${fullGeniusSong.producer_artists.map((p: any) => `- ${p.name}`).join('\n')}`;
      }

      if (fullGeniusSong.writer_artists.length > 0) {
        responseMessage += `

Writer${fullGeniusSong.writer_artists.length === 1 ? '' : 's'}
${fullGeniusSong.writer_artists.map((w: any) => `- ${w.name}`).join('\n')}`;
      }

      const attachments = [];

      if (spotifyMedia !== undefined) {
        attachments.push({
          title: fullGeniusSong.title_with_featured,
          subTitle: fullGeniusSong.primary_artist.name,
          imageUrl: fullGeniusSong.song_art_image_url,
          attachmentLinkUrl: spotifyMedia.url,
        });
      }

      attachments.push({
        title: fullGeniusSong.title_with_featured,
        subTitle: fullGeniusSong.primary_artist.name,
        imageUrl: fullGeniusSong.song_art_image_url,
        attachmentLinkUrl: fullGeniusSong.url,
      });

      if (youtubeMedia !== undefined) {
        attachments.push({
          title: fullGeniusSong.title_with_featured,
          subTitle: fullGeniusSong.primary_artist.name,
          imageUrl: fullGeniusSong.song_art_image_url,
          attachmentLinkUrl: youtubeMedia.url,
        });
      }

      if (soundcloudMedia !== undefined) {
        attachments.push({
          title: fullGeniusSong.title_with_featured,
          subTitle: fullGeniusSong.primary_artist.name,
          imageUrl: fullGeniusSong.song_art_image_url,
          attachmentLinkUrl: soundcloudMedia.url,
        });
      }

      response = {
        dialogAction: {
          type: 'Close',
          fulfillmentState: 'Fulfilled',
          message: {
            contentType: 'PlainText',
            content: responseMessage,
          },
          responseCard: {
            contentType: 'application/vnd.amazonaws.card.generic',
            version: 1,
            genericAttachments: attachments,
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
