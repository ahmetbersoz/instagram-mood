const getPosts = fetch('https://www.instagram.com/odtukeciler?__a=1')
.then(response => response.json())
.then(data => {
    const posts = data.graphql.user.edge_owner_to_timeline_media.edges;
    const url = posts.shift().node.display_url;

    console.log(url);

    async function getImage() {
        const image = await faceapi.fetchImage(url);
        const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        return detections;
    }

    getImage().then(detections => {
        console.log(detections);
    })

});

Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
	faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(getPosts);
