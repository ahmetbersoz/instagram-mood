const getPosts = fetch('https://www.instagram.com/odtukeciler?__a=1')
.then(response => response.json())
.then(data => {
    const posts = data.graphql.user.edge_owner_to_timeline_media.edges;
    const url = posts.shift().node.display_url;
    let container = document.getElementById('container');

    async function getImage() {
        const image = await faceapi.fetchImage(url);
        const canvas = faceapi.createCanvasFromMedia(image);

        container.append(image);
        container.append(canvas);

        const displaySize = { width: image.width, height: image.height };
        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedResults = faceapi.resizeResults(detections, displaySize)
        faceapi.draw.drawDetections(canvas, resizedResults);
        faceapi.draw.drawFaceLandmarks(canvas, resizedResults);

        const minProbability = 0.05
        faceapi.draw.drawFaceExpressions(canvas, resizedResults, minProbability)        

        return image;
    }

    getImage().then(image => {
    })

});

Promise.all([
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
	faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
	faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(getPosts);
