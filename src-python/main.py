import hypercorn
import webview
import typer
import multiprocessing
import trio
from hypercorn.trio import serve
from fastapi import FastAPI

app = FastAPI()

def run_server():
    config = hypercorn.Config()
    config.bind=["localhost:7200"]
    trio.run(serve, app, config)


def main(dev: bool = False):
    url = "http://localhost:3000" if dev else "https://duckduckgo.com/"
    window = webview.create_window('PyWebView', url, width=1280, height=720, text_select=True, confirm_close=True)
    webview.start(run_server)

if __name__ == '__main__':
    multiprocessing.freeze_support()
    typer.run(main)