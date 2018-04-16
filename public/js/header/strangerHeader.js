;(function loggedInHeader () {
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

  const header = document.getElementById('mainHeader')

  if (header.firstChild !== null) {
    header.removeChild(header.firstChild)
  }

  header.appendChild(menu)

  console.log(header.firstChild)
})()
