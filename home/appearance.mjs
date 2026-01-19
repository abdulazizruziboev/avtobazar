if(!(localStorage.getItem("theme_mode"))) {
    localStorage.setItem("theme_mode","light");
} else if(localStorage.getItem("theme_mode")=="light") {
    document.querySelector("html").setAttribute("data-theme","light");
    document.querySelector("html").classList.remove("dark");
    document.querySelector("html").classList.add("light");
    document.querySelector(".js-toggler-light-icon").style.display="none";
    document.querySelector(".js-toggler-dark-icon").style.display="inline-block";
} else if(localStorage.getItem("theme_mode")=="dark") {
    document.querySelector("html").setAttribute("data-theme","dark");
    document.querySelector("html").classList.remove("light");
    document.querySelector("html").classList.add("dark");
    document.querySelector(".js-toggler-dark-icon").style.display="none";
    document.querySelector(".js-toggler-light-icon").style.display="inline-block";
};
document.querySelector(".js-theme-toggler").addEventListener("click",()=>{
    if(localStorage.getItem("theme_mode")=="light") {
        localStorage.setItem("theme_mode","dark");
        document.querySelector("html").setAttribute("data-theme","dark");
        document.querySelector("html").classList.remove("light");
        document.querySelector("html").classList.add("dark");
        document.querySelector(".js-toggler-dark-icon").style.display="none";
        document.querySelector(".js-toggler-light-icon").style.display="inline-block";
    } else {
        localStorage.setItem("theme_mode","light");
        document.querySelector("html").setAttribute("data-theme","light");
        document.querySelector("html").classList.remove("dark");
        document.querySelector("html").classList.add("light");
        document.querySelector(".js-toggler-dark-icon").style.display="inline-block";
        document.querySelector(".js-toggler-light-icon").style.display="none";
    }
});

setTimeout(()=>{
    document.querySelector(".js-main-loader").classList.add("opacity-[0]");
    document.querySelector(".js-main-loader").classList.add("translate-y-[-100%]");
},3000)

setTimeout(()=>{
    document.querySelector(".js-main-loader").classList.remove("flex");
    document.querySelector(".js-main-loader").classList.add("hidden");
},5000)