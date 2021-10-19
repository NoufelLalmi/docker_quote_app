/* eslint-env browser */
// main.js


var button2 = document.querySelector('.myButton');
console.log(button2)

button2.addEventListener('click', function (e) {
  console.log('button was clicked');
  fetch('/quotes', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: button2.name
      })
    })
    .then(function (response) {
      if (response.ok) {
        console.log('Click was recorded');
        window.location.reload(true)
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function (error) {
      console.log(error);
    });
});
// update.addEventListener('click', _ => {
//   fetch('/quotes', {
//     method: 'put',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       name: 'Darth Vadar',
//       quote: 'I find your lack of faith disturbing.'
//     })
//   })
//     .then(res => {
//       if (res.ok) return res.json()
//     })
//     .then(response => {
//       window.location.reload(true)
//     })
// })