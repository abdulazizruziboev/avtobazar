document.getElementById("auth_register_form")
.addEventListener("submit",(evt)=>{
    evt.preventDefault();
    let x=[]
    document.getElementById("auth_register_form").querySelectorAll("input[type='text'], input[type='password']")
    .forEach(el=>{
        if(el.value.trim()=='') {
            x.push(el.ariaLabel);
        }
    })
    if(x.length!=0) {
        infoAlert(`Iltimos ${x[0]}-ni kiriting`);
        document.querySelector(`[aria-label='${x[0]}']`).focus()
    } else if(x.length==0) {
        let registerFormData = new FormData(document.getElementById("auth_register_form"));
        const registerReqeustObject = {
            username: registerFormData.get("username").trim(),
            password: registerFormData.get("password").trim() 
        };
        infoAlert("So'rov yuborilmoqda...");
        animationReq(true);
        document.querySelector("#registerBtn").disabled=true;
        fetch("https://json-api.uz/api/project/fn44-amaliyot/auth/register",
            {
                method:"POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(registerReqeustObject)
            }
        )
        .then
        (res=>res.text())
        .then
        (res=>{
            if(res=="Username already exists") {
                document.querySelector("#registerBtn").disabled=false;
                animationReq(false);
                errorAlert("Bunday login-ga ega hisob mavjud");
            } else if(res!="Username already exists") {        
                let authProfileObj = JSON.parse(res);
                localStorage.setItem("accessToken",authProfileObj["access_token"]);
                localStorage.setItem("userProfile",res);
                animationReq(false);
                successAlert("Ro'yxatdan o'tish muvaffaqiyatli.");
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

function successAlert(text="Ro'yxatdan o'tish muvaffaqiyatli.") {
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

function animationReq(bool){
if(bool==true) {
document.querySelector(".js-request-loader").classList.remove("hidden");
document.querySelector(".js-request-loader").classList.add("flex");
setTimeout(()=>{
    document.querySelector(".js-request-loader").classList.remove("opacity-[0]");
document.querySelector(".js-request-loader").classList.add("opacity-[1]");
},1500)
} else if(bool==false) {
document.querySelector(".js-request-loader").classList.remove("flex");
document.querySelector(".js-request-loader").classList.add("hidden");
setTimeout(()=>{
    document.querySelector(".js-request-loader").classList.remove("opacity-[1]");
document.querySelector(".js-request-loader").classList.add("opacity-[0]");
},1500)
}
}