function initialLoad() {
    // redirect if width < 768px
    if (window.innerWidth < 1000) {
        // redirect url
        window.location.replace('/mobile');
    }
}
