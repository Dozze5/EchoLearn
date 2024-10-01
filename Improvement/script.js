let mediaRecorder;
let recordedChunks = [];

let isRecording = false;

// Function to handle microphone recording
document.querySelector(".mic-button").addEventListener("click", () => {
  if (!isRecording) {
    recordedChunks = [];
    startRecording();
  } else {
    stopRecording();
  }
});

function startRecording() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        console.log("Recording started");
        isRecording = true;

        // Change the mic button style or icon to indicate recording is on
        document
          .querySelector(".mic-button i")
          .classList.replace("fa-microphone", "fa-stop");

        mediaRecorder.ondataavailable = function (event) {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = function () {
          const blob = new Blob(recordedChunks, { type: "audio/webm" });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);

          // Optionally play the recorded audio
          document.querySelector(".user-icon").addEventListener("click", () => {
            audio.play();
          });
        };
      })
      .catch(function (err) {
        console.error("Error accessing microphone: ", err.message || err);
        alert("Microphone access denied.");
      });
  } else {
    alert("Your browser does not support microphone access.");
  }
}
function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    console.log("Recording stopped");
    isRecording = false;

    // Change the mic button style or icon back to microphone
    document
      .querySelector(".mic-button i")
      .classList.replace("fa-stop", "fa-microphone");
  }
}

    // Function for the robotic voice reading the first paragraph
    document.querySelector('.chatbot-icon').addEventListener('click', () => {
      const firstParaText = document.querySelector('.text-box p').textContent;

      // Initialize the speech synthesis API
      const utterance = new SpeechSynthesisUtterance(firstParaText);
      utterance.pitch = 0.5; // Lower pitch to make it more robotic
      utterance.rate = 0.8;  // Set speech rate
      utterance.volume = 1;   // Set volume
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.name.includes('Google US English') || voice.name.includes('Microsoft Zira'));

      // Speak the first paragraph
      speechSynthesis.speak(utterance);
    });
