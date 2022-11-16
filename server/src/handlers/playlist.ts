import { RequestHandler } from "express";
import invariant from "tiny-invariant";
import { z } from "zod";
import { toPromise } from "../lib/observable";
import { parseJsonQuery } from "../lib/schema";
import {
  audioFeatureRangesSchema,
  calculateAudioFeatureRanges,
  filterByAudioFeatureRanges,
} from "../models";
import { SpotifyService } from "../services/spotify";

export const PlaylistsHandler =
  (spotify: SpotifyService): RequestHandler =>
  async (req, res, next) => {
    if (req.session.uid == null) {
      return res.sendStatus(403);
    }
    try {
      const playlists = await toPromise(
        spotify.getPlaylists(spotify.getValidToken(req.session.uid))
      );

      return res.json({
        playlists,
      });
    } catch (err) {
      return next(err);
    }
  };
export const PlaylistDetailHandler =
  (spotify: SpotifyService): RequestHandler =>
  async (req, res, next) => {
    if (req.session.uid == null) {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      invariant(id);
      const playlist = await spotify.getPlaylist(
        spotify.getValidToken(req.session.uid),
        id
      );
      return res.json({ playlist });
    } catch (err) {
      return next(err);
    }
  };

export const PlaylistTracksHandler =
  (spotify: SpotifyService): RequestHandler =>
  async (req, res, next) => {
    if (req.session.uid == null) {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      invariant(id);
      const tracks = await toPromise(
        spotify
          .getTracks(spotify.getValidToken(req.session.uid), id)
          .pipe(
            filterByAudioFeatureRanges(
              parseJsonQuery(
                req.query.audioFeatureRanges,
                audioFeatureRangesSchema.nullish()
              ) ?? {}
            )
          )
      );
      const audioFeatureRanges = calculateAudioFeatureRanges(tracks);
      return res.json({
        tracks,
        audioFeatureRanges,
      });
    } catch (err) {
      return next(err);
    }
  };

export const ExportPlaylistHandler =
  (spotify: SpotifyService): RequestHandler =>
  async (req, res, next) => {
    if (req.session.uid == null) {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      invariant(id);
      const { playlistName, audioFeatureRanges } = z
        .object({
          playlistName: z.string(),
          audioFeatureRanges: audioFeatureRangesSchema,
        })
        .parse(req.body);
      const playlistId = await spotify.exportPlaylist(
        spotify.getValidToken(req.session.uid),
        id,
        playlistName,
        audioFeatureRanges
      );
      return res.json({
        playlistId,
      });
    } catch (err) {
      return next(err);
    }
  };
