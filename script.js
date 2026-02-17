const form = document.getElementById('appointment-form');
const year = document.getElementById('year');
const modal = document.getElementById('appointment-modal');
const modalPanel = modal?.querySelector('.modal-panel');
const openButtons = document.querySelectorAll('[data-open-appointment]');
const closeButtons = document.querySelectorAll('[data-close-appointment]');
const formStatus = document.getElementById('form-status');
const referenceFileInput = document.getElementById('reference-file');
const removeAttachmentButton = document.getElementById('remove-attachment');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (window.AOS) {
  window.AOS.init({
    duration: 800,
    once: true,
    offset: 50,
  });
}

const openModal = () => {
  if (!modal) {
    return;
  }

  modal.showModal();
  window.setTimeout(() => {
    modalPanel?.focus();
  }, 0);
};

const closeModal = () => {
  if (!modal) {
    return;
  }

  modal.close();
};

const setFormStatus = (message, type) => {
  if (!formStatus) {
    return;
  }

  const typeClasses = {
    success: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-200',
    error: 'border-red-300/40 bg-red-300/10 text-red-200',
    pending: 'border-cyan-300/40 bg-cyan-300/10 text-cyan-200',
  };

  formStatus.className = `mt-4 rounded-lg border px-3 py-2 text-sm ${typeClasses[type] || typeClasses.pending}`;
  formStatus.textContent = message;
};


const updateRemoveAttachmentButton = () => {
  if (!removeAttachmentButton || !referenceFileInput) {
    return;
  }

  removeAttachmentButton.disabled = referenceFileInput.files.length === 0;
};

referenceFileInput?.addEventListener('change', updateRemoveAttachmentButton);

removeAttachmentButton?.addEventListener('click', () => {
  if (!referenceFileInput) {
    return;
  }

  referenceFileInput.value = '';
  updateRemoveAttachmentButton();
  referenceFileInput.focus();
});

updateRemoveAttachmentButton();

openButtons.forEach((button) => {
  button.addEventListener('click', openModal);
});

closeButtons.forEach((button) => {
  button.addEventListener('click', closeModal);
});

modal?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeModal();
});

modal?.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  formData.append('_subject', 'New Appointment Request - Mardam Sign Ads Website');
  formData.append('_captcha', 'false');
  formData.append('_template', 'table');

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.classList.add('opacity-70', 'cursor-not-allowed');
  }

  setFormStatus('Sending your appointment request...', 'pending');

  try {
    const response = await fetch('https://formsubmit.co/ajax/mardamsignads@gmail.com', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Unable to submit appointment request right now.');
    }

    setFormStatus('Appointment request sent successfully. We will contact you soon.', 'success');
    form.reset();
    updateRemoveAttachmentButton();

    window.setTimeout(() => {
      closeModal();
      if (formStatus) {
        formStatus.classList.add('hidden');
      }
    }, 1800);
  } catch (error) {
    setFormStatus('We could not send your request at the moment. Please try again shortly.', 'error');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.classList.remove('opacity-70', 'cursor-not-allowed');
    }
  }
});
