const { launch, getStream } = require("puppeteer-stream");
const fs = require("fs");

var ffmpeg = require('fluent-ffmpeg');

async function test() {
    const browser = await launch({
        defaultViewport: {
            width: 1920,
            height: 1080,
        },
    });

    const page = await browser.newPage();
    await page.goto("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    const stream = await getStream(page, { audio: true, video: true });
    // const stream = fs.createReadStream('input.mp4')

    // const outStream = fs.createWriteStream(__dirname + "/test.mp4");

    ffmpeg()
        .addOptions([
            '-y',
            '-f rawvideo',
            '-vcodec rawvideo',
            // '-pix_fmt bgr24',
            '-s 1920x1080',
            '-i -',
            '-r 24',
            '-c:v libx264',
            '-pix_fmt yuv420p',
            '-preset ultrafast',
            '-f flv',
        ])
        .input(stream)

        
        
        .on('stderr', function(stderrLine) {
            console.log('Stderr output: ' + stderrLine);
        })
        .on('error', function (err) {
            console.log(err);
        })
        .on('end', function () {
            console.log('Processing finished !');
        })
        .output('rtmp://x.rtmp.youtube.com/live2/4wfb-5482-tjxw-u4b1-1t1m').run()
        // .pipe(outStream, { end: true });

}

test()