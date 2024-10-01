let mediaRecorder;
let recordedChunks = [];

let isRecording = false;
let audio;

// Function to handle microphone recording
document.querySelector(".mic-button").addEventListener("click", () => {
  if (!isRecording) {
    recordedChunks = [];
    startRecording();
  } else {
    stopRecording();
  }
});
let STScoreAPIKey = "rll5QsTiv83nti99BW6uCmvs9BDVxSB39SVFceYb"; // Public Key. If, for some reason, you would like a private one, send-me a message and we can discuss some possibilities
let apiMainPathSample = ""; // 'http://127.0.0.1:3001';// 'https://a3hj0l2j2m.execute-api.eu-central-1.amazonaws.com/Prod';
let apiMainPathSTS = ""; // 'https://wrg7ayuv7i.execute-api.eu-central-1.amazonaws.com/Prod';

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
          audio = new Audio(audioURL);

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
document.querySelector(".chatbot-icon").addEventListener("click", () => {
  // const firstParaText = document.querySelector(".text-box p").textContent;
  const firstParaText = document.getElementById("original_script").textContent;

  // Initialize the speech synthesis API
  const utterance = new SpeechSynthesisUtterance(firstParaText);
  utterance.pitch = 0.5; // Lower pitch to make it more robotic
  utterance.rate = 0.8; // Set speech rate
  utterance.volume = 1; // Set volume
  utterance.voice = speechSynthesis
    .getVoices()
    .find(
      (voice) =>
        voice.name.includes("Google US English") ||
        voice.name.includes("Microsoft Zira")
    );

  // Speak the first paragraph
  speechSynthesis.speak(utterance);
});

const page_title = "AI Pronunciation Trainer";
const accuracy_colors = ["green", "orange", "red"];
let badScoreThreshold = 30;
let mediumScoreThreshold = 70;
let currentSample = 0;
let currentScore = 0;
let sample_difficult = 0;
let scoreMultiplier = 1;
let playAnswerSounds = true;
let isNativeSelectedForPlayback = true;
let serverIsInitialized = false;
let serverWorking = true;
let languageFound = true;
let currentSoundRecorded = false;
let currentText, currentIpa, real_transcripts_ipa, matched_transcripts_ipa;
let wordCategories;
let startTime, endTime;
let AILanguage = "en"; // Standard is German

const getNextSample = async () => {
  // if (!serverIsInitialized) await initializeServer();

  // if (document.getElementById("lengthCat1").checked) {
  //   sample_difficult = 0;
  //   scoreMultiplier = 1.3;
  // } else if (document.getElementById("lengthCat2").checked) {
  //   sample_difficult = 1;
  //   scoreMultiplier = 1;
  // } else if (document.getElementById("lengthCat3").checked) {
  //   sample_difficult = 2;
  //   scoreMultiplier = 1.3;
  // } else if (document.getElementById("lengthCat4").checked) {
  //   sample_difficult = 3;
  //   scoreMultiplier = 1.6;
  // }
  sample_difficult = 0;
  scoreMultiplier = 1.3;

  try {
    await fetch(apiMainPathSample + "/getSample", {
      method: "post",
      body: JSON.stringify({
        category: sample_difficult.toString(),
        language: AILanguage,
      }),
      headers: { "X-Api-Key": STScoreAPIKey },
    })
      .then((res) => res.json())
      .then((data) => {
        let doc = document.getElementById("original_script");
        currentText = data.real_transcript;
        console.log("Current Text: ", currentText);
        doc.innerHTML = currentText; //innerHTML = data.real_transcript;

        currentIpa = data.ipa_transcript;
        console.log("Current IPA: ", currentIpa);

        let doc_ipa = document.getElementById("ipa_script");
        doc_ipa.innerHTML = "/ " + currentIpa + " /";

        // document.getElementById("recorded_ipa_script").innerHTML = "";
        // document.getElementById("pronunciation_accuracy").innerHTML = "";
        // document.getElementById("single_word_ipa_pair").innerHTML =
        //   "Reference | Spoken";
        // document.getElementById("section_accuracy").innerHTML =
        //   "| Score: " +
        //   currentScore.toString() +
        //   " - (" +
        //   currentSample.toString() +
        //   ")";
        currentSample += 1;

        // document.getElementById("main_title").innerHTML = page_title;

        document.getElementById("translated_script").innerHTML =
          data.transcript_translation;

        currentSoundRecorded = false;
        // unblockUI();
        // document.getElementById("playRecordedAudio").classList.add("disabled");
      });
  } catch {
    console.log("Error getting sample");
  }
};

const next = document.getElementById("generate_sample");
next.addEventListener("click", () => {
  getNextSample();
});
