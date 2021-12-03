import webview
import typer
import multiprocessing

def main(dev: bool = False):
    url = "http://localhost:3000" if dev else "https://duckduckgo.com/"
    window = webview.create_window('PyWebView', url, width=1280, height=720, text_select=True, confirm_close=True)
    webview.start()

if __name__ == '__main__':
    multiprocessing.freeze_support()
    typer.run(main)