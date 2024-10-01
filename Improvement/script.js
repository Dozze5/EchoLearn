let mediaRecorder;
  let recordedChunks = [];
  let isRecording = false;

  // Function to toggle recording
  document.querySelector('.mic-button').addEventListener('click', () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  function startRecording() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start();
          console.log('Recording started');
          isRecording = true;

          // Change the mic button style or icon to indicate recording is on
          document.querySelector('.mic-button i').classList.replace('fa-microphone', 'fa-stop');
          
          mediaRecorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
              recordedChunks.push(event.data);
            }
          };

          mediaRecorder.onstop = function () {
            const blob = new Blob(recordedChunks, { type: 'audio/webm' });
            const audioURL = URL.createObjectURL(blob);
            const audio = new Audio(audioURL);

            // Log to the console when the audio starts playing
            audio.addEventListener('play', () => {
              console.log('Audio is playing.');
            });

            // Play the recorded audio when user clicks on the speaker icon
            document.querySelector('.user-icon').addEventListener('click', () => {
              audio.play();
            });
          };
        })
        .catch(function (err) {
          console.error("Error accessing microphone: ", err.message || err);
          alert('Microphone access denied.');
        });
    } else {
      alert('Your browser does not support microphone access.');
    }
  }

  function stopRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      console.log('Recording stopped');
      isRecording = false;

      // Change the mic button style or icon back to microphone
      document.querySelector('.mic-button i').classList.replace('fa-stop', 'fa-microphone');
    }
  }

  // Function to make the robot speak the first paragraph
  document.querySelector('.chatbot-icon').addEventListener('click', () => {
    const firstParagraphText = document.querySelectorAll('.text-box p')[0].innerText;

    // Initialize speech synthesis
    const utterance = new SpeechSynthesisUtterance(firstParagraphText);
    utterance.pitch = 0.5; // Robotic tone
    utterance.rate = 0.8; // Slower speed for a robotic effect
    utterance.voice = speechSynthesis.getVoices().find(voice => voice.name.includes('Google UK English Male')) || null;

    // Speak the text
    speechSynthesis.speak(utterance);

    // Log to the console
    console.log('Robot is speaking');
  });