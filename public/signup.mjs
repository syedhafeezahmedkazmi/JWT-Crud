document.querySelector('#signupForm').addEventListener('submit', async (event)=>{
    event.preventDefault()

    const firstName = document.querySelector('#firstName').value
    const lastName = document.querySelector('#lastName').value
    const email = document.querySelector('#emailInput').value
    const password = document.querySelector('#passwordInput').value

    try {
        await axios.post('api/v1/mongoDB/signup',{
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        })

        window.location.href = '/login.html'
    } catch (error) {
        console.log(error)
    }
})