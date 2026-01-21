/* Auth checker */
AuthChecker()
function AuthChecker() {
if(isLogined()==true) {
    document.querySelector(".js-auth-managment").classList.remove("hidden");
    document.querySelector(".js-auth-managment").classList.add("flex");
    document.getElementById("main_box_container").classList.remove("mb-[0px]","sm:mb-[0px]");
    document.getElementById("main_box_container").classList.add("mb-[50px]","sm:mb-[65px]");
} else {
    document.querySelector(".js-login-btn").classList.remove("hidden");
    document.querySelector(".js-login-btn").classList.add("flex");
    document.getElementById("main_box_container").classList.remove("mb-[50px]","sm:mb-[65px]");
    document.getElementById("main_box_container").classList.add("mb-[0px]","sm:mb-[0px]");
    localStorage.removeItem("userProfile");
}
}

let apiLimit=15;
let apiSkip=0;

function skeletonUI (bool=true,limit=10) {
    if(bool==true) {
        document.querySelector(".js-more-down").style.display="none";
        Array.from({length:limit})
        .forEach(()=>{
            let clone = document.getElementById("car_card_skeleton_template").cloneNode(true).content;
            document.querySelector(".js-cards-skeleton-box").append(clone);
        })
    } else {
        document.querySelector(".js-cards-skeleton-box").innerHTML=null;
        document.querySelector(".js-more-down").style.display="flex";
    }
};

mainRequest();
function mainRequest() {
skeletonUI(true,apiLimit);
fetch(`https://json-api.uz/api/project/fn44-amaliyot/cars?=${apiLimit}`)
.then(res=>res.text())
.then(res=>{
    if(res!="Iltimos domainlar ro'yxatiga ushbu manzilni qo'shing") {
        let resParsed = JSON.parse(res);
        skeletonUI(false,0);
        cardWrite(resParsed.data,resParsed.total);
    } else if(res=="Iltimos domainlar ro'yxatiga ushbu manzilni qo'shing") {
        console.log("Serverda xatolik bo'ldi");
        document.querySelector(".js-api-error").classList.remove("hidden");
        document.querySelector(".js-api-error").classList.add("flex");
    }
})

function cardWrite(response,total) {
    let elArray = [];
    response.forEach(el=>elArray.push(el));
    elArray.forEach(el=>{
        let clone=document.getElementById("car_card_template").cloneNode(true).content;
        clone.querySelector(`[data-txt="name"]`).textContent=el.name?el.name:"No data";
        clone.querySelector(`[data-txt="year"]`).textContent=el.year?el.year:"No data";
        clone.querySelector(`[data-txt="engine"]`).textContent=el.engine?el.engine:"No data";
        clone.querySelector(`[data-txt="category"]`).textContent=el.category?el.category:"No data";
        clone.querySelector(`[data-txt="colorName"]`).textContent=el.colorName?el.colorName:"No data";
        clone.querySelector(`[data-btn="more_detail"]`).setAttribute("data-detail-id",el.id?el.id:"null");
        clone.querySelector(`[data-btn="add_favorite"]`).setAttribute("data-favorite-id",el.id?el.id:"null");
        clone.querySelector(`[data-btn="add_favorite"]`).classList.add("favorited_false");
        if(localStorage.getItem("favorites_list")) {
            let favorite_list = JSON.parse(localStorage.getItem("favorites_list"));
            favorite_list.forEach(els=>{
                if(el.id==els) {
                    clone.querySelector(`[data-btn="add_favorite"]`).setAttribute("data-tip","Istaklardan o'chirish");
                    clone.querySelector(`[data-btn="add_favorite"]`).classList.remove("favorited_false");
                    clone.querySelector(`[data-btn="add_favorite"]`).classList.add("favorited_true");
                    clone.querySelector(`[data-btn="add_favorite"]`).innerHTML=
                    `<svg class="pointer-events-none" width="22" height="22" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.35248 4.90532C1.35248 2.94498 2.936 1.35248 4.89346 1.35248C6.25769 1.35248 6.86058 1.92336 7.50002 2.93545C8.13946 1.92336 8.74235 1.35248 10.1066 1.35248C12.064 1.35248 13.6476 2.94498 13.6476 4.90532C13.6476 6.74041 12.6013 8.50508 11.4008 9.96927C10.2636 11.3562 8.92194 12.5508 8.00601 13.3664C7.94645 13.4194 7.88869 13.4709 7.83291 13.5206C7.64324 13.6899 7.3568 13.6899 7.16713 13.5206C7.11135 13.4709 7.05359 13.4194 6.99403 13.3664C6.0781 12.5508 4.73641 11.3562 3.59926 9.96927C2.39872 8.50508 1.35248 6.74041 1.35248 4.90532Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`;
                }
            })
        }
        document.querySelector(".js-cards-main-box").append(clone);
    })
    elArray=[];
    if(apiSkip>total) {
        document.querySelector(".js-more-down").style.display="none";
    }
    document.querySelector(".js-more-down").disabled=false;
    document.querySelectorAll(".js-car-more-detail-btn")
    .forEach(el=>el.addEventListener("click",(evt)=>{
        detailsUiWrite(evt.target.getAttribute("data-detail-id"));
        document.querySelector(".js-more-loader").classList.remove("hidden");
        document.querySelector(".js-more-loader").classList.add("flex");
        setTimeout(()=>{
        document.querySelector(".js-more-loader").classList.remove("opacity-[0]");
        document.querySelector(".js-more-loader").classList.add("opacity-[1]");
        },1200)
    }));
    
    document.querySelectorAll(".js-car-add-favorite-btn")
    .forEach(el=>{
        el.addEventListener("click",
        (evt)=>{
            if(isLogined()==true) {
                if(evt.target.classList.contains("favorited_false")==true) {
                    mainpulationFavorites(evt.target.getAttribute(`data-favorite-id`));
                    
                } else if(evt.target.classList.contains("favorited_true")==true) {
                    removeElementFavorites(evt.target.getAttribute(`data-favorite-id`));
                }
            } else {
                infoAlert("Iltimos birinchi tizimga kiring!");
                document.querySelector(".js-login-btn").hidden=false;
                document.querySelector(".js-auth-managment ").hidden=true;
                AuthChecker();
                setTimeout(()=>{
                    window.location.href=window.origin+`/account/login/index.html`;
                },5000)
            }
        })
    })
};
};

