let apiLimit=1;
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
fetch(`https://json-api.uz/api/project/fn44-amaliyot/cars?limit=${apiLimit}&skip=${apiSkip}`)
.then(res=>res.json())
.then(res=>{
    skeletonUI(false,0);
    cardWrite(res.data,res.total)
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
    }));
    
    document.querySelectorAll(".js-car-add-favorite-btn")
    .forEach(el=>{
        el.addEventListener("click",
        (evt)=>{
            if(isLogined()==true) {
                infoAlert("Istaklar bo'limiga qo'shildi!");
            } else {
                infoAlert("Iltimos birinchi tizimga kiring!");
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
document.querySelector(".js-more-modal").classList.remove("hidden");
document.querySelector(".js-more-modal").classList.add("flex");
fetch(`https://json-api.uz/api/project/fn44-amaliyot/cars/${id}`)
.then(res=>res.json())
.then(res=>detailsContent(res))
function detailsContent(obj) {
let body=document.querySelector(".js-modal-body");
document.querySelector(".js-more-modal").classList.remove("opacity-[0]");
document.querySelector(".js-more-modal").classList.add("opacity-[1]");
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

/* Auth checker */
if(isLogined()==true) {
    document.querySelector(".js-login-btn").hidden=true;
    document.querySelector(".js-auth-managment ").hidden=false;
} else {
    document.querySelector(".js-login-btn").hidden=false;
    document.querySelector(".js-auth-managment ").hidden=true;
}