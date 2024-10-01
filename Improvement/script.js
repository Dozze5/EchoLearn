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

              // Optionally play the recorded audio
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