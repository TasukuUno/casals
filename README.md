# Casals

![icon_256x256](https://user-images.githubusercontent.com/4372047/43401735-e59e3e14-944b-11e8-9cab-55b4d35a1028.png)

<img src="https://user-images.githubusercontent.com/4372047/43401598-8ae2c81e-944b-11e8-970b-50fc7ef8edb6.png" width="300">

Local music player for practicing instruments built on Electron.

- play tracks by `<audio>` element
  - set playback range
  - set playback rate (speed down/up without change pitch)
- show any files or web pages in `<webview>`

## build installer

```
yarn run release
```

## setup

### prepare json file like this

```json
[
  {
    "name": "trackA",
    "view": "./trackA.png",
    "audio": "./trackA.mp4"
  },
  {
    "name": "trackB",
    "view": "./trackB.png",
    "audio": "./trackB.mp3"
  },
  {
    "name": "trackC",
    "view": "https://example.com/something/of/trackC",
    "audio": "./trackC.mp4"
  }
]
```

### load the file

Press ![btn](https://user-images.githubusercontent.com/4372047/43402353-85493b02-944d-11e8-811a-ee1e17b794be.png) button and load the  JSON file. Once you load it, the app save path to files.

