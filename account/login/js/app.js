document.getElementById("auth_login_form")
.addEventListener("submit",(evt)=>{
    evt.preventDefault();
    let x=[]
    document.getElementById("auth_login_form").querySelectorAll("input[type='text'], input[type='password']")
    .forEach(el=>{
        if(el.value.trim()=='') {
            x.push(el.ariaLabel);
        }
    })
    if(x.length!=0) {
        infoAlert(`Iltimos ${x[0]}-ni kiriting`);
        document.querySelector(`[aria-label='${x[0]}']`).focus()
    } else if(x.length==0) {
        let loginFormData = new FormData(document.getElementById("auth_login_form"));
        const loginReqeustObject = {
            username: loginFormData.get("username").trim(),
            password: loginFormData.get("password").trim() 
        };
        infoAlert("So'rov yuborilmoqda...")
        fetch("https://json-api.uz/api/project/fn44-amaliyot/auth/login",
            {
                method:"POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(loginReqeustObject)
            }
        )
        .then
        (res=>res.text())
        .then
        (res=>{
            if(res=="User not found (check username and password)") {
                errorAlert("Login yoki parol xato!");
            } else if(res!="Username already exists") {
                let authProfileObj = JSON.parse(res);
                localStorage.setItem("accessToken",authProfileObj["access_token"]);
                successAlert("Tizimga kirish muvaffaqiyatli.");
                setTimeout(()=>{                
                    window.location.href = location.origin;
                },2000)
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }
})

document.getElementById("password_show")
.addEventListener("click",(evt)=>{
    if(evt.target.checked==true) {
        document.querySelector(`[name="password"]`).type="text";
    } else {
        document.querySelector(`[name="password"]`).type="password";
    }
})

function infoAlert(text="Yuklanmoqda...") {
    let clone = document.querySelector(".js-info-alert-template").cloneNode(true).content;
    clone.querySelector("span").textContent=text;
    document.querySelector(".js-alert-wrapper-box").appendChild(clone);
    setTimeout(()=>{
    document.querySelector(".js-alert-wrapper-box").querySelector("[role='alert']")
    .classList.add("translate-y-[-150%]");
    },5000)
    setTimeout(()=>{
    document.querySelector(".js-alert-wrapper-box").querySelector("[role='alert']").remove();
    },7000)
}

function errorAlert(text="Xatolik... Qayta urining!") {
    let clone = document.querySelector(".js-error-alert-template").cloneNode(true).content;
    clone.querySelector("span").textContent=text;
    document.querySelector(".js-alert-wrapper-box").appendChild(clone);
    setTimeout(()=>{
    document.querySelector(".js-alert-wrapper-box").querySelector("[role='alert']")
    .classList.add("translate-y-[-150%]");
    },5000)
    setTimeout(()=>{
    document.querySelector(".js-alert-wrapper-box").querySelector("[role='alert']").remove();
    },7000)
}

function successAlert(text="Tizimga kirish muvaffaqiyatli.") {
    let clone = document.querySelector(".js-success-alert-template").cloneNode(true).content;
    clone.querySelector("span").textContent=text;
    document.querySelector(".js-alert-wrapper-box").appendChild(clone);
    setTimeout(()=>{
    document.querySelector(".js-alert-wrapper-box").querySelector("[role='alert']")
    .classList.add("translate-y-[-150%]");
    },5000)
    setTimeout(()=>{
    document.querySelector(".js-alert-wrapper-box").querySelector("[role='alert']").remove();
    },7000)
}