document.querySelector(".js-more-down").addEventListener("click",()=>{
    apiSkip+=apiLimit;
    document.querySelector(".js-more-down").disabled=true;
    mainRequest();
});
function detailsUiWrite(id) {

fetch(`https://json-api.uz/api/project/fn44-amaliyot/cars/${id}`)
.then(res=>res.json())
.then(res=>{
    document.querySelector(".js-more-loader").classList.remove("flex");
    document.querySelector(".js-more-loader").classList.add("hidden");
    setTimeout(()=>{
    document.querySelector(".js-more-loader").classList.remove("opacity-[1]");
    document.querySelector(".js-more-loader").classList.add("opacity-[0]");
    },1200)
    detailsContent(res)
})
function detailsContent(obj) {
document.querySelector(".js-more-modal").classList.remove("hidden");
document.querySelector(".js-more-modal").classList.add("flex");
/*  *  */
let body=document.querySelector(".js-modal-body");
body.querySelector(`[data-txt="name"]`).textContent=obj.name?obj.name:"Noma'lum";
body.querySelector(`[data-txt="trim"]`).textContent=obj.trim?obj.trim:"Noma'lum";
body.querySelector(`[data-txt="country"]`).textContent=obj.country?obj.country:"Noma'lum";
body.querySelector(`[data-txt="generation"]`).textContent=obj.generation?obj.generation:"Noma'lum";
body.querySelector(`[data-txt="colorName"]`).textContent=obj.colorName?obj.colorName:"Noma'lum";
body.querySelector(`[data-txt="doorCount"]`).textContent=obj.doorCount?obj.doorCount:"Noma'lum";
body.querySelector(`[data-txt="seatCount"]`).textContent=obj.seatCount?obj.seatCount:"Noma'lum";
body.querySelector(`[data-txt="maxSpeed"]`).textContent=obj.maxSpeed?obj.maxSpeed:"Noma'lum";
body.querySelector(`[data-txt="acceleration"]`).textContent=obj.acceleration?obj.acceleration:"Noma'lum";
body.querySelector(`[data-txt="engine"]`).textContent=obj.engine?obj.engine:"Noma'lum";
body.querySelector(`[data-txt="horsepower"]`).textContent=obj.horsepower?obj.horsepower:"Noma'lum";
body.querySelector(`[data-txt="description"]`).textContent=obj.description?obj.description:"Noma'lum";
body.querySelector(`[data-txt="fuelType"]`).textContent=obj.fuelType?obj.fuelType:"Noma'lum";
body.querySelector(`[data-txt="city"]`).textContent=obj.fuelConsumption.city?obj.fuelConsumption.city:"Noma'lum";
body.querySelector(`[data-txt="highway"]`).textContent=obj.fuelConsumption.highway?obj.fuelConsumption.highway:"Noma'lum";
body.querySelector(`[data-txt="combined"]`).textContent=obj.fuelConsumption.combined?obj.fuelConsumption.combined:"Noma'lum";
setTimeout(()=>{
document.querySelector(".js-more-modal").classList.remove("opacity-[0]");
document.querySelector(".js-more-modal").classList.add("opacity-[1]");
},1200)
}
}

