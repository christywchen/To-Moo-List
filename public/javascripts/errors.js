window.addEventListener("load", async (event) => {
    const errors = document.querySelector('.errors');

        errors.childNodes.forEach(error => {
            if (findText(error, 'username'))  {
                error.className = 'redBox'
            }
            if (findText(error, 'password')) {
                
            }
        });
});

function findText(error, errorName) {
    return error.innerText.includes(errorName)
}
