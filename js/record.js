const recording = document.getElementById("recording");
const video = document.getElementById("video");
const videoC = document.getElementById("video-c");
const grabar = document.getElementById("grabar");
const detener = document.getElementById("detener");
const guardar = document.getElementById("guardar");
const cancelar = document.getElementById("cancelar");
const guardarPanel = document.getElementById("save-panel");
let mediaStream;
let recordedBlob;
let getData = () => Promise();

(async () => {
  mediaStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  video.muted = true;
  video.srcObject = mediaStream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoC.classList.remove("d-none");
  });
})();

detener.addEventListener("click", async () => {
  let data = await getData();
  recordedBlob = new Blob(data, { type: "video/webm" });

  recording.src = URL.createObjectURL(recordedBlob);

  guardar.href = recording.src;
  guardar.download = `${new Date().toISOString()}.webm`;
});

guardar.addEventListener("click", () => {
  guardarPanel.classList.add("d-none");
  grabar.classList.remove("d-none");
});

grabar.addEventListener("click", async () => {
  getData = startRecording(mediaStream);
});

function startRecording(stream) {
  let recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  let data = [];

  recorder.ondataavailable = (e) => data.push(e.data);
  recorder.start();

  let stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = reject;
  });

  async function getData() {
    if (recorder.state == "recording") {
      recorder.stop();
    }
    await stopped;
    return data;
  }

  return getData;
}

function stopRecording(stream) {
  stream.getTracks().forEach((track) => track.stop());
}

// esconder botones
grabar.addEventListener("click", () => {
  grabar.classList.add("d-none");
  detener.classList.remove("d-none");
});

detener.addEventListener("click", () => {
  detener.classList.add("d-none");
  guardarPanel.classList.remove("d-none");
});

cancelar.addEventListener("click", () => {
  guardarPanel.classList.add("d-none");
});