document.querySelector(".js-details-modal-close")
.addEventListener("click",()=>{
document.querySelector(".js-more-modal").classList.remove("flex");
document.querySelector(".js-more-modal").classList.add("hidden");
document.querySelector(".js-more-modal").classList.remove("opacity-[1]");
document.querySelector(".js-more-modal").classList.add("opacity-[0]");
let body=document.querySelector(".js-modal-body");
body.querySelectorAll(".js-details-txt").forEach(el=>{
    el.textContent="Noma'lum";
})
});

function isLogined() {
    if(localStorage.getItem("accessToken")) {
        return true;
    } else if(!(localStorage.getItem("accessToken"))) {
        return false;
    }
}


/* Favorites Logic */

function mainpulationFavorites(id) {
    if(localStorage.getItem("favorites_list")) {
        let old_list=JSON.parse(localStorage.getItem("favorites_list"));
        let old_uniqe_list = new Set(old_list);
        let new_list = Array.from(old_uniqe_list);
        new_list.push(Number(id));
        let new_uniqe_list = new Set(new_list);
        localStorage.setItem("favorites_list",JSON.stringify(Array.from(new_uniqe_list)));
        successAlert("Istaklar ro'yxatiga qo'shildi!");
        document.querySelector(`[data-favorite-id='${id}']`).setAttribute("data-tip","Istaklardan o'chirish");
        document.querySelector(`[data-favorite-id='${id}']`).innerHTML=
        `<svg class="pointer-events-none" width="22" height="22" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.35248 4.90532C1.35248 2.94498 2.936 1.35248 4.89346 1.35248C6.25769 1.35248 6.86058 1.92336 7.50002 2.93545C8.13946 1.92336 8.74235 1.35248 10.1066 1.35248C12.064 1.35248 13.6476 2.94498 13.6476 4.90532C13.6476 6.74041 12.6013 8.50508 11.4008 9.96927C10.2636 11.3562 8.92194 12.5508 8.00601 13.3664C7.94645 13.4194 7.88869 13.4709 7.83291 13.5206C7.64324 13.6899 7.3568 13.6899 7.16713 13.5206C7.11135 13.4709 7.05359 13.4194 6.99403 13.3664C6.0781 12.5508 4.73641 11.3562 3.59926 9.96927C2.39872 8.50508 1.35248 6.74041 1.35248 4.90532Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`;
        document.querySelector(`[data-favorite-id='${id}']`).classList.remove("favorited_false");
        document.querySelector(`[data-favorite-id='${id}']`).classList.add("favorited_true");
    } else {
        let x = [];x.push(Number(id));
        localStorage.setItem("favorites_list",JSON.stringify(x));
        successAlert("Istaklar ro'yxatiga qo'shildi!");
        document.querySelector(`[data-favorite-id='${id}']`).setAttribute("data-tip","Istaklardan o'chirish");
        document.querySelector(`[data-favorite-id='${id}']`).innerHTML=
        `<svg class="pointer-events-none" width="22" height="22" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.35248 4.90532C1.35248 2.94498 2.936 1.35248 4.89346 1.35248C6.25769 1.35248 6.86058 1.92336 7.50002 2.93545C8.13946 1.92336 8.74235 1.35248 10.1066 1.35248C12.064 1.35248 13.6476 2.94498 13.6476 4.90532C13.6476 6.74041 12.6013 8.50508 11.4008 9.96927C10.2636 11.3562 8.92194 12.5508 8.00601 13.3664C7.94645 13.4194 7.88869 13.4709 7.83291 13.5206C7.64324 13.6899 7.3568 13.6899 7.16713 13.5206C7.11135 13.4709 7.05359 13.4194 6.99403 13.3664C6.0781 12.5508 4.73641 11.3562 3.59926 9.96927C2.39872 8.50508 1.35248 6.74041 1.35248 4.90532Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`;
        document.querySelector(`[data-favorite-id='${id}']`).classList.remove("favorited_false");
        document.querySelector(`[data-favorite-id='${id}']`).classList.add("favorited_true");
    }
};

