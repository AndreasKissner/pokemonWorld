function renderHeader(pokemon){
    let headerContent = document.getElementById("header");
    headerContent.innerHTML = getHeaderTemplate();
}

function renderFooter(){
    let footerContent = document.getElementById("footer");
    footerContent.innerHTML = getFooterTemplate();
}
