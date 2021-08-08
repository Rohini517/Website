function detailsValidation(){
    var userName = document.registrationForm.username.value;
    var emailID = document.registrationForm.email.value;
    var password1 = document.registrationForm.password_1.value;
    var password2 = document.registrationForm.password_2.value;

    if (userName.length < 3){
        alert('Invalid user name');
        location.reload();
    }

    try{
        const atPostition = emailID.indexOf('@');
        const atDot = emailID.lastIndexOf('.');
        if (atPostition < 1 | atDot+2 >= emailID.length | atDot < atPostition+2){
            alert("Invalid Email ID");
            location.reload();
        }

    }
    catch(e){
        alert("Incorrect mail ID");
        location.reload();

    }

    if (password1.equals(password2) ){
        alert("Password didn't match");
        location.reload()
    }

     
}

function loginValidation(){
    var userName = document.loginForm.username.value;
    var password = document.loginForm.password.value;
    if (userName.length < 3){
        alert('Invalid user name');
        location.reload();
    }


}