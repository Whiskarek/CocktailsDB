export function removeValidation(element) {
    let errors = element.querySelectorAll('.error')

    for (let i = 0; i < errors.length; i++) {
        errors[i].classList.remove('error');
    }
}

export function generateError(element) {
    element.classList.add('error');
}