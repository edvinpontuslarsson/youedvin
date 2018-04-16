;(function loggedInHeader () {
    const menu = document.createElement('ul')
    menu.innerHTML = `
        <li class="menuItem">
            <a href="/">Home Page</a>
        </li>
        <li class="menuItem">
            <a href="/logout" class="menuLink>Log out</a>
        </li>
        <li class="menuItem">
            <a href="/upload" class="menuLink>Upload video!</a>
        </li>
      `
  
    const header = document.querySelector('#mainHeader')
    console.log(header)
    console.log(header.firstElementChild)
    if (header.firstElementChild !== null) {
      header.removeChild(header.firstElementChild)
    }
    // console.log(header)
    // header.appendChild(menu)
})()
