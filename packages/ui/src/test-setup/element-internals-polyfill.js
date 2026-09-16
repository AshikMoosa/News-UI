/**
 * jsdom (our Vitest test environment) implements ElementInternals' ARIA
 * reflection mixin, but not its form-association surface — `setFormValue`,
 * `setValidity`, `form`, `validity`, `validationMessage`, `willValidate`,
 * `checkValidity`, `reportValidity` are all missing. Every real browser has
 * shipped the full API for years; this is purely a jsdom test-environment
 * gap, not something the components themselves should defend against.
 *
 * This shim patches just enough of it so Form-Associated Custom Elements
 * (news-input and future form controls built the same way) can be unit
 * tested under Vitest. It is test-only infrastructure — never imported by
 * component source, only by vitest.config.js's `setupFiles`.
 */
if (
  typeof HTMLElement !== 'undefined' &&
  typeof HTMLElement.prototype.attachInternals === 'function'
) {
  const nativeAttachInternals = HTMLElement.prototype.attachInternals;

  HTMLElement.prototype.attachInternals = function attachInternals(...args) {
    const internals = nativeAttachInternals.apply(this, args);
    if (typeof internals.setFormValue === 'function') {
      return internals; // Already fully supported — nothing to patch.
    }

    const host = this;
    let validityFlags = {};
    let validationMessage = '';

    Object.defineProperties(internals, {
      form: {
        get() {
          return host.closest('form');
        },
      },
      validity: {
        get() {
          const valid = Object.keys(validityFlags).length === 0;
          return { ...validityFlags, valid };
        },
      },
      validationMessage: {
        get() {
          return validationMessage;
        },
      },
      willValidate: {
        get() {
          return !host.disabled;
        },
      },
      setFormValue: {
        value() {
          /* No real <form> submission pipeline in jsdom to feed. */
        },
      },
      setValidity: {
        // `flags` may be a plain object literal (e.g. `{ customError: true }`)
        // or a real `ValidityState`, whose flags are getters on its
        // prototype rather than own-enumerable properties — read each
        // well-known flag by name so both shapes work.
        value(flags = {}, message = '') {
          const VALIDITY_FLAG_KEYS = [
            'valueMissing',
            'typeMismatch',
            'patternMismatch',
            'tooLong',
            'tooShort',
            'rangeUnderflow',
            'rangeOverflow',
            'stepMismatch',
            'badInput',
            'customError',
          ];
          validityFlags = {};
          for (const key of VALIDITY_FLAG_KEYS) {
            if (flags[key]) validityFlags[key] = true;
          }
          validationMessage = Object.keys(validityFlags).length > 0 ? message : '';
        },
      },
      checkValidity: {
        value() {
          return internals.validity.valid;
        },
      },
      reportValidity: {
        value() {
          return internals.validity.valid;
        },
      },
    });

    return internals;
  };
}
