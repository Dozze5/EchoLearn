let mediaRecorder;
    let recordedChunks = [];

    // Function to handle microphone recording
    document.querySelector('.mic-button').addEventListener('click', () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(function(stream) {
            mediaRecorder = new MediaRecorder(stream);

            // Start recording
            mediaRecorder.start();
            console.log('Recording started');

            mediaRecorder.ondataavailable = function(event) {
              if (event.data.size > 0) {
                recordedChunks.push(event.data);
              }
            };

            mediaRecorder.onstop = function() {
              // Create a blob of the recorded audio
              const blob = new Blob(recordedChunks, { type: 'audio/webm' });
              const audioURL = URL.createObjectURL(blob);
              const audio = new Audio(audioURL);

              // When the user clicks the speaker icon, play the recorded audio
              document.querySelector('.user-icon').addEventListener('click', () => {
                audio.play();
                console.log('Playing recorded voice');
              });

              console.log('Recording stopped');
            };

            // Stop recording after 5 seconds (or customize duration)
            setTimeout(() => {
              mediaRecorder.stop();
            }, 5000);  // 5 seconds
          })
          .catch(function(err) {
            console.error('Microphone access denied: ', err);
          });
      } else {
        alert('Sorry, your browser does not support microphone access.');
      }
    });

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