import base64
import os
from pathlib import Path
from fastapi import APIRouter, Request
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from filetype import guess
from mutagen import mp3, mp4

fs_router = APIRouter(
    prefix="/fs",
)


def get_recursive_directory(dir: str, ext: list):
    # https://stackoverflow.com/a/59803793
    subfolders, files = [], []

    for f in os.scandir(dir):
        if f.is_dir():
            subfolders.append(f.path)
        if f.is_file():
            if os.path.splitext(f.name)[1].lower().replace('.', "") in ext:  # NOSONAR
                files.append(f.path)

    for dir in list(subfolders):
        sf, f = get_recursive_directory(dir, ext)
        subfolders.extend(sf)
        files.extend(f)
    return subfolders, files


@fs_router.get("/dir/")
def get_directory_map(dir: str, filetype: list = ["mp3", 'm4a']):
    sf, f = get_recursive_directory(dir, filetype)
    return JSONResponse(
        {
            "content": "fs.directory.list",
            "data": {
                'subfolders': sf,
                'files': f
            }
        }
    )


BYTES_PER_RESPONSE = 1048576 # 1 MiB
CHUNK_SIZE = 1048576 # 1 MiB


def chunk_generator_from_stream(stream, chunk_size, start, size):
    """ Returns chunks of data from a stream."""
    # Keeps track of the current chunk size
    bytes_read = 0
    # Fast forward to where the chunk should start
    stream.seek(start)
    # Read the data
    while bytes_read < size:
        bytes_to_read = min(chunk_size, size - bytes_read)
        yield stream.read(bytes_to_read)
        bytes_read = bytes_read + bytes_to_read
    stream.close()


@fs_router.get("/file")
def get_file_content(req: Request, file: str):
    # Adapted from https://github.com/tiangolo/fastapi/issues/1240#issuecomment-797618168
    file = Path(file)
    # Check if range is specified (aka is a media request)
    asked = req.headers.get("Range")
    try:
        # Yes the browser is requesting a range
        stream, total_size = open(file, 'rb'), file.stat().st_size
        start_byte_requested = int(asked.split("=")[-1][:-1])
        end_byte_planned = min(start_byte_requested + BYTES_PER_RESPONSE, total_size)

        chunk_generator = chunk_generator_from_stream(
            stream,
            chunk_size=CHUNK_SIZE,
            start=start_byte_requested,
            size=BYTES_PER_RESPONSE
        )
        return StreamingResponse(
            chunk_generator,
            headers={
                "Accept-Ranges": "bytes",
                "Content-Range": f"bytes {start_byte_requested}-{end_byte_planned - 1}/{total_size}",
            },
            status_code=206
        )
    except Exception as e:
        return FileResponse(file)


def get_image_key(keys):
    if 'APIC:Cover' in keys:
        return 'APIC:Cover'
    for key in keys:
        if key.startswith('APIC:'):
            return key


@fs_router.get("/file/metadata")
def get_song_metadata(file: str):
    """Returns metadata if supported by mutagen, else throws error."""
    if os.path.splitext(file)[1].lower() == ".mp3":
        audio = mp3.MP3(file)
        image_tag = get_image_key(audio.tags.keys())
        if image_tag:
            album_art = f"data:{audio[image_tag].mime};base64,{base64.b64encode(audio[image_tag].data).decode()}"
        else:
            album_art = f"/defaults/default_song_image.svg"
        # Read the standards for MP3 ID3 Tags and explanation for below.
        return {
            "content": "fs.file.metadata.mp3",
            "data": {
                "album_art": album_art,
                "title": ", ".join(audio["TIT2"].text),
                "album": ", ".join(audio["TALB"].text),
                "artist": ", ".join(audio["TPE1"].text),
                "duration": audio.info.length,
                "bitrate": audio.info.bitrate,
            }
        }
    if os.path.splitext(file)[1].lower() == ".m4a":
        audio = mp4.MP4(file)
        album_art_bytes = bytes(audio['covr'][0])
        mime = guess(album_art_bytes).mime
        return {
            "content": "fs.file.metadata.m4a",
            "data": {
                "album_art": f"data:{mime};base64,{base64.b64encode(album_art_bytes).decode()}",
                "title": ", ".join(audio["\xa9nam"]),
                "album": ", ".join(audio["\xa9alb"]),
                "artist": ", ".join(audio["\xa9ART"]),
                "duration": audio.info.length,
                "bitrate": audio.info.bitrate,
            }
        }
