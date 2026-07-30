const form =
  document.getElementById('early-access-form') ||
  document.getElementById('founding-supplier-form');
const email = document.getElementById('business-email');
const honeypot = document.getElementById('website');
const status = document.getElementById('form-status');
const submitButton =
  document.getElementById('founding-supplier-submit') ||
  form?.querySelector('button[type="submit"]');
const defaultSubmitLabel = submitButton?.textContent || 'Become a Founding Supplier';

function runtimeConfig() {
  return window.__EAX_RUNTIME_CONFIG__ && typeof window.__EAX_RUNTIME_CONFIG__ === 'object'
    ? window.__EAX_RUNTIME_CONFIG__
    : {};
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function resolveApiUrl() {
  const config = runtimeConfig();
  return (
    clean(config.FOUNDING_SUPPLIER_API_URL) ||
    clean(config.EARLY_ACCESS_API_URL) ||
    clean(form?.getAttribute('data-api-endpoint'))
  );
}

async function readJsonSafely(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

function setStatus(message, tone) {
  if (!status) {
    return;
  }
  status.textContent = message;
  status.dataset.tone = tone || '';
}

function setSubmitting(isSubmitting) {
  if (!submitButton || !email) {
    return;
  }
  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? 'Submitting...' : defaultSubmitLabel;
  email.disabled = isSubmitting;
}

function validateEmail() {
  const value = clean(email?.value).toLowerCase();
  if (email) {
    email.value = value;
  }
  if (!value || !email?.checkValidity()) {
    setStatus('Please enter a valid business email address.', 'error');
    email?.focus();
    return '';
  }
  return value;
}

function buildPayload(emailValue) {
  return {
    email: emailValue,
    listmonkAudience: 'eax-founding-suppliers',
    pageUrl: window.location.href,
    requestType: 'founding-supplier',
    source: 'eax-site',
    website: clean(honeypot?.value),
  };
}

async function submitRequest(payload) {
  const apiUrl = resolveApiUrl();
  if (!apiUrl) {
    throw new Error(
      'This form is not connected yet. Please email matt@eaxmarketplace.com.',
    );
  }

  const response = await fetch(apiUrl, {
    body: JSON.stringify(payload),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  const body = await readJsonSafely(response);
  if (!response.ok) {
    throw new Error(
      clean(body.error) ||
        'We could not submit your request right now. Please email matt@eaxmarketplace.com.',
    );
  }
  return body;
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('', '');

    const emailValue = validateEmail();
    if (!emailValue) {
      return;
    }

    setSubmitting(true);
    setStatus('Submitting your request...', 'info');

    try {
      await submitRequest(buildPayload(emailValue));
      form.reset();
      setStatus('Thank you — we’ll contact you about becoming a founding supplier.', 'success');
    } catch (error) {
      setStatus(
        error instanceof Error && error.message
          ? error.message
          : 'We could not submit your request right now. Please email matt@eaxmarketplace.com.',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  });
}
