window.addEventListener("load", async (event) => {
    const errors = document.querySelector('.errors');
    const userElUser = document.getElementById("username");
    const userElPass = document.getElementById("password")
    const userElFirst = document.getElementById("firstName");
    const userElLast = document.getElementById("lastName");
    const userElEmail = document.getElementById("email");
    const userElConfirm = document.getElementById("confirmPassword");

    if (userElUser && (userElUser.className = 'redBox')){
        userElUser.className = '';
    }

    if (userElPass && (userElPass.className = 'redBox')) {
        userElPass.className = '';
    }

    if (userElFirst && (userElFirst.className = 'redBox')) {
        userElFirst.className = '';
    }

    if (userElLast && (userElLast.className = 'redBox')) {
        userElLast.className = '';
    }

    if (userElEmail && (userElEmail.className = 'redBox')) {
        userElEmail.className = '';
    }

    if (userElConfirm && (userElConfirm.className = 'redBox')) {
        userElConfirm.className = '';
    }
    console.log(errors)
    if (errors) {
    errors.childNodes.forEach(error => {
        if (findText(error, 'username')) {
            userElUser.className = 'redBox';
            const usernameErr = document.querySelector(".username-error");
            usernameErr.hidden = false;
            usernameErr.innerText = error.innerText;

        };

        if (findText(error, 'Password')) {
            userElPass.className = 'redBox';
            const passwordErr = document.querySelector('.password-error');
            passwordErr.hidden = false;
            passwordErr.innerText = error.innerText;

        }

        if (findText(error, 'First Name')) {
            userElFirst.className = 'redBox';
            const firstnameErr = document.querySelector('.firstName-error');
            firstnameErr.hidden = false;
            firstnameErr.innerText = error.innerText;

        }

        if (findText(error, 'Last Name')) {
            userElLast.className = 'redBox';
            const lastnameErr = document.querySelector('.lastName-error');
            lastnameErr.hidden = false;
            lastnameErr.innerText = error.innerText;
        }

        if (findText(error, 'Email')) {
            userElEmail.className = 'redBox';
            const emailErr = document.querySelector('.email-error');
            emailErr.hidden = false;
            emailErr.innerText = error.innerText;
        }

        if (findText(error, 'Confirm Password')) {
            userElConfirm.className = 'redBox';
            const confirmErr = document.querySelector('.confirmPassword-error');
            confirmErr.hidden = false;
            confirmErr.innerText = error.innerText;

        }
    })};


});

function findText(error, errorName) {
    return error.innerText.includes(errorName)
}