function removeElementFavorites(id) {
    let old_data = JSON.parse(localStorage.getItem("favorites_list"));
    let new_filtered_array=old_data.filter(el=>{
        if(el!=id) return el;
        else return false;
    })
    localStorage.setItem("favorites_list",JSON.stringify(new_filtered_array));
    successAlert("Istaklar ro'yxatidan o'chirildi!");
    document.querySelector(`[data-favorite-id='${id}']`).setAttribute("data-tip","Istaklarga qo'shish");
    document.querySelector(`[data-favorite-id='${id}']`).innerHTML=
    `<svg class="pointer-events-none" width="22" height="22" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.89346 2.35248C3.49195 2.35248 2.35248 3.49359 2.35248 4.90532C2.35248 6.38164 3.20954 7.9168 4.37255 9.33522C5.39396 10.581 6.59464 11.6702 7.50002 12.4778C8.4054 11.6702 9.60608 10.581 10.6275 9.33522C11.7905 7.9168 12.6476 6.38164 12.6476 4.90532C12.6476 3.49359 11.5081 2.35248 10.1066 2.35248C9.27059 2.35248 8.81894 2.64323 8.5397 2.95843C8.27877 3.25295 8.14623 3.58566 8.02501 3.88993C8.00391 3.9429 7.98315 3.99501 7.96211 4.04591C7.88482 4.23294 7.7024 4.35494 7.50002 4.35494C7.29765 4.35494 7.11523 4.23295 7.03793 4.04592C7.01689 3.99501 6.99612 3.94289 6.97502 3.8899C6.8538 3.58564 6.72126 3.25294 6.46034 2.95843C6.18109 2.64323 5.72945 2.35248 4.89346 2.35248ZM1.35248 4.90532C1.35248 2.94498 2.936 1.35248 4.89346 1.35248C6.0084 1.35248 6.73504 1.76049 7.20884 2.2953C7.32062 2.42147 7.41686 2.55382 7.50002 2.68545C7.58318 2.55382 7.67941 2.42147 7.79119 2.2953C8.265 1.76049 8.99164 1.35248 10.1066 1.35248C12.064 1.35248 13.6476 2.94498 13.6476 4.90532C13.6476 6.74041 12.6013 8.50508 11.4008 9.96927C10.2636 11.3562 8.92194 12.5508 8.00601 13.3664C7.94645 13.4194 7.88869 13.4709 7.83291 13.5206C7.64324 13.6899 7.3568 13.6899 7.16713 13.5206C7.11135 13.4709 7.05359 13.4194 6.99403 13.3664C6.0781 12.5508 4.73641 11.3562 3.59926 9.96927C2.39872 8.50508 1.35248 6.74041 1.35248 4.90532Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`;
    document.querySelector(`[data-favorite-id='${id}']`).classList.remove("favorited_true");
    document.querySelector(`[data-favorite-id='${id}']`).classList.add("favorited_false");
}

/* UI Features */

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

function successAlert(text="Muvaffaqiyatli!") {
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

