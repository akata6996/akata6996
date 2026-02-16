const form = document.getElementById('appointment-form');
const year = document.getElementById('year');
const modal = document.getElementById('appointment-modal');
const modalPanel = modal?.querySelector('.modal-panel');
const openButtons = document.querySelectorAll('[data-open-appointment]');
const closeButtons = document.querySelectorAll('[data-close-appointment]');

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

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => {
    modalPanel?.focus();
  }, 0);
};

const closeModal = () => {
  if (!modal) {
    return;
  }

  modal.classList.add('hidden');
  document.body.style.overflow = '';
};

openButtons.forEach((button) => {
  button.addEventListener('click', openModal);
});

closeButtons.forEach((button) => {
  button.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const referenceFile = formData.get('referenceFile');
  const referenceFileName = referenceFile instanceof File ? referenceFile.name : '';

  const details = {
    name: formData.get('name')?.toString().trim() || '',
    email: formData.get('email')?.toString().trim() || '',
    phone: formData.get('phone')?.toString().trim() || '',
    service: formData.get('service')?.toString().trim() || '',
    description: formData.get('description')?.toString().trim() || '',
    referenceFileName,
  };

  const subject = encodeURIComponent(`Appointment Request - ${details.service || 'General Inquiry'}`);
  const body = encodeURIComponent(
    [
      `Name: ${details.name}`,
      `Email: ${details.email}`,
      `Phone: ${details.phone}`,
      `Service Needed: ${details.service}`,
      `Reference File: ${details.referenceFileName || 'No file selected'}`,
      '',
      'Project Description:',
      details.description,
    ].join('\n')
  );

  window.location.href = `mailto:mardamsignads@gmail.com?subject=${subject}&body=${body}`;
  closeModal();
});
