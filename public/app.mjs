// window.createPost = function () {
//     let title = document.querySelector('#title').value
//     let text = document.querySelector('#text').value
//     // event.preventDefault()
//     axios.post('/api/v1/mongoDB/post',{
//         title: title,
//         text: text
//     })
//     .then(function (response){
//         console.log(response)
//         // document.querySelector('#displayData').innerHTML = response
//         // getAllPosts()

// import { text } from "express";


//     })
//     .catch(function (error){
//         console.log(error)
//         alert('Error in post submission.')
//     })
// }

// import resp from './login.mjs';
const userEmail = sessionStorage.getItem('userEmail');
document.querySelector('#form1').addEventListener("submit", function (event) {
    event.preventDefault();

    let title = document.querySelector('#title').value
    let text = document.querySelector('#text').value
    // event.preventDefault()
    axios.post('/api/v1/mongoDB/post', {
        title: title,
        text: text
    })
    .then(function (response) {
            // let postBtn = document.querySelector('#post-btn')
            
            // postBtn.addEventListener("click", 
            // function create () {
                const popup = document.getElementById("popup");
                popup.style.display = "block";
                // const closeButton = document.getElementById("closeButton");
                
                // Function to show the popup
                // function showPopup() {
                    // Set timeout to hide the popup after 2 seconds (2000 milliseconds)
                    setTimeout(function () {
                        popup.style.display = "none";
                        // hidePopup();
                        getAllPosts();
                    }, 2000);
                    document.querySelector('#title').value = ''
                    document.querySelector('#text').value = ''
                    // }
            
            // Function to hide the popup
            // function hidePopup() {
            // }
            
            // Show the popup when needed (for example, after post creation)
            // showPopup();
            
            // Close the popup when the close button is clicked
            // closeButton.addEventListener("click", function () {
                //   hidePopup();
                // });
            // });
            // const responseData = JSON.parse(response.data)
            // console.log(response);
            // document.querySelector('#displayData').innerHTML = response.data
            // getAllPosts()
            
        })
        .catch(function (error) {
            console.log("err",error);
            alert('Error in post submission.');
        });
})


    window.getAllPosts = () => {
    axios.get('/api/v1/mongoDB/posts')
        .then(function (response) {
            // console.log(response.data);
            let showPosts = "";
            response.data.map((eachPost) => {
                console.log(eachPost)
                showPosts +=
                    `
            <div class='post-div' id="card-${eachPost._id}">  
            <h3 class='post-h3'>${eachPost.title}</h3>
            <p class='post-p'>${eachPost.text}</p>
            <button class='post-edit' onclick="editPost('${eachPost._id}','${eachPost.title}','${eachPost.text}','${eachPost.from}')">Edit</button>
            <button class='post-del' onclick="delPost('${eachPost._id}','${eachPost.from}')">Delete</button>
            </div>
            <br>
             `;
            });
            document.querySelector('#displayPosts').innerHTML = showPosts;
        })
        .catch(function (error) {
            console.log(error);
            // alert("Something went wrong");

            if(error.response.status === 401){
                location.href = '/login.html'
            }
        });
}
    
//     window.delPost = function (postId , from) {
//         axios.delete(`api/v1/mongoDB/post/${postId}`)
//         .then(function (){
//             console.log(postId)
//             if(from === userEmail){
//                 getAllPosts()
//             }else{
//                 alert('You are not authorized to delete this post.')
//             }
//     })
//     .catch(function (error){
//         console.log(error)
//         alert('Error in data deleting.')
//     })
// }

window.delPost = function (postId, from) {
    if (from === userEmail) {
        axios.delete(`api/v1/mongoDB/post/${postId}`)
        .then(function (){
            console.log(postId);
            getAllPosts();
        })
        .catch(function (error){
            console.log(error);
            alert('Error in data deleting.');
        });
    } else {
        alert('You are not authorized to delete this post.');
    }
}

window.editPost = function(postId , title , text , from) {
    console.log("_id: ",postId , "title: ",title, "text: ",text , "from: ",from ,)
    if (from === userEmail){
    document.querySelector(`#card-${postId}`).innerHTML = 
    `
    <form onsubmit="save('${postId}')">
    <label>Title: </label><input class='edit-title' type="text" name="" id="title-${postId}" value="${title}"><br>
    <label>Text: </label><textarea class='edit-textarea' name="" id="text-${postId}" cols="30" rows="10" value="">${text}</textarea><br>
    <button class='save'>Save</button>
    </form>
    
    `}else {
        alert('You are not authorized to edit this post.');
    }
    // console.log()
}

window.save = function(postId) {
    // console.log(postId)
    const updatedTitle = document.querySelector(`#title-${postId}`).value;
    const updatedText= document.querySelector(`#text-${postId}`).value;
    // console.log(updatedTitle)
    axios.put(`/api/v1/mongoDB/post/${postId}`,{
        title: updatedTitle,
        text: updatedText
    })
    .then(function (response){
        console.log(response.data)
    })
    .catch(function (error){
        console.log(error)
        alert('Error in post submission.')
    })
}

// Logout process
document.querySelector('#logoutButton').addEventListener('click', async () => {
    try {
        // Send a request to the server to clear the httpOnly cookie
        await axios.get('/api/v1/mongoDB/logout');

        // Remove user token and email from sessionStorage
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userToken');

        // Redirect to login page
        window.location.href = '/login.html';
    } catch (error) {
        console.log(error);
    }
});

document.addEventListener('DOMContentLoaded', function(){
    getAllPosts()
    })