;(function loggedInHeader () {
    console.log('Hello World!')

    const menu = document.createElement('ul')
    menu.innerHTML = `
        <li class="menuItem">
            <a href="/" class="menuLink">Home Page</a>
        </li>
        <li class="menuItem">
            <a href="/login" class="menuLink">Log in!</a>
        </li>
        <li class="menuItem">
            <a href="/presignup" class="menuLink">Sign up!</a>
        </li>
    `
    menu.classList.add('menu')

    const header = document.getElementById('header')

    if (header.firstChild !== null) {
        console.log('Remove child')
    }

    header.appendChild(menu)
})()
