import { Fragment } from "react";
import { Track } from "../../../api/types";
import * as classes from "./TrackItem.css";

type TrackItemProps = {
  track: Track;
};

export default function TrackItem({ track }: TrackItemProps) {
  const thumbnailUrl = track.album.images[0]?.url;

  return (
    <div className={classes.container}>
      <img className={classes.thumbnail} src={thumbnailUrl} />
      <div className={classes.nameAndArtists}>
        <h5>
          <a className={classes.link} href={track.externalUrls.spotify}>
            {track.name}
          </a>
        </h5>
        <div>
          {track.artists.map((artist, index) => (
            <Fragment key={artist.id}>
              {!!index && ", "}
              <a className={classes.link} href={artist.externalUrls.spotify}>
                {artist.name}
              </a>
            </Fragment>
          ))}
        </div>
      </div>
      <a className={classes.albumName} href={track.album.externalUrls.spotify}>
        {track.album.name}
      </a>
    </div>
  );
}
