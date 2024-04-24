// JavaScript Document

(() => {
  'use strict'

  // fetch all forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
		// fetch input password from create account
      const passwordInput = form.querySelector('#inputPassword4'); 
		// fetch the feedback for the user password
      const passwordFeedback = form.querySelector('#inputPassword4 + .invalid-feedback');
      const MIN_LENGTH_PASS = 6; // Minimum password length

      if (passwordInput && passwordInput.value.length < MIN_LENGTH_PASS) {
        // update the feedback message for password length
        passwordFeedback.textContent = `Password must be at least 6 characters long.`;
        passwordInput.setCustomValidity('INVALID');

      } else {
		  // once successfull set the validity to none and reset default
        passwordInput.setCustomValidity('');
      }


      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');

    }, false);
  });
})();
