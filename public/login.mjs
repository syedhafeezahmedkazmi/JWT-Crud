document.querySelector('#loginForm').addEventListener('submit',async(event)=>{
    event.preventDefault()

    const email = document.querySelector('#emailInput').value
    const password = document.querySelector('#passwordInput').value

    try {
        const resp = await axios.post('/api/v1/mongoDB/login',{
            email: email,
            password: password
        })
        
        console.log('response: ', resp)

        if(resp.status === 200){
            sessionStorage.setItem('userEmail', email);
            window.location.href = '/index.html'
        }
    } catch (error) {
        console.log(error)
    }
})

//export {email};