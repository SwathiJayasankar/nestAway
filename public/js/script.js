// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Interactive star rating for review form
document.querySelectorAll('.star-rating-input').forEach((container) => {
  const input = container.querySelector('input[type="hidden"]')
  const stars = container.querySelectorAll('.star-btn')

  const setRating = (value) => {
    input.value = value
    stars.forEach((star, index) => {
      const icon = star.querySelector('i')
      const filled = index < value
      icon.classList.toggle('fa-solid', filled)
      icon.classList.toggle('fa-regular', !filled)
    })
  }

  stars.forEach((star) => {
    star.addEventListener('click', () => setRating(Number(star.dataset.value)))
    star.addEventListener('mouseenter', () => setRating(Number(star.dataset.value)))
  })

  container.querySelector('.stars').addEventListener('mouseleave', () => {
    setRating(Number(input.value))
  })

  setRating(Number(input.value) || 5)
})