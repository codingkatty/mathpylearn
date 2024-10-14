function handleSubmit() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const rating = document.getElementById('rating').value;
    const comments = document.getElementById('comments').value;
    const responseMessage = document.getElementById('responseMessage');

    if (!name || !email || !rating || !comments) {
        responseMessage.textContent = 'Please fill in all the fields.';
        responseMessage.classList.add('error');
        return false;
    }

    responseMessage.textContent = `Thank you, ${name}, for your feedback!`;
    responseMessage.classList.remove('error');
    return false; // Prevents form submission for demo purposes
}
