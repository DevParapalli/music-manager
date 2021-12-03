import multiprocessing

import hypercorn
import trio
import typer
import webview
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from hypercorn.trio import serve

from fs import fs_router

# Dependency for verifying the requests
def check_auth(x_webview_token: str = Header(None)):
    if x_webview_token != webview.token:
        raise HTTPException(status_code=403, detail="Missing Authentication")

app = FastAPI(
    title="PyWebView",
    #dependencies=[Depends(check_auth)],

)
app.include_router(fs_router)
app.mount('/ui', StaticFiles(directory='build'))

origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def run_server():
    config = hypercorn.Config()
    config.bind=["localhost:7200"]
    trio.run(serve, app, config)


def main(dev: bool = False):
    url = "http://localhost:3000" if dev else "https://duckduckgo.com/"
    window = webview.create_window('PyWebView', url, width=1280, height=720, text_select=True)
    webview.start(run_server, debug=dev)

if __name__ == '__main__':
    multiprocessing.freeze_support()
    typer.run(main)
