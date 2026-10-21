
/* =====================================
   FUNAAB STUDENT REGISTRATION
   Copyright Pal Technologies 2026
   ===================================== */

"use strict";

// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const registrationForm = document.getElementById("registrationForm");

const matricInput = document.getElementById("matric");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const successMessage = document.getElementById("successMessage");
const closeSuccessButton = document.getElementById("closeSuccess");
const registerButton = document.getElementById("registerButton");

const formControls = Array.from(
    registrationForm.querySelectorAll("input, select")
);

// Use our own validation messages instead of browser pop-ups.
registrationForm.noValidate = true;


// =====================================
// 2. DISPLAY VALIDATION ERRORS
// =====================================

function showError(field, message) {
    field.classList.add("invalid");

    field.setAttribute("aria-invalid", "true");

    let errorMessage = document.getElementById(
        field.id + "-error"
    );

    if (!errorMessage) {
        errorMessage = document.createElement("small");

        errorMessage.id = field.id + "-error";
        errorMessage.className = "field-error";

        errorMessage.setAttribute("role", "alert");

        field.insertAdjacentElement(
            "afterend",
            errorMessage
        );
    }

    errorMessage.textContent = message;

    field.setAttribute(
        "aria-describedby",
        errorMessage.id
    );
}


// =====================================
// 3. CLEAR VALIDATION ERRORS
// =====================================

function clearError(field) {
    field.classList.remove("invalid");

    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");

    const errorMessage = document.getElementById(
        field.id + "-error"
    );

    if (errorMessage) {
        errorMessage.remove();
    }
}


function clearAllErrors() {
    formControls.forEach(function (field) {
        clearError(field);
    });
}


// =====================================
// 4. MATRIC NUMBER VALIDATION
// Exactly 8 digits
// =====================================

matricInput.addEventListener("input", function () {
    // Remove letters and special characters.
    // Keep a maximum of 8 digits.
    this.value = this.value
        .replace(/[^0-9]/g, "")
        .slice(0, 8);

    clearError(this);
});


function validateMatric() {
    const matric = matricInput.value;

    if (matric === "") {
        showError(
            matricInput,
            "Matric number is required."
        );

        return false;
    }

    if (!/^[0-9]{8}$/.test(matric)) {
        showError(
            matricInput,
            "Matric number must contain exactly 8 digits."
        );

        return false;
    }

    clearError(matricInput);

    return true;
}


// =====================================
// 5. EMAIL VALIDATION
// Must contain @ and a valid domain format
// =====================================

emailInput.addEventListener("input", function () {
    clearError(this);
});


function validateEmail() {
    const email = emailInput.value.trim();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        showError(
            emailInput,
            "Email address is required."
        );

        return false;
    }

    if (!emailPattern.test(email)) {
        showError(
            emailInput,
            "Enter a valid email address, such as paul@example.com."
        );

        return false;
    }

    clearError(emailInput);

    return true;
}


// =====================================
// 6. PHONE NUMBER VALIDATION
// Exactly 11 numerical digits
// =====================================

phoneInput.addEventListener("input", function () {
    // Remove all non-numeric characters.
    // Prevent the input from exceeding 11 digits.
    this.value = this.value
        .replace(/[^0-9]/g, "")
        .slice(0, 11);

    clearError(this);
});


function validatePhone() {
    const phone = phoneInput.value;

    if (phone === "") {
        showError(
            phoneInput,
            "Phone number is required."
        );

        return false;
    }

    if (!/^[0-9]{11}$/.test(phone)) {
        showError(
            phoneInput,
            "Phone number must contain exactly 11 digits."
        );

        return false;
    }

    clearError(phoneInput);

    return true;
}


// =====================================
// 7. VALIDATE OTHER REQUIRED FIELDS
// =====================================

function validateRequiredField(field) {
    if (field.value.trim() === "") {
        showError(
            field,
            "Please complete this field."
        );

        return false;
    }

    clearError(field);

    return true;
}


// =====================================
// 8. VALIDATE THE ENTIRE FORM
// =====================================

function validateForm() {
    let isValid = true;

    clearAllErrors();

    // Check the name, department, gender and programme.
    formControls.forEach(function (field) {
        if (
            field !== matricInput &&
            field !== emailInput &&
            field !== phoneInput
        ) {
            if (!validateRequiredField(field)) {
                isValid = false;
            }
        }
    });

    // Validate the matric number.
    if (!validateMatric()) {
        isValid = false;
    }

    // Validate the email address.
    if (!validateEmail()) {
        isValid = false;
    }

    // Validate the phone number.
    if (!validatePhone()) {
        isValid = false;
    }

    // Focus and scroll to the first invalid field.
    if (!isValid) {
        const firstInvalidField =
            registrationForm.querySelector(".invalid");

        if (firstInvalidField) {
            firstInvalidField.focus();

            firstInvalidField.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }

    return isValid;
}


// =====================================
// 9. HANDLE REGISTRATION SUBMISSION
// =====================================

registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Stop if any field fails validation.
    if (!validateForm()) {
        return;
    }

    // Prevent repeated clicks while processing.
    registerButton.disabled = true;
    registerButton.textContent = "Processing...";

    // Hide the form and display the success message.
    registrationForm.hidden = true;
    successMessage.hidden = false;

    // Move keyboard focus to the success heading.
    const successHeading =
        successMessage.querySelector("h2");

    successHeading.setAttribute("tabindex", "-1");
    successHeading.focus();

    // Restore the button state.
    registerButton.disabled = false;
    registerButton.textContent = "Register";
});


// =====================================
// 10. CONTINUE AFTER SUCCESS
// =====================================

closeSuccessButton.addEventListener("click", function () {
    // Hide the success message.
    successMessage.hidden = true;

    // Display the registration form again.
    registrationForm.hidden = false;

    // Clear the form fields and validation messages.
    registrationForm.reset();
    clearAllErrors();

    // Return focus to the name field.
    document.getElementById("name").focus();
});


// =====================================
// 11. CLEAR FORM HANDLING
// =====================================

registrationForm.addEventListener("reset", function () {
    // Wait until the browser resets the field values.
    setTimeout(function () {
        clearAllErrors();

        successMessage.hidden = true;
        registrationForm.hidden = false;
    }, 0);
});


// =====================================
// 12. CLEAR DROPDOWN ERRORS
// =====================================

formControls.forEach(function (field) {
    if (field.tagName === "SELECT") {
        field.addEventListener("change", function () {
            clearError(this);
        });
    }
});


// =====================================
// 13. INITIAL STATUS
// =====================================

console.log(
    "FUNAAB Student Registration Page is ready."
);


